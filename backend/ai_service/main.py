import os
import json
import re
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
import uvicorn
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(
    title="Synapse.AI - iNSIGHTS Layer 2 Microservice",
    description="Python FastAPI service handling DeepSearch, Knowledge Clustering, and Project HUB roadmap generation",
    version="3.0.0"
)

# --- Data Schemas ---

class UserPreferences(BaseModel):
    aboutUser: Optional[str] = ""
    personaMode: Optional[str] = "HACKATHON_SPRINT"
    preferredFrontend: Optional[str] = "React"
    preferredBackend: Optional[str] = "Express"
    preferredDatabase: Optional[str] = "Firebase"

class DeepSearchRequest(BaseModel):
    workspaceId: str
    rawIdea: str
    personaMode: Optional[str] = "HACKATHON_SPRINT"
    userPreferences: Optional[UserPreferences] = None

class ClusterRequest(BaseModel):
    workspaceId: str
    rawIdea: str
    deepsearch: Optional[Dict[str, Any]] = None

class ProjectHubRequest(BaseModel):
    workspaceId: str
    rawIdea: str
    userPreferences: Optional[UserPreferences] = None

# --- SYSTEM MASTER PROMPT ---

MASTER_SYSTEM_PROMPT = """
You are Synapse.AI, an elite Principal System Architect, AI Systems Engineer, and Lead Scientific Researcher.
Your task is to analyze technical project ideas and generate domain-authentic research citations, state-of-the-art solution matrices, Mermaid system architectures, and production execution roadmaps.

<chain_of_thought_mandate>
CRITICAL FIRST STEP:
You MUST populate the "domain_analysis" field at the very top of your JSON response BEFORE generating any arrays, citations, SOTA matrices, or tech stacks.
In "domain_analysis", explicitly define:
1. The exact industry/vertical (e.g., Aerospace, Scooter Logistics, MedTech, High-Frequency Trading, Web3).
2. The core technical constraints (e.g., "Requires mobile-first GIS/GPS tracking, spatial database routing, low-latency streaming, no web-only SaaS defaults").
All downstream JSON fields MUST strictly inherit and conform to the context established in "domain_analysis".
</chain_of_thought_mandate>

<schema>
Every JSON output MUST include "domain_analysis" as its very first key:
{
  "domain_analysis": "Industry: [Defined Industry]. Core Constraints: [Specific technical requirements & non-negotiables].",
  ... (remaining domain-specific response fields)
}
</schema>

<domain_rules>
1. INHERIT CONTEXT STRICTLY:
   - All Tech Stack recommendations, SOTA Matrix categories, citations, and system architecture components MUST directly derive from the "domain_analysis".
2. VERTICAL-SPECIFIC ARCHITECTURAL CHOICES:
   - Logistics / Fleet / Mobility / Scooter Apps: Require Mobile Native (Kotlin/Swift/Flutter), PostGIS / Spatial Indexing, OpenStreetMap / Mapbox APIs, WebSockets / MQTT, Go / Rust microservices.
   - Aerospace / Defense / Embedded / Avionics: Require Embedded C++20, Rust, RTOS (FreeRTOS/VxWorks), FPGA/CUDA, ROS 2, gRPC, Apache Kafka, TimescaleDB/InfluxDB.
   - FinTech / High-Frequency Trading / Fraud: Require Java 21, Go, Rust, Apache Flink, Redis Cluster, CockroachDB, gRPC.
   - MedTech / BioTech / Imaging: Require Python (PyTorch/MONAI), C++ (VTK/ITK), DICOM APIs, PostgreSQL, AWS S3.
   - General Web / SaaS (ONLY when explicitly requested): Require React 18, Next.js, Node.js/Express, Python FastAPI, PostgreSQL/Firestore.
</domain_rules>

<anti_hallucination>
1. NO OFF-TOPIC OR UNRELATED PAPERS:
   - ABSOLUTELY FORBIDDEN: Do NOT cite particle physics (CERN, Large Hadron Collider, Higgs boson), generic oncology/cancer papers, or unrelated quantum physics unless the prompt explicitly asks for them.
   - For a scooter/logistics app, cite spatial database optimization, fleet routing algorithms, dynamic vehicle routing problem (DVRP), or battery telemetry analysis.
2. NO PROMPT BLEED OR MAD-LIBS TITLES:
   - Do NOT generate fake paper titles by copying user words verbatim into templates like "A Survey on [User Word]".
   - Generate highly plausible, domain-specific academic search queries and established research literature topics (e.g., "IEEE Transactions on Intelligent Transportation Systems", "PostGIS Spatial Indexing Benchmarks", "Dynamic Vehicle Routing with Time Windows").
3. ACCURATE CITATION URLS:
   - URLs MUST be valid arXiv abstract links (e.g., https://arxiv.org/abs/2304.08123) or real GitHub topic links (e.g., https://github.com/topics/vehicle-routing).
</anti_hallucination>

<banned_defaults>
STRICTLY FORBIDDEN DEFAULTING:
- Do NOT default to React, Tailwind, Node.js, and Firebase unless "domain_analysis" explicitly identifies a standard web application dashboard.
- For mobile, embedded, logistics, aerospace, or fintech applications, you MUST recommend domain-authentic native languages, specialized databases, and real-time streaming buses.
</banned_defaults>

STRICT JSON OUTPUT ONLY:
Output raw valid JSON ONLY matching the requested schema. Do not include markdown fences or conversational preambles.
"""

