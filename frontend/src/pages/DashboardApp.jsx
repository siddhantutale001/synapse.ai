import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import IdeaHero from '../components/idea/IdeaHero.jsx';
import PipelineStrip from '../components/idea/PipelineStrip.jsx';
import FilterChips from '../components/deepsearch/FilterChips.jsx';
import CitationCard from '../components/deepsearch/CitationCard.jsx';
import WorkspaceSideCard from '../components/deepsearch/WorkspaceSideCard.jsx';
import ClusterBoard from '../components/clustering/ClusterBoard.jsx';
import InnovationGapCard from '../components/clustering/InnovationGapCard.jsx';
import ArchDiagram from '../components/projecthub/ArchDiagram.jsx';
import TechStackGrid from '../components/projecthub/TechStackGrid.jsx';
import MilestoneTimeline from '../components/projecthub/MilestoneTimeline.jsx';
import StatCardRow from '../components/dashboard/StatCardRow.jsx';
import ActivityFeed from '../components/dashboard/ActivityFeed.jsx';
import QuickLinks from '../components/dashboard/QuickLinks.jsx';
import PastProjectsGrid from '../components/dashboard/PastProjectsGrid.jsx';
import PhoneMockup from '../components/agent/PhoneMockup.jsx';
import AgentFeatures from '../components/agent/AgentFeatures.jsx';

export default function DashboardApp() {
  const { currentScreen, activeWorkspace } = useWorkspace();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const citations = activeWorkspace?.deepsearch?.citations || [];

  const filteredCitations = citations.filter(c => {
    if (activeFilter === 'ALL') return true;
    return c.type === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Screen 1: Idea Studio */}
      {currentScreen === 'idea' && (
        <div className="space-y-6 animate-fadeIn">
          <IdeaHero />
          <PipelineStrip />
        </div>
      )}

      {/* Screen 2: DeepSearch Results */}
      {currentScreen === 'deepsearch' && (
        activeWorkspace ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            <div className="lg:col-span-8 space-y-4">
              <FilterChips activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
              <div className="space-y-4">
                {filteredCitations.map(cit => (
                  <CitationCard key={cit.id} citation={cit} />
                ))}
              </div>
            </div>
            <div className="lg:col-span-4">
              <WorkspaceSideCard />
            </div>
          </div>
        ) : (
          <EmptyState screenName="DeepSearch Intelligence" />
        )
      )}

      {/* Screen 3: Knowledge Clustering */}
      {currentScreen === 'clustering' && (
        activeWorkspace ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
            <div className="lg:col-span-7">
              <ClusterBoard />
            </div>
            <div className="lg:col-span-5">
              <InnovationGapCard />
            </div>
          </div>
        ) : (
          <EmptyState screenName="Knowledge Clustering" />
        )
      )}

      {/* Screen 4: Project HUB */}
      {currentScreen === 'projecthub' && (
        activeWorkspace ? (
          <div className="space-y-6 animate-fadeIn">
            <ArchDiagram />
            <TechStackGrid />
            <MilestoneTimeline />
          </div>
        ) : (
          <EmptyState screenName="Project HUB Roadmap" />
        )
      )}

      {/* Screen 5: Dashboard KPI */}
      {currentScreen === 'dashboard' && (
        activeWorkspace ? (
          <div className="space-y-6 animate-fadeIn">
            <StatCardRow />
            <QuickLinks />
            <PastProjectsGrid />
            <ActivityFeed />
          </div>
        ) : (
          <EmptyState screenName="Executive Dashboard KPI" />
        )
      )}

      {/* Screen 6: AI Companion Bot */}
      {currentScreen === 'agent' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          <div className="lg:col-span-6">
            <PhoneMockup />
          </div>
          <div className="lg:col-span-6">
            <AgentFeatures />
          </div>
        </div>
      )}
    </div>
  );
}
