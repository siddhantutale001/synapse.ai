import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Github, Mail, User, GraduationCap, Code } from 'lucide-react';
import api from '../../services/api.js';
import { useWorkspace } from '../../context/WorkspaceContext.jsx';
import { verifyGithubProfile, validateEmail } from '../../utils/validation.js';

export default function OnboardingModal() {
  const { onboardingModalOpen, setOnboardingModalOpen, profile, setProfile } = useWorkspace();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    college: '',
    major: '',
    yearOfStudy: '1st Year',
    developerRole: 'Full-Stack Lead',
    githubUrl: '',
    personaMode: 'HACKATHON_SPRINT'
  });

  const [githubStatus, setGithubStatus] = useState({ checking: false, valid: false, message: '', avatar: null });
  const [emailStatus, setEmailStatus] = useState({ valid: false, message: '' });
  const [loading, setLoading] = useState(false);

  // Live GitHub verification with debounce
  useEffect(() => {
    if (!formData.githubUrl) {
      setGithubStatus({ checking: false, valid: false, message: '', avatar: null });
      return;
    }
    setGithubStatus(prev => ({ ...prev, checking: true }));
    const timer = setTimeout(async () => {
      const res = await verifyGithubProfile(formData.githubUrl);
      setGithubStatus({
        checking: false,
        valid: res.valid,
        message: res.message,
        avatar: res.avatar || null
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.githubUrl]);

  // Live email validation
  useEffect(() => {
    if (!formData.email) {
      setEmailStatus({ valid: false, message: '' });
      return;
    }
    const res = validateEmail(formData.email);
    setEmailStatus({ valid: res.valid, message: res.message });
  }, [formData.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Build updated profile locally first — modal will always close
    const updatedProfile = {
      ...profile,
      displayName: formData.displayName,
      email: formData.email,
      academic: {
        college: formData.college,
        major: formData.major,
        yearOfStudy: formData.yearOfStudy,
        developerRole: formData.developerRole,
        githubUrl: formData.githubUrl
      },
      geminiAiPreferences: {
        ...(profile?.geminiAiPreferences || {}),
        personaMode: formData.personaMode,
        aboutUser: `${formData.yearOfStudy} ${formData.major} student at ${formData.college}. Role: ${formData.developerRole}.`
      },
      isProfileComplete: true
    };

    try {
      await api.put('/user/profile/academic', {
        displayName: formData.displayName,
        email: formData.email,
        college: formData.college,
        major: formData.major,
        yearOfStudy: formData.yearOfStudy,
        developerRole: formData.developerRole,
        githubUrl: formData.githubUrl
      });

      await api.put('/user/profile/ai-preferences', {
        personaMode: formData.personaMode,
        aboutUser: `${formData.yearOfStudy} ${formData.major} student at ${formData.college}. Role: ${formData.developerRole}.`
      });
    } catch (err) {
      console.warn('Profile save API notice (local state still updated):', err.message);
    } finally {
      // Always close modal and update local state regardless of API success
      setProfile(updatedProfile);
      setOnboardingModalOpen(false);
      setLoading(false);
    }
  };

  if (!onboardingModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0D0F2B]/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-[#E6E8F5] rounded-2xl max-w-2xl w-full p-6 md:p-8 text-[#12162A] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5A3C] to-[#8C5CFF] flex items-center justify-center mx-auto shadow-md shadow-[#FF5A3C]/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-[#12162A]">Welcome to Synapse.AI</h2>
          <p className="text-xs text-[#5B6178] max-w-md mx-auto">
            Please complete your student profile to personalize your AI research copilot, paper citations, and milestone execution roadmaps.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1 flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Chen"
                value={formData.displayName}
                onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF] focus:bg-white transition"
                required
              />
            </div>

            {/* Student Email */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Student Email *</span>
                </span>
                {emailStatus.message && (
                  emailStatus.valid ? (
                    <span className="text-[10px] text-[#0F8F6B] font-mono flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Valid</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#FF5A3C] font-mono flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>Invalid</span>
                    </span>
                  )
                )}
              </label>
              <input
                type="email"
                placeholder="alex.chen@university.edu"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF] focus:bg-white transition"
                required
              />
            </div>

            {/* College */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1 flex items-center space-x-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>College / University *</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Stanford University"
                value={formData.college}
                onChange={e => setFormData({ ...formData, college: e.target.value })}
                className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF] focus:bg-white transition"
                required
              />
            </div>

            {/* Major */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1">Academic Major *</label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                value={formData.major}
                onChange={e => setFormData({ ...formData, major: e.target.value })}
                className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF] focus:bg-white transition"
                required
              />
            </div>

            {/* Year of Study */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1">Year of Study</label>
              <select
                value={formData.yearOfStudy}
                onChange={e => setFormData({ ...formData, yearOfStudy: e.target.value })}
                className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF] focus:bg-white transition cursor-pointer"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year / Final</option>
                <option value="Postgrad">Postgraduate / MTech</option>
              </select>
            </div>

            {/* Developer Role */}
            <div>
              <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1 flex items-center space-x-1">
                <Code className="w-3.5 h-3.5" />
                <span>Primary Developer Role</span>
              </label>
              <select
                value={formData.developerRole}
                onChange={e => setFormData({ ...formData, developerRole: e.target.value })}
                className="w-full bg-[#F5F6FD] border border-[#E6E8F5] rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none focus:border-[#8C5CFF] focus:bg-white transition cursor-pointer"
              >
                <option value="Full-Stack Lead">Full-Stack Lead</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Frontend Dev">Frontend Dev</option>
                <option value="Backend Dev">Backend Dev</option>
                <option value="Research Scholar">Research Scholar</option>
              </select>
            </div>
          </div>

          {/* GitHub Profile URL with Live Validation */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-1 flex items-center justify-between">
              <span className="flex items-center space-x-1">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Profile Handle / URL</span>
              </span>
              {githubStatus.checking ? (
                <span className="text-[10px] text-[#9198B0] font-mono flex items-center space-x-1">
                  <RefreshCw className="w-3 h-3 animate-spin text-[#8C5CFF]" />
                  <span>Verifying GitHub API...</span>
                </span>
              ) : githubStatus.message ? (
                githubStatus.valid ? (
                  <span className="text-[10px] text-[#0F8F6B] font-mono font-semibold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-[#00D3A0]" />
                    <span>{githubStatus.message}</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-[#FF5A3C] font-mono font-semibold flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3 text-[#FF5A3C]" />
                    <span>{githubStatus.message}</span>
                  </span>
                )
              ) : null}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://github.com/username"
                value={formData.githubUrl}
                onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                className={`w-full bg-[#F5F6FD] border rounded-xl px-3.5 py-2.5 text-xs text-[#12162A] focus:outline-none transition ${
                  githubStatus.valid 
                    ? 'border-[#00D3A0] bg-white' 
                    : githubStatus.message && !githubStatus.valid 
                    ? 'border-[#FF5A3C] bg-white' 
                    : 'border-[#E6E8F5] focus:border-[#8C5CFF]'
                }`}
              />
              {githubStatus.avatar && (
                <img 
                  src={githubStatus.avatar} 
                  alt="GitHub Avatar" 
                  className="w-5 h-5 rounded-full absolute right-3 top-2.5 border border-[#E6E8F5]"
                />
              )}
            </div>
          </div>

          {/* AI Persona Selection */}
          <div>
            <label className="block text-xs font-mono font-bold text-[#FF5A3C] uppercase mb-2">Preferred AI Persona Mode</label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'HACKATHON_SPRINT', title: '🏎️ Hackathon Sprint', desc: 'Fast, code-first deliverables' },
                { id: 'ACADEMIC_RESEARCH', title: '🎓 Academic & Research', desc: 'IEEE citations & deep math' },
                { id: 'ELI5_BEGINNER', title: '🐣 Beginner Friendly', desc: 'Simple step-by-step guidance' },
                { id: 'ENTERPRISE_ARCHITECT', title: '🏗️ Enterprise Architect', desc: 'Microservices & security focus' },
              ].map(p => (
                <div
                  key={p.id}
                  onClick={() => setFormData({ ...formData, personaMode: p.id })}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    formData.personaMode === p.id 
                      ? 'border-[#8C5CFF] bg-[#EEE8FF]/50 text-[#12162A]' 
                      : 'border-[#E6E8F5] bg-[#F5F6FD] text-[#5B6178] hover:border-[#9198B0]'
                  }`}
                >
                  <h5 className="font-bold text-xs">{p.title}</h5>
                  <p className="text-[10px] text-[#9198B0] mt-0.5">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FF5A3C] to-[#8C5CFF] hover:from-[#FF5A3C]/90 hover:to-[#8C5CFF]/90 text-white font-display font-semibold py-3 rounded-xl text-xs transition shadow-md shadow-[#FF5A3C]/20 flex items-center justify-center space-x-2 mt-4"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save & Complete Profile</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