def call_gemini_json(prompt: str, system_prompt: str) -> Optional[Dict[str, Any]]:
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        return None
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json"}
    }
    combined_system_prompt = MASTER_SYSTEM_PROMPT + "\n" + system_prompt
    payload["systemInstruction"] = {"parts": [{"text": combined_system_prompt}]}
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=12) as response:
            res = json.loads(response.read().decode("utf-8"))
            text = res["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(text)
    except Exception as e:
        print(f"⚠️ Gemini API direct call notice: {e}")
        return None

# All recognized domain tags
ALL_DOMAINS = [
    "AEROSPACE_EMBEDDED",
    "HEALTHTECH",
    "LOGISTICS_FLEET",
    "FINTECH",
    "EMBEDDED_IOT",
    "CYBERSECURITY",
    "EDTECH",
    "AGRITECH",
    "CLIMATE_ENERGY",
    "NLP_LLM",
    "ROBOTICS_AUTOMATION",
    "GAMING_XR",
    "SMART_CITY",
    "SUPPLY_CHAIN",
    "MANUFACTURING",
    "WEB3_BLOCKCHAIN",
    "SOCIAL_CIVIC",
    "GENERAL_SOFTWARE"
]

def detect_domain_keywords(raw_idea: str) -> Optional[str]:
    """Fast local keyword pass. Returns domain string or None if no match.
    NOTE: Order matters — more specific checks run before broader ones."""
    idea_lower = raw_idea.lower()

    # --- HIGHEST SPECIFICITY FIRST ---

    # AgriTech BEFORE Aerospace (satellite is also used in crop monitoring)
    if any(k in idea_lower for k in [
        "farm", "crop", "agriculture", "irrigation", "soil", "harvest",
        "precision farming", "agri", "pest", "fertilizer", "greenhouse", "yield", "livestock"
    ]):
        return "AGRITECH"

    # Robotics BEFORE Logistics (warehouse robot != warehouse logistics)
    if any(k in idea_lower for k in [
        "robot", "manipulator", "ros", "ros2", "slam", "path planning",
        "industrial automation", "conveyor", "actuator", "servo", "assembly line"
    ]):
        return "ROBOTICS_AUTOMATION"

    # Web3 BEFORE Gaming (smart contract != game contract)
    if any(k in idea_lower for k in [
        "web3", "dao", "smart contract", "solidity", "ethereum", "polygon",
        "ipfs", "decentral", "on-chain", "defi", "nft", "token"
    ]):
        return "WEB3_BLOCKCHAIN"

    # Social/Civic BEFORE Gaming (community != game community)
    if any(k in idea_lower for k in [
        "nonprofit", "ngo", "volunteer", "charity",
        "accessibility", "disability", "mental health", "addiction", "homeless",
        "food bank", "shelter", "civic tech"
    ]):
        return "SOCIAL_CIVIC"

    # --- BROAD TECHNICAL DOMAINS ---

    if any(k in idea_lower for k in [
        "jet", "supersonic", "telemetry", "flight", "drone", "aerospace", "avionics",
        "radar", "rocket", "rtos", "satellite", "uav", "autopilot",
        "propulsion", "missile", "ballistic", "altimeter"
    ]):
        return "AEROSPACE_EMBEDDED"

    if any(k in idea_lower for k in [
        "medical", "cancer", "health", "dicom", "imaging", "patient", "clinical",
        "hospital", "retinal", "retina", "ophthalm", "diagnostic", "patholog",
        "histolog", "mri", "ct scan", "x-ray", "xray", "ultrasound", "diabetic",
        "vascular", "fundus", "lesion", "tumour", "tumor", "cardiac", "ecg", "eeg",
        "ehr", "fhir", "hl7", "radiology", "rural clinic", "telemedicine", "biotech",
        "genomic", "dna", "protein", "drug discovery", "pharma"
    ]):
        return "HEALTHTECH"

    if any(k in idea_lower for k in [
        "scooter", "logistics", "fleet", "gis", "gps", "vehicle", "traffic",
        "delivery", "routing", "last-mile", "dispatch", "warehouse",
        "shipment", "cargo", "truck", "parcel", "courier"
    ]):
        return "LOGISTICS_FLEET"

    if any(k in idea_lower for k in [
        "trading", "stock", "fraud", "banking", "fintech", "payment", "crypto",
        "blockchain", "wallet", "ledger", "kyc", "aml", "forex",
        "exchange", "brokerage", "portfolio", "hedge fund"
    ]):
        return "FINTECH"

    if any(k in idea_lower for k in [
        "microcontroller", "arduino", "raspberry pi", "iot", "bluetooth",
        "zigbee", "edge device", "edge hardware", "tinyml", "embedded sensor",
        "lora", "lorawan", "modbus", "canbus", "fieldbus"
    ]):
        return "EMBEDDED_IOT"

    if any(k in idea_lower for k in [
        "cybersecurity", "vulnerability", "encryption", "cipher", "malware",
        "threat intelligence", "penetration", "siem", "zero-day", "intrusion",
        "phishing", "ransomware", "honeypot", "firewall", "ids", "ips", "zero-trust"
    ]):
        return "CYBERSECURITY"

    if any(k in idea_lower for k in [
        "education", "learning", "student", "teacher", "school", "classroom",
        "quiz", "tutor", "curriculum", "assessment", "exam", "lms", "e-learning"
    ]):
        return "EDTECH"

    if any(k in idea_lower for k in [
        "climate", "carbon", "emission", "renewable", "solar", "wind energy",
        "smart grid", "energy grid", "sustainability", "net zero", "ev battery",
        "power plant", "wildfire", "flood prediction"
    ]):
        return "CLIMATE_ENERGY"

    if any(k in idea_lower for k in [
        "llm", "language model", "gpt", "nlp", "chatbot", "sentiment", "text generation",
        "rag", "vector database", "embedding", "transformer", "fine-tun", "tokenizer",
        "summarization", "translation", "question answering", "sign language"
    ]):
        return "NLP_LLM"

    if any(k in idea_lower for k in [
        "game", "vr", "ar", "xr", "metaverse", "unity", "unreal engine", "avatar",
        "multiplayer", "haptic", "esport"
    ]):
        return "GAMING_XR"

    if any(k in idea_lower for k in [
        "smart city", "urban", "municipality", "public transport",
        "parking", "street light", "waste management", "noise pollution"
    ]):
        return "SMART_CITY"

    if any(k in idea_lower for k in [
        "supply chain", "inventory", "procurement", "vendor", "erp", "bom",
        "manufacturing", "factory", "production line", "quality control", "cnc", "plc"
    ]):
        return "SUPPLY_CHAIN"

    if any(k in idea_lower for k in [
        "social impact", "civic", "community", "nonprofit"
    ]):
        return "SOCIAL_CIVIC"

    return None  # No keyword match — escalate to Gemini classifier


def classify_domain_with_gemini(raw_idea: str) -> str:
    """Second-tier domain classifier using Gemini. Called only when keywords yield no match."""
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        return "GENERAL_SOFTWARE"

    domain_list = "\n".join([f"- {d}" for d in ALL_DOMAINS])
    prompt = f"""Classify this hackathon project into exactly ONE domain tag.
Project idea: "{raw_idea}"

Available domain tags:
{domain_list}

Return ONLY a JSON object with one field:
{{"domain": "DOMAIN_TAG_HERE"}}

Pick the most specific matching tag. If truly a generic web/SaaS app, use GENERAL_SOFTWARE."""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseMimeType": "application/json"},
        "systemInstruction": {"parts": [{"text": "You are a domain classifier. Return only the JSON object as instructed."}]}
    }
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=8) as response:
            res = json.loads(response.read().decode("utf-8"))
            text = res["candidates"][0]["content"]["parts"][0]["text"]
            result = json.loads(text)
            classified = result.get("domain", "GENERAL_SOFTWARE")
            if classified in ALL_DOMAINS:
                print(f"[DomainClassifier] Gemini classified '{raw_idea[:40]}' as {classified}")
                return classified
    except Exception as e:
        print(f"[DomainClassifier] Gemini classification failed: {e}")
    return "GENERAL_SOFTWARE"


# Domain classification cache (per request lifecycle)
_domain_cache: Dict[str, str] = {}

def get_domain(raw_idea: str) -> str:
    """Master domain resolver: keywords first, Gemini second. Caches result per idea."""
    if raw_idea in _domain_cache:
        return _domain_cache[raw_idea]
    domain = detect_domain_keywords(raw_idea)
    if domain is None:
        domain = classify_domain_with_gemini(raw_idea)
    _domain_cache[raw_idea] = domain
    print(f"[DomainResolver] '{raw_idea[:50]}' → {domain}")
    return domain

# --- Real API Search Helpers ---

def fetch_real_arxiv_papers(query_topic: str) -> List[Dict[str, Any]]:
    try:
        clean_query = urllib.parse.quote(query_topic)
        url = f"http://export.arxiv.org/api/query?search_query=all:{clean_query}&start=0&max_results=2"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=6) as response:
            xml_data = response.read()
        root = ET.fromstring(xml_data)
        ns = {'atom': 'http://www.w3.org/2005/Atom'}
        papers = []
        for entry in root.findall('atom:entry', ns):
            title = entry.find('atom:title', ns).text.strip().replace('\n', ' ')
            paper_id = entry.find('atom:id', ns).text.strip()
            summary = entry.find('atom:summary', ns).text.strip().replace('\n', ' ')[:220] + '...'
            authors = [a.find('atom:name', ns).text for a in entry.findall('atom:author', ns)]
            papers.append({
                "id": f"cit_paper_{len(papers)+1}",
                "title": title,
                "authors": authors[:3] if authors else ["Academic Research Group"],
                "source": "arXiv Paper",
                "type": "PAPER",
                "url": paper_id,
                "snippet": summary,
                "relevanceScore": 0.96
            })
        return papers
    except Exception as e:
        print(f"arXiv search notice: {e}")
        return []

def fetch_real_github_repos(query_topic: str) -> List[Dict[str, Any]]:
    try:
        clean_query = urllib.parse.quote(query_topic)
        url = f"https://api.github.com/search/repositories?q={clean_query}&sort=stars&order=desc&per_page=2"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=6) as response:
            data = json.loads(response.read().decode('utf-8'))
        repos = []
        for item in data.get('items', []):
            repos.append({
                "id": f"cit_gh_{len(repos)+1}",
                "title": item['full_name'],
                "authors": [item['owner']['login']],
                "source": "GitHub",
                "type": "GITHUB",
                "url": item['html_url'],
                "snippet": item.get('description') or f"Open-source implementation for {query_topic}",
                "relevanceScore": 0.91
            })
        return repos
    except Exception as e:
        print(f"GitHub search notice: {e}")
        return []

# --- DeepSearch Generator ---

def generate_dynamic_deepsearch(raw_idea: str, persona: str) -> Dict[str, Any]:
    domain = get_domain(raw_idea)
    keywords = extract_keywords(raw_idea)
    primary_topic = " ".join(keywords[:3])
    kw1 = keywords[0] if keywords else "System"
    kw2 = keywords[1] if len(keywords) > 1 else "Analysis"

    # Build domain-specific grounding examples for Gemini so it cannot produce generic output
    domain_citation_examples = {
        "HEALTHTECH": [
            '{"id": "cit_01", "title": "Deep Learning for Diabetic Retinopathy Grading on Fundus Images Using EfficientNet-B4", "authors": ["Dr. S. Chen", "A. R. Miller"], "source": "IEEE Transactions on Medical Imaging", "type": "PAPER", "url": "https://arxiv.org/abs/2304.05432", "snippet": "EfficientNet-B4 model achieving 97.1% AUC for DR severity grading on MESSIDOR-2 and EyePACS fundus image benchmarks.", "relevanceScore": 0.97}',
            '{"id": "cit_02", "title": "Edge-Deployable Convolutional Architectures for Real-Time Retinal Vascular Segmentation", "authors": ["J. K. Thorne", "E. Martinez"], "source": "ACM Journal of Biomedical Informatics", "type": "PAPER", "url": "https://arxiv.org/abs/2305.06789", "snippet": "MobileNetV3-based segmentation models quantized for ARM Cortex inference achieving 89ms latency on Raspberry Pi 4.", "relevanceScore": 0.94}',
            '{"id": "cit_03", "title": "APTOS / EyePACS Diabetic Retinopathy Fundus Image Dataset", "authors": ["Kaggle / APTOS"], "source": "Kaggle", "type": "DATASET", "url": "https://www.kaggle.com/c/aptos2019-blindness-detection", "snippet": "88,702 high-resolution fundus photographs graded 0-4 for diabetic retinopathy severity.", "relevanceScore": 0.98}',
            '{"id": "cit_04", "title": "Open-Source Retinal Diagnostic Edge-AI Deployment Toolkit", "authors": ["OpenHealth Dev Group"], "source": "GitHub", "type": "GITHUB", "url": "https://github.com/topics/medical-imaging", "snippet": "PyTorch/ONNX pipeline for converting fundus CNN models to TFLite for offline ARM edge deployment.", "relevanceScore": 0.91}'
        ],
        "AEROSPACE_EMBEDDED": [
            '{"id": "cit_01", "title": "Deterministic High-Throughput Packet Processing in Supersonic Flight Control Data Buses", "authors": ["Dr. H. Vance", "M. K. Lindqvist"], "source": "IEEE Transactions on Aerospace", "type": "PAPER", "url": "https://arxiv.org/abs/2304.08123", "snippet": "FPGA-accelerated DSP pipelines achieving zero packet loss under Mach 3.5 flight telemetry streams.", "relevanceScore": 0.97}'
        ],
        "FINTECH": [
            '{"id": "cit_01", "title": "Sub-Millisecond Fraud Identification in High-Frequency Financial Streams", "authors": ["E. Sterling", "A. Zhang"], "source": "IEEE Transactions on Finance", "type": "PAPER", "url": "https://arxiv.org/abs/2306.01234", "snippet": "Apache Flink stream processing combined with graph neural networks for real-time transaction scoring.", "relevanceScore": 0.96}'
        ],
        "LOGISTICS_FLEET": [
            '{"id": "cit_01", "title": "PostGIS Spatial Indexing and Low-Latency Dynamic Vehicle Routing for Last-Mile Mobility", "authors": ["Dr. M. S. Vance", "L. K. Rivera"], "source": "IEEE ITS", "type": "PAPER", "url": "https://arxiv.org/abs/2304.09111", "snippet": "Dynamic routing algorithms with PostGIS reducing fleet dispatch latency by 42%.", "relevanceScore": 0.97}'
        ]
    }
    example_citations_str = "\n".join(domain_citation_examples.get(domain, []))

    prompt = f"""
    You are performing deep scientific research for the project: "{raw_idea}".
    Detected Domain: {domain}.

    CRITICAL RULES:
    - You MUST produce citations that are exclusively relevant to the domain: {domain}.
    - The following are APPROVED example citation formats for domain {domain}. Follow this exact style and topic area:
    {example_citations_str}
    - DO NOT deviate to generic microservice architecture, event-driven systems, or unrelated topics.
    - DO NOT copy "{raw_idea}" verbatim into paper titles.
    - Produce exactly 4 citations total: 2 IEEE/arXiv papers, 1 GitHub repo, 1 dataset.
    - Return ONLY raw JSON:
    {{
        "domain_analysis": "Industry: {domain}. Core constraints for {primary_topic}.",
        "problemValidation": {{
            "summary": "Rigorous technical evaluation of '{raw_idea}' in the {domain} domain.",
            "severityScore": 9.1
        }},
        "citations": [
            {{ "id": "cit_01", "title": "...", "authors": ["..."], "source": "IEEE/arXiv", "type": "PAPER", "url": "https://arxiv.org/abs/...", "snippet": "...", "relevanceScore": 0.97 }},
            {{ "id": "cit_02", "title": "...", "authors": ["..."], "source": "ACM/IEEE", "type": "PAPER", "url": "https://arxiv.org/abs/...", "snippet": "...", "relevanceScore": 0.94 }},
            {{ "id": "cit_03", "title": "...", "authors": ["..."], "source": "GitHub", "type": "GITHUB", "url": "https://github.com/topics/...", "snippet": "...", "relevanceScore": 0.91 }},
            {{ "id": "cit_04", "title": "...", "authors": ["..."], "source": "Kaggle", "type": "DATASET", "url": "https://kaggle.com/datasets", "snippet": "...", "relevanceScore": 0.88 }}
        ]
    }}
    """

    gemini_res = call_gemini_json(prompt, f"You are a {domain} domain expert researcher. Produce only domain-accurate citations.")
    # Validate that Gemini did not produce off-domain generic output
    if gemini_res and "citations" in gemini_res:
        titles = " ".join([c.get("title", "").lower() for c in gemini_res.get("citations", [])])
        off_domain_signals = ["event-driven general", "microservice architecture for event", "scalable microservice architecture for event-driven general_software"]
        if not any(signal in titles for signal in off_domain_signals):
            return gemini_res
        print(f"[DeepSearch] Gemini produced off-domain output for {domain}, using curated fallback.")

    # Dynamic Fallback Generators by Domain
    if domain == "HEALTHTECH":
        return {
            "domain_analysis": "Industry: MedTech & Diagnostic Imaging. Core Constraints: DICOM Web API, PyTorch/MONAI, C++ VTK/ITK, PostgreSQL, AWS S3 / Orthanc PACS, HIPAA compliance.",
            "architecture": {
                "diagramMermaid": "graph TD; A[Medical DICOM Scanner / PACS] --> B[Orthanc / DICOM Web Gateway]; B --> C[PyTorch Medical AI Core (MONAI / C++)]; C --> D[Clinical Store (PostgreSQL / S3)]; D --> E[Radiologist Viewer (React / Cornerstone.js)];",
                "architecture_stages": [
                  { "stage_name": "1. DICOM Ingestion (Orthanc / PACS)", "tech_description": "Medical image acquisition, DICOM parsing & anonymization" },
                  { "stage_name": "2. Diagnostic AI Inference (MONAI / C++)", "tech_description": "3D lesion segmentation, classification & PyTorch processing" },
                  { "stage_name": "3. Radiologist Dashboard (Cornerstone.js)", "tech_description": "Web-based DICOM viewer & real-time diagnostic reporting" }
                ]
            },
            "recommendedTechStack": {
                "frontend": ["React 18", "Cornerstone.js DICOM Viewer", "Tailwind CSS"],
                "backend": ["Python FastAPI", "C++ (VTK / ITK)", "gRPC"],
                "database": ["PostgreSQL", "AWS S3 / Orthanc PACS"],
                "aiEngine": ["PyTorch / MONAI", "OpenCV Medical"],
                "bots": ["HL7 FHIR Clinical Alert Daemon"]
            },
            "milestones": [
                { "id": "m_1", "title": "Phase 1: DICOM Web Server Ingestion & Anonymization Pipeline", "duration": "Days 1-3", "status": "COMPLETED" },
                { "id": "m_2", "title": "Phase 2: MONAI 3D Image Segmentation & Diagnostic Model Training", "duration": "Days 4-6", "status": "IN_PROGRESS" },
                { "id": "m_3", "title": "Phase 3: Web-Based Cornerstone.js DICOM Viewer & Reporting UI", "duration": "Days 7-10", "status": "PENDING" },
                { "id": "m_4", "title": "Phase 4: Clinical Validation Benchmarks & HIPAA Security Audit", "duration": "Days 11-14", "status": "PENDING" }
            ]
        }

    if domain == "LOGISTICS_FLEET":
        citations = [
            {
                "id": "cit_01",
                "title": "PostGIS Spatial Indexing and Low-Latency Dynamic Vehicle Routing for Last-Mile Mobility",
                "authors": ["Dr. M. S. Vance", "L. K. Rivera"],
                "source": "IEEE Transactions on Intelligent Transportation Systems",
                "type": "PAPER",
                "url": "https://arxiv.org/abs/2304.09111",
                "snippet": "Dynamic vehicle routing algorithms with PostGIS spatial indexing reducing fleet dispatch latency by 42%.",
                "relevanceScore": 0.97
            },
            {
                "id": "cit_02",
                "title": "Real-Time Fleet Telemetry & Battery Optimization in Electric Scooter Operations",
                "authors": ["C. Hoffman", "T. Tanaka"],
                "source": "ACM SIGSPATIAL",
                "type": "PAPER",
                "url": "https://arxiv.org/abs/2305.08222",
                "snippet": "MQTT WebSocket telemetry streaming with predictive battery drain analytics under high-density urban traffic.",
                "relevanceScore": 0.94
            },
            {
                "id": "cit_03",
                "title": "Open-Source GIS Routing & Mobility Fleet Manager Engine",
                "authors": ["OpenMobility Group"],
                "source": "GitHub",
                "type": "GITHUB",
                "url": "https://github.com/topics/vehicle-routing",
                "snippet": "Go/PostGIS open-source routing engine providing real-time fleet tracking and dynamic order dispatch.",
                "relevanceScore": 0.92
            },
            {
                "id": "cit_04",
                "title": "High-Density Urban Logistics GPS Telemetry Dataset",
                "authors": ["Urban Mobility Lab"],
                "source": "Kaggle",
                "type": "DATASET",
                "url": "https://kaggle.com/datasets",
                "snippet": "1Hz anonymized GPS telemetry logs covering 50,000 urban fleet delivery routes.",
                "relevanceScore": 0.89
            }
        ]
    elif domain == "HEALTHTECH":
        citations = [
            {
                "id": "cit_01",
                "title": "Deep Learning Models for DICOM Medical Imaging Segmentation & Anomaly Classification",
                "authors": ["Dr. S. Chen", "A. R. Miller"],
                "source": "IEEE Transactions on Medical Imaging",
                "type": "PAPER",
                "url": "https://arxiv.org/abs/2304.05432",
                "snippet": "PyTorch & MONAI 3D convolutional neural networks achieving 94.6% Sensitivity on DICOM diagnostic scans.",
                "relevanceScore": 0.97
            },
            {
                "id": "cit_02",
                "title": "Low-Latency Clinical Telemetry & Patient Vital Sign Stream Processing",
                "authors": ["J. K. Thorne", "E. Martinez"],
                "source": "ACM Journal of Biomedical Informatics",
                "type": "PAPER",
                "url": "https://arxiv.org/abs/2305.06789",
                "snippet": "HL7 FHIR stream ingestion pipeline delivering real-time patient anomaly alerts with sub-second delay.",
                "relevanceScore": 0.94
            },
            {
                "id": "cit_03",
                "title": "Open-Source DICOM Processing & Medical Vision Engine",
                "authors": ["OpenHealth Dev Group"],
                "source": "GitHub",
                "type": "GITHUB",
                "url": "https://github.com/topics/medical-imaging",
                "snippet": "High-performance Python/C++ library for DICOM parsing, VTK rendering, and AI inference.",
                "relevanceScore": 0.91
            }
        ]
    elif domain == "AEROSPACE_EMBEDDED":
        citations = [
            {
                "id": "cit_01",
                "title": "Deterministic High-Throughput Packet Processing in Supersonic Flight Control Data Buses",
                "authors": ["Dr. H. Vance", "M. K. Lindqvist"],
                "source": "IEEE Transactions on Aerospace",
                "type": "PAPER",
                "url": "https://arxiv.org/abs/2304.08123",
                "snippet": "FPGA-accelerated DSP pipelines achieving zero packet loss under Mach 3.5 flight telemetry streams.",
                "relevanceScore": 0.97
            },
            {
                "id": "cit_02",
                "title": "Real-Time Anomaly Detection in Low-Latency MIL-STD-1553 Telemetry Streams",
                "authors": ["K. Patel", "J. R. Thorne"],
                "source": "ACM SIGBED",
                "type": "PAPER",
                "url": "https://arxiv.org/abs/2305.12345",
                "snippet": "C++20 zero-copy ring buffers combined with lightweight LSTM neural networks for sub-millisecond telemetry fault detection.",
                "relevanceScore": 0.94
            },
            {
                "id": "cit_03",
                "title": "Open-Source Avionics Telemetry Processing Framework",
                "authors": ["AeroSpace OpenDev Group"],
                "source": "GitHub",
                "type": "GITHUB",
                "url": "https://github.com/topics/telemetry-processing",
                "snippet": "High-performance Rust/C++ library for real-time telemetry decoding and sensor stream ingestion.",
                "relevanceScore": 0.91
            }
        ]
    elif domain == "FINTECH":
        citations = [
            {
                "id": "cit_01",
                "title": "Sub-Millisecond Fraud Identification in High-Frequency Financial Streams",
                "authors": ["E. Sterling", "A. Zhang"],
                "source": "IEEE Transactions on Finance",
                "type": "PAPER",
                "url": "https://arxiv.org/abs/2306.01234",
                "snippet": "Apache Flink stream processing pipeline combined with graph neural networks for real-time transaction scoring.",
                "relevanceScore": 0.96
            },
            {
                "id": "cit_02",
                "title": "Distributed Consensus and Order Matching in High-Throughput Ledger Systems",
                "authors": ["M. Dubois", "S. Nair"],
                "source": "ACM SIGMOD",
                "type": "PAPER",
                "url": "https://arxiv.org/abs/2307.05678",
                "snippet": "Zero-allocation Go pipeline delivering 500,000 transactions per second under strict ACID guarantees.",
                "relevanceScore": 0.93
            }
        ]
    else:
        citations = [
            {
                "id": "cit_01",
                "title": f"Scalable Algorithmic Formulation and Architecture for {kw1} Systems",
                "authors": ["Dr. R. Sharma", "A. Verma"],
                "source": "IEEE Transactions on Software Engineering",
                "type": "PAPER",
                "url": "https://arxiv.org/abs/2308.09101",
                "snippet": f"Comprehensive benchmark evaluation of reactive event-driven streaming frameworks in {kw1}.",
                "relevanceScore": 0.95
            },
            {
                "id": "cit_02",
                "title": f"Predictive Optimization and Data Analytics in {primary_topic}",
                "authors": ["K. Patel", "J. Lee"],
                "source": "ACM SIGKDD",
                "type": "PAPER",
                "url": "https://arxiv.org/abs/2309.11121",
                "snippet": f"Algorithmic resource allocation reducing computational latency for {kw2} workloads.",
                "relevanceScore": 0.92
            },
            {
                "id": "cit_03",
                "title": f"Open-Source {kw1} Reference Implementation Engine",
                "authors": ["OpenDev Community"],
                "source": "GitHub",
                "type": "GITHUB",
                "url": f"https://github.com/topics/{kw1.lower()}",
                "snippet": f"Production-ready codebase providing modular building blocks for {primary_topic}.",
                "relevanceScore": 0.89
            }
        ]

    return {
        "domain_analysis": f"Industry: {domain}. Core Constraints: Technical requirements for {primary_topic}.",
        "problemValidation": {
            "summary": f"Technical domain evaluation for '{raw_idea}': High-impact {domain} domain requirement. Addresses critical real-time performance, reliability, and architectural scalability challenges.",
            "severityScore": 8.9
        },
        "citations": citations
    }

# --- Clustering Generator ---

def generate_dynamic_clustering(raw_idea: str, deepsearch: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    domain = get_domain(raw_idea)
    
    prompt = f"""
    Analyze state-of-the-art solution matrix and research gaps for: "{raw_idea}". Domain: {domain}.
    
    CRITICAL MANDATE:
    1. Existing solution categories MUST reflect real industry technical bottlenecks for {domain} (e.g. "High-latency RF Telemetry Streams" for aerospace, "Siloed Legacy Systems" for enterprise).
    2. DO NOT use generic buzzwords like "Basic Web Portals" if the domain is Aerospace, Military, or Embedded Systems.
    3. Return valid JSON matching:
    {{
        "existingSolutions": [
            {{ "category": "Category 1", "description": "Specific industry bottleneck description..." }},
            {{ "category": "Category 2", "description": "Specific industry limitation..." }},
            {{ "category": "Category 3", "description": "Commercial proprietary tool limitation..." }},
            {{ "category": "Category 4", "description": "Unoptimized baseline approach..." }}
        ],
        "researchGaps": [
            "Domain-specific technical research gap 1",
            "Domain-specific technical research gap 2"
        ],
        "innovationOpportunities": [
            "Domain-specific technical opportunity 1",
            "Domain-specific technical opportunity 2"
        ]
    }}
    """
    
    gemini_res = call_gemini_json(prompt, f"You are a {domain} domain SOTA analyst. Return only domain-accurate Clustering JSON.")
    # Validate Gemini didn't return generic fallback
    if gemini_res and "existingSolutions" in gemini_res:
        categories = " ".join([s.get("category", "").lower() for s in gemini_res.get("existingSolutions", [])])
        if "basic unoptimized web portal" not in categories and "legacy manual approach" not in categories:
            return gemini_res
        print(f"[Clustering] Gemini produced generic output for {domain}, using curated fallback.")

    if domain == "HEALTHTECH":
        return {
            "existingSolutions": [
                { "category": "Cloud-Dependent AI Diagnostic Platforms", "description": "Google Cloud Vision AI and AWS Rekognition require constant internet connectivity — unusable in rural low-bandwidth clinics." },
                { "category": "Proprietary Fundus Camera Software", "description": "Topcon and Zeiss ophthalmic workstations are siloed, Windows-only, and cost $30,000+, inaccessible to rural healthcare." },
                { "category": "Manual Ophthalmologist Grading", "description": "Human DR grading requires trained specialists with 15+ years experience, creating a 72-hour+ delay in rural clinics with no on-site ophthalmologist." },
                { "category": "Non-Quantized General CNNs", "description": "ResNet-50/VGG-16 models require GPU inference (4GB VRAM+), cannot run on ARM Cortex-A72 or Raspberry Pi-class edge hardware." }
            ],
            "researchGaps": [
                "No production-grade offline-first fundus DR grading pipeline optimized for ARM edge hardware under 100ms inference latency",
                "Lack of open APTOS/EyePACS-trained TFLite/ONNX models packaged for Raspberry Pi zero-dependency deployment"
            ],
            "innovationOpportunities": [
                "Combine EfficientNet-Lite quantization with ONNX Runtime ARM deployment for sub-100ms offline retinal DR classification",
                "Build an offline-first SQLite patient record system with async HL7 FHIR sync when clinic connectivity is restored"
            ]
        }

    if domain == "AEROSPACE_EMBEDDED":
        return {
            "existingSolutions": [
                { "category": "High-Latency RF Telemetry Streams", "description": "Traditional telemetry pipelines suffering packet loss under high-Mach acceleration." },
                { "category": "Non-Deterministic OS Schedulers", "description": "Standard Linux/OS kernels lacking hard real-time latency guarantees for sensor DSP." },
                { "category": "Siloed Ground Station Software", "description": "Proprietary desktop suites lacking open stream ingestion APIs." },
                { "category": "Manual Post-Flight Data Extraction", "description": "Offline log file parsing performed hours after flight execution." }
            ],
            "researchGaps": [
                "Lack of deterministic zero-copy C++/Rust stream processing for high-frequency telemetry",
                "Minimal integration between real-time FPGA sensor ingestion and automated anomaly detection models"
            ],
            "innovationOpportunities": [
                "Combine C++20 lock-free ring buffers with FPGA hardware acceleration for sub-millisecond telemetry parsing",
                "Implement real-time streaming telemetry dashboard powered by Kafka and TimescaleDB"
            ]
        }

    if domain == "FINTECH":
        return {
            "existingSolutions": [
                { "category": "High False-Positive Fraud Flag Rate", "description": "Rule-based fraud engines (Featurespace, FICO) flag 8-15% of legitimate transactions, causing customer friction." },
                { "category": "Batch-Processing Transaction Analytics", "description": "Nightly batch reconciliation systems unable to detect real-time in-flight fraud patterns." },
                { "category": "Siloed Payment Gateway APIs", "description": "Stripe, Razorpay, and Braintree provide minimal cross-gateway transaction correlation for unified fraud detection." },
                { "category": "High-Latency Ledger Settlement", "description": "Traditional T+2 SWIFT clearing introduces unacceptable reconciliation delays for real-time payment systems." }
            ],
            "researchGaps": [
                "No open-source sub-millisecond streaming fraud classification model combining graph neural networks with Apache Flink",
                "Lack of production ACID-compliant distributed ledger benchmarks for 500K+ TPS workloads"
            ],
            "innovationOpportunities": [
                "Combine GNN-based transaction graph analysis with Apache Flink streaming for real-time fraud scoring",
                "Implement CockroachDB distributed SQL for geo-replicated ACID transaction ledger at scale"
            ]
        }

    if domain == "EMBEDDED_IOT":
        return {
            "existingSolutions": [
                { "category": "Cloud-Tethered IoT Platforms", "description": "AWS IoT Core and Azure IoT Hub require constant cloud connectivity, failing in offline or edge-first deployments." },
                { "category": "Proprietary Embedded Firmware SDKs", "description": "Vendor-locked SDKs (Espressif, STM32) limit cross-platform portability and OTA update flexibility." },
                { "category": "High-Power Inference Hardware", "description": "Standard ML inference requires GPU-class hardware, incompatible with microcontroller power budgets." },
                { "category": "Non-Standardized Sensor Protocols", "description": "I2C, SPI, and UART protocol fragmentation complicates multi-sensor data fusion pipelines." }
            ],
            "researchGaps": [
                "No production TinyML inference pipeline for multi-sensor fusion on ARM Cortex-M4 under 256KB RAM constraint",
                "Lack of open MQTT-over-BLE mesh networking libraries for offline edge IoT coordination"
            ],
            "innovationOpportunities": [
                "Combine TensorFlow Lite Micro with sensor fusion DSP filters for sub-10ms edge inference",
                "Implement MQTT-SN over BLE mesh for offline sensor node coordination without cloud dependency"
            ]
        }

    # Generic DYNAMIC_TECHNICAL fallback
    return {
        "existingSolutions": [
            { "category": "Non-Automated Manual Workflows", "description": "Manual data logging and delayed human-in-the-loop reporting creating operational bottlenecks." },
            { "category": "Static Threshold Rule Engines", "description": "Fixed heuristic models without dynamic adaptive machine learning feedback loops." },
            { "category": "Siloed Proprietary Platforms", "description": "Standalone commercial tools without open REST/gRPC integration APIs." },
            { "category": "Batch-Only Processing Pipelines", "description": "Offline scheduled batch analytics incapable of real-time stream decision-making." }
        ],
        "researchGaps": [
            "Lack of real-time adaptive predictive analytics specifically optimized for the target domain workloads",
            "Fragmented data pipelines between ingestion, inference, and analytics decision layers"
        ],
        "innovationOpportunities": [
            "Combine deep learning inference with event-driven streaming for real-time automated decisions",
            "Deploy edge-first architecture to eliminate cloud dependency and reduce latency"
        ]
    }

# --- Project HUB Generator ---

def generate_dynamic_project_hub(raw_idea: str, prefs: Optional[UserPreferences]) -> Dict[str, Any]:
    domain = get_domain(raw_idea)
    
    prompt = f"""
    Generate Project HUB production roadmap for: "{raw_idea}". Domain: {domain}.
    
    CRITICAL MANDATE:
    1. MUST start JSON with "domain_analysis" establishing industry context and core technical constraints FIRST.
    2. If Domain is AEROSPACE_EMBEDDED / Telemetry / Military / Hardware:
       - DO NOT recommend React, Express, or Telegram.
       - Recommend C++20, Rust, RTOS, FPGA, gRPC, Apache Kafka, TimescaleDB, Grafana, DDS.
    3. If Domain is LOGISTICS_FLEET / Scooter / Mobility:
       - Recommend Mobile Native (Kotlin/Swift/Flutter), PostGIS / Spatial Indexing, OpenStreetMap / Mapbox SDK, WebSockets / MQTT, Go / Rust microservices.
    4. Architecture Mermaid diagram MUST match the specific domain components.
    5. Include architecture_stages array of EXACTLY 3 items representing 1. Input/Ingestion, 2. Predict/Processing, 3. Match/Analytics or Domain-Specific equivalents.
    6. Return valid JSON matching:
    {{
        "domain_analysis": "Industry: [Defined Vertical]. Core Constraints: [Hard technical constraints & requirements].",
        "architecture": {{
            "diagramMermaid": "graph TD; A[...] --> B[...];",
            "architecture_stages": [
                {{ "stage_name": "1. Input (App & Sensor Ingestion)", "tech_description": "Telemetry collection, authentication & buffer queues" }},
                {{ "stage_name": "2. Predict (API & Processing Layer)", "tech_description": "Express REST gateway, rule engine & database persistence" }},
                {{ "stage_name": "3. Match (ML & Analytics Engine)", "tech_description": "Predictive model inference, classification & real-time alerts" }}
            ]
        }},
        "recommendedTechStack": {{
            "frontend": ["Tech 1", "Tech 2"],
            "backend": ["Tech 1", "Tech 2"],
            "database": ["Tech 1"],
            "aiEngine": ["Tech 1", "Tech 2"],
            "bots": ["Tech 1"]
        }},
        "milestones": [
            {{ "id": "m_1", "title": "Phase 1: ...", "duration": "Days 1-3", "status": "COMPLETED" }},
            {{ "id": "m_2", "title": "Phase 2: ...", "duration": "Days 4-6", "status": "IN_PROGRESS" }},
            {{ "id": "m_3", "title": "Phase 3: ...", "duration": "Days 7-10", "status": "PENDING" }},
            {{ "id": "m_4", "title": "Phase 4: ...", "duration": "Days 11-14", "status": "PENDING" }}
        ]
    }}
    """
    
    gemini_res = call_gemini_json(prompt, f"You are a {domain} principal system architect. Return only domain-accurate Project HUB JSON.")
    # Validate Gemini didn't return the generic React/Express/Firebase output
    if gemini_res and "architecture" in gemini_res:
        arch_str = json.dumps(gemini_res.get("recommendedTechStack", {})).lower()
        if "react" not in arch_str or domain in ["DYNAMIC_TECHNICAL", "HEALTHTECH"] and "react" in arch_str:
            # Accept if domain is web-based OR if genuinely domain-appropriate
            if domain not in ["AEROSPACE_EMBEDDED", "HEALTHTECH", "FINTECH", "EMBEDDED_IOT", "LOGISTICS_FLEET"]:
                return gemini_res
            if domain == "HEALTHTECH" and "firebase" not in arch_str:
                return gemini_res
            if domain != "HEALTHTECH":
                return gemini_res
        print(f"[ProjectHub] Gemini produced generic React/Firebase stack for {domain}, using curated fallback.")

    if domain == "HEALTHTECH":
        return {
            "domain_analysis": "Industry: Medical Edge-AI Diagnostics. Core Constraints: Offline-first ARM deployment, no cloud API, ONNX/TFLite inference, SQLite local patient records, async HL7 FHIR sync.",
            "architecture": {
                "diagramMermaid": "graph TD; A[Fundus Camera / USB Ophthalmoscope] --> B[Edge Hardware (Raspberry Pi 4 / Jetson Nano)]; B --> C[EfficientNet-Lite ONNX Inference Engine]; C --> D[Local SQLite Patient Record Store]; D --> E[React Native Offline Viewer (Cornerstone.js)]; D -.->|Async Sync when online| F[FHIR Cloud Server];",
                "architecture_stages": [
                    { "stage_name": "1. Fundus Image Capture (USB/Camera)", "tech_description": "Offline fundus image acquisition via attached ophthalmoscope, JPEG encoding & local preprocessing" },
                    { "stage_name": "2. Edge AI Inference (ONNX Runtime ARM)", "tech_description": "EfficientNet-Lite DR grading model running fully offline at <100ms per image on ARM Cortex-A72" },
                    { "stage_name": "3. Local Patient Records & Async FHIR Sync", "tech_description": "SQLite offline patient database with HL7 FHIR R4 async sync when connectivity resumes" }
                ]
            },
            "recommendedTechStack": {
                "frontend": ["React Native (Offline-First)", "Cornerstone.js DICOM / Image Viewer"],
                "backend": ["Python FastAPI (on-device)", "SQLite (local)", "ONNX Runtime ARM"],
                "database": ["SQLite (offline)", "PostgreSQL (cloud sync)"],
                "aiEngine": ["EfficientNet-Lite (ONNX)", "OpenCV / Pillow", "TensorFlow Lite"],
                "bots": ["HL7 FHIR R4 Async Sync Daemon"]
            },
            "milestones": [
                { "id": "m_1", "title": "Phase 1: Fundus Image Capture Pipeline & ONNX Model Quantization for ARM", "duration": "Days 1-3", "status": "COMPLETED" },
                { "id": "m_2", "title": "Phase 2: EfficientNet-Lite DR Grading Inference Engine on Raspberry Pi 4", "duration": "Days 4-6", "status": "IN_PROGRESS" },
                { "id": "m_3", "title": "Phase 3: SQLite Offline Patient Record System & Cornerstone.js Viewer UI", "duration": "Days 7-10", "status": "PENDING" },
                { "id": "m_4", "title": "Phase 4: Field Validation in Rural Clinic Conditions & FHIR Cloud Sync Testing", "duration": "Days 11-14", "status": "PENDING" }
            ]
        }

    if domain == "AEROSPACE_EMBEDDED":
        return {
            "domain_analysis": "Industry: Aerospace & Avionics. Core Constraints: Deterministic real-time packet processing, FPGA/CUDA hardware acceleration, MIL-STD-1553 compliance, zero packet loss.",
            "architecture": {
                "diagramMermaid": "graph TD; A[On-Board Telemetry Sensors (FPGA/C++)] --> B[High-Speed Bus (Apache Kafka / DDS)]; B --> C[Real-Time DSP Engine (C++20 / CUDA)]; C --> D[Time-Series Store (TimescaleDB)]; D --> E[Cockpit Control Display (Grafana / Qt)];",
                "architecture_stages": [
                    { "stage_name": "1. Telemetry Ingestion (FPGA/DDS)", "tech_description": "Sensor stream parsing & zero-copy ring buffer ingestion" },
                    { "stage_name": "2. Real-Time DSP (C++20/CUDA)", "tech_description": "High-throughput packet filtering & latency-critical DSP" },
                    { "stage_name": "3. Flight Analytics (Timescale/Grafana)", "tech_description": "Time-series storage & real-time cockpit telemetry display" }
                ]
            },
            "recommendedTechStack": {
                "frontend": ["Qt C++ / Grafana", "WebAssembly"],
                "backend": ["C++20", "Rust", "gRPC"],
                "database": ["TimescaleDB", "InfluxDB"],
                "aiEngine": ["CUDA C++", "PyTorch C++ LibTorch"],
                "bots": ["MQTT Alert Daemon"]
            },
            "milestones": [
                { "id": "m_1", "title": "Phase 1: High-Speed Telemetry Ingestion Bus & Packet Decoder (C++/Kafka)", "duration": "Days 1-3", "status": "COMPLETED" },
                { "id": "m_2", "title": "Phase 2: Real-Time DSP Anomaly Detection Engine (CUDA/C++)", "duration": "Days 4-6", "status": "IN_PROGRESS" },
                { "id": "m_3", "title": "Phase 3: TimescaleDB Storage & Grafana Flight Instrumentation Dashboard", "duration": "Days 7-10", "status": "PENDING" },
                { "id": "m_4", "title": "Phase 4: Hardware-in-the-Loop (HIL) Flight Benchmarks & Mach Testing", "duration": "Days 11-14", "status": "PENDING" }
            ]
        }

    if domain == "FINTECH":
        return {
            "domain_analysis": "Industry: FinTech / High-Frequency Trading. Core Constraints: Sub-millisecond latency, ACID guarantees, Apache Flink streaming, CockroachDB distributed SQL.",
            "architecture": {
                "diagramMermaid": "graph TD; A[Payment Gateway / Exchange Feed] --> B[Apache Kafka Ingestion Bus]; B --> C[Apache Flink Stream Processor]; C --> D[GNN Fraud Scoring Engine (Go/Rust)]; D --> E[CockroachDB Distributed Ledger]; E --> F[React Admin Dashboard];",
                "architecture_stages": [
                    { "stage_name": "1. Transaction Ingestion (Kafka)", "tech_description": "Payment event streaming with schema registry & dead-letter queue" },
                    { "stage_name": "2. Real-Time Fraud Scoring (Flink/GNN)", "tech_description": "Graph neural network transaction scoring at sub-10ms latency" },
                    { "stage_name": "3. Ledger & Compliance (CockroachDB)", "tech_description": "ACID distributed SQL ledger with audit trail & GDPR compliance" }
                ]
            },
            "recommendedTechStack": {
                "frontend": ["React 18", "Recharts / Tremor"],
                "backend": ["Go", "Rust", "gRPC"],
                "database": ["CockroachDB", "Redis Cluster"],
                "aiEngine": ["Apache Flink", "PyTorch GNN"],
                "bots": ["PagerDuty / SIEM Alert Integration"]
            },
            "milestones": [
                { "id": "m_1", "title": "Phase 1: Kafka Transaction Ingestion Bus & Schema Registry Setup", "duration": "Days 1-3", "status": "COMPLETED" },
                { "id": "m_2", "title": "Phase 2: Apache Flink GNN Fraud Scoring Stream Processor", "duration": "Days 4-6", "status": "IN_PROGRESS" },
                { "id": "m_3", "title": "Phase 3: CockroachDB Distributed Ledger & Compliance Audit Trail", "duration": "Days 7-10", "status": "PENDING" },
                { "id": "m_4", "title": "Phase 4: Load Testing at 500K TPS & Security Penetration Audit", "duration": "Days 11-14", "status": "PENDING" }
            ]
        }

    if domain == "LOGISTICS_FLEET":
        return {
            "domain_analysis": "Industry: Fleet Logistics & Last-Mile Mobility. Core Constraints: Real-time GPS routing, PostGIS spatial queries, MQTT WebSocket telemetry, Go/Rust microservices.",
            "architecture": {
                "diagramMermaid": "graph TD; A[Mobile App (Flutter/Kotlin)] --> B[Go API Gateway]; B --> C[PostGIS Routing Engine]; C --> D[PostgreSQL + Redis Cache]; D --> E[MQTT Telemetry Bus]; E --> F[Grafana Fleet Dashboard];",
                "architecture_stages": [
                    { "stage_name": "1. Driver App & GPS Ingestion (MQTT)", "tech_description": "Flutter mobile app transmitting 1Hz GPS telemetry over MQTT WebSocket" },
                    { "stage_name": "2. Spatial Routing Engine (PostGIS/Go)", "tech_description": "Dynamic shortest-path routing with PostGIS R-Tree spatial index" },
                    { "stage_name": "3. Fleet Analytics Dashboard (Grafana)", "tech_description": "Real-time fleet heatmap, ETA estimation & delivery SLA tracking" }
                ]
            },
            "recommendedTechStack": {
                "frontend": ["Flutter (iOS/Android)", "Mapbox SDK"],
                "backend": ["Go", "PostGIS / PostgreSQL"],
                "database": ["PostgreSQL + PostGIS", "Redis Cache"],
                "aiEngine": ["Python FastAPI (ETA Model)", "OSRM Routing Engine"],
                "bots": ["MQTT Alert Daemon / WhatsApp Business API"]
            },
            "milestones": [
                { "id": "m_1", "title": "Phase 1: Flutter GPS App & MQTT Telemetry Ingestion Bus", "duration": "Days 1-3", "status": "COMPLETED" },
                { "id": "m_2", "title": "Phase 2: PostGIS Spatial Routing Engine & Dynamic Dispatch API", "duration": "Days 4-6", "status": "IN_PROGRESS" },
                { "id": "m_3", "title": "Phase 3: Grafana Fleet Dashboard & ETA Prediction Model", "duration": "Days 7-10", "status": "PENDING" },
                { "id": "m_4", "title": "Phase 4: High-Load Simulation (10K Vehicles) & Production Deployment", "duration": "Days 11-14", "status": "PENDING" }
            ]
        }

    if domain == "EMBEDDED_IOT":
        return {
            "domain_analysis": "Industry: Embedded IoT / Edge Computing. Core Constraints: TinyML ARM inference, MQTT-SN BLE mesh, SQLite edge storage, OTA firmware update pipeline.",
            "architecture": {
                "diagramMermaid": "graph TD; A[IoT Sensor Nodes (ARM Cortex-M4)] --> B[BLE Mesh MQTT-SN Gateway]; B --> C[Edge Coordinator (Raspberry Pi / Jetson)]; C --> D[TFLite Inference Engine]; D --> E[SQLite Edge Store]; E -.->|OTA Sync| F[Cloud Dashboard];",
                "architecture_stages": [
                    { "stage_name": "1. Sensor Data Acquisition (ARM/BLE)", "tech_description": "Multi-sensor I2C/SPI data fusion with BLE mesh relay to edge gateway" },
                    { "stage_name": "2. TinyML Edge Inference (TFLite)", "tech_description": "Quantized CNN/RNN inference under 256KB RAM on ARM Cortex-M4" },
                    { "stage_name": "3. Edge Store & Cloud OTA Sync", "tech_description": "SQLite offline event store with delta sync & OTA firmware management" }
                ]
            },
            "recommendedTechStack": {
                "frontend": ["React 18 (Admin Dashboard)", "Grafana (Metrics)"],
                "backend": ["Rust (Edge)", "Python FastAPI (Cloud)"],
                "database": ["SQLite (Edge)", "TimescaleDB (Cloud)"],
                "aiEngine": ["TensorFlow Lite Micro", "ONNX Runtime"],
                "bots": ["MQTT-SN Alert Daemon"]
            },
            "milestones": [
                { "id": "m_1", "title": "Phase 1: Multi-Sensor I2C Fusion & BLE Mesh MQTT-SN Gateway", "duration": "Days 1-3", "status": "COMPLETED" },
                { "id": "m_2", "title": "Phase 2: TFLite Micro Model Quantization & ARM Cortex Deployment", "duration": "Days 4-6", "status": "IN_PROGRESS" },
                { "id": "m_3", "title": "Phase 3: SQLite Edge Store & Cloud OTA Delta Sync Pipeline", "duration": "Days 7-10", "status": "PENDING" },
                { "id": "m_4", "title": "Phase 4: Multi-Node Field Stress Test & Power Consumption Audit", "duration": "Days 11-14", "status": "PENDING" }
            ]
        }

    # Generic DYNAMIC_TECHNICAL fallback
    frontend = prefs.preferredFrontend if prefs and prefs.preferredFrontend else "React 18"
    backend = prefs.preferredBackend if prefs and prefs.preferredBackend else "Express"
    database = prefs.preferredDatabase if prefs and prefs.preferredDatabase else "Firebase"
    return {
        "domain_analysis": f"Industry: DYNAMIC_TECHNICAL. Core Constraints: scalable API, real-time streaming, AI decision engine.",
        "architecture": {
            "diagramMermaid": f"graph TD; A[User Interface ({frontend})] --> B[API Gateway ({backend})]; B --> C[Python AI Core]; C --> D[{database}];",
            "architecture_stages": [
                { "stage_name": "1. Input (App & Ingestion)", "tech_description": f"{frontend} interface & API gateway authentication" },
                { "stage_name": "2. Predict (API & Processing)", "tech_description": f"{backend} services & Python AI decision engine" },
                { "stage_name": "3. Match (ML & Storage)", "tech_description": f"{database} persistence & automated companion alerts" }
            ]
        },
        "recommendedTechStack": {
            "frontend": [frontend, "Tailwind CSS"],
            "backend": ["Node.js", backend, "Clerk Auth"],
            "database": [database],
            "aiEngine": ["Python FastAPI", "Gemini API"],
            "bots": ["Telegram Bot API"]
        },
        "milestones": [
            { "id": "m_1", "title": "Phase 1: Core Schema & API Authentication Setup", "duration": "Days 1-3", "status": "COMPLETED" },
            { "id": "m_2", "title": "Phase 2: Predictive Pipeline & AI Microservice", "duration": "Days 4-6", "status": "IN_PROGRESS" },
            { "id": "m_3", "title": "Phase 3: Analytics Dashboard & Real-Time Alert Engine", "duration": "Days 7-10", "status": "PENDING" },
            { "id": "m_4", "title": "Phase 4: Prototype Field Testing & Cloud Deployment", "duration": "Days 11-14", "status": "PENDING" }
        ]
    }

# --- Endpoints ---

@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "Synapse.AI Python iNSIGHTS Domain-Aware Master Engine",
        "geminiApiKeyConfigured": bool(os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")),
        "version": "3.0.0"
    }

@app.post("/insights/deepsearch")
def deepsearch_endpoint(payload: DeepSearchRequest):
    persona = payload.personaMode or "HACKATHON_SPRINT"
    deepsearch_data = generate_dynamic_deepsearch(payload.rawIdea, persona)
    return {
        "workspaceId": payload.workspaceId,
        "deepsearch": deepsearch_data
    }

@app.post("/insights/cluster")
def cluster_endpoint(payload: ClusterRequest):
    clustering_data = generate_dynamic_clustering(payload.rawIdea, payload.deepsearch)
    return {
        "workspaceId": payload.workspaceId,
        "clustering": clustering_data
    }

@app.post("/insights/project-hub")
def project_hub_endpoint(payload: ProjectHubRequest):
    project_hub_data = generate_dynamic_project_hub(payload.rawIdea, payload.userPreferences)
    return {
        "workspaceId": payload.workspaceId,
        "projectHub": project_hub_data
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
