import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, useClerk } from '@clerk/clerk-react';
import api, { setupApiAuth } from '../services/api.js';
import { defaultProfile, defaultWorkspace } from '../services/mockData.js';

const WorkspaceContext = createContext();

function extractKeywords(text) {
  if (!text) return ["Innovation", "Research"];
  const words = text.match(/\b[A-Za-z]{3,}\b/g) || [];
  const stopwords = new Set(["build", "with", "that", "this", "from", "using", "your", "have", "will", "make", "system", "app", "solution", "project", "for", "and", "the"]);
  const filtered = words.filter(w => !stopwords.has(w.toLowerCase())).map(w => w.charAt(0).toUpperCase() + w.slice(1));
  return filtered.length > 0 ? filtered : ["Research", "Innovation"];
}

export const WorkspaceProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('idea'); // idea | deepsearch | clustering | projecthub | dashboard | agent
  const [profile, setProfile] = useState(defaultProfile);
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [researchProgress, setResearchProgress] = useState({ stage: 1, message: '', percent: 0 });
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [language, setLanguage] = useState('EN');

  let getToken = null;
  let clerkSignOut = null;

  try {
    const auth = useAuth();
    getToken = auth?.getToken;
  } catch (e) {
    console.warn('Clerk auth hook notice:', e.message);
  }

  try {
    const clerk = useClerk();
    clerkSignOut = clerk?.signOut;
  } catch (e) {
    console.warn('Clerk useClerk hook notice:', e.message);
  }

  useEffect(() => {
    if (!getToken) return; // Wait until Clerk auth token is ready
    setupApiAuth(getToken);
    fetchProfile();
    fetchWorkspaces();
  }, [getToken]);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user/profile');
      if (res.data?.success) {
        setProfile(res.data.data);
        if (res.data.data.isProfileComplete === false) {
          setOnboardingModalOpen(true);
        }
      }
    } catch (err) {
      console.warn('API fetch profile notice:', err.message);
    }
  };

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get('/workspaces');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setWorkspaces(res.data.data);
        if (!activeWorkspace) {
          fetchWorkspaceDetails(res.data.data[0].workspaceId);
        }
      }
    } catch (err) {
      console.warn('API fetch workspaces notice:', err.message);
    }
  };

  const fetchWorkspaceDetails = async (workspaceId) => {
    try {
      const res = await api.get(`/workspaces/${workspaceId}`);
      if (res.data?.success) {
        setActiveWorkspace(res.data.data);
      }
    } catch (err) {
      console.warn('API fetch workspace details notice:', err.message);
    }
  };

  const createWorkspace = async (title, rawIdea) => {
    setLoading(true);
    setResearchProgress({ stage: 1, message: 'Initiating DeepSearch & querying arXiv databases for papers...', percent: 20 });
    
    // Stage 2 progress update
    setTimeout(() => {
      setResearchProgress({ stage: 2, message: 'Verifying DOI links and GitHub repository validity...', percent: 50 });
    }, 800);

    // Stage 3 progress update
    setTimeout(() => {
      setResearchProgress({ stage: 3, message: 'Clustering existing solutions & detecting research gaps...', percent: 75 });
    }, 1600);

    // Stage 4 progress update
    setTimeout(() => {
      setResearchProgress({ stage: 4, message: 'Generating system architecture & milestone roadmap...', percent: 95 });
    }, 2400);

    try {
      const res = await api.post('/workspaces', { title, rawIdea });
      if (res.data?.success) {
        const newWsId = res.data.workspaceId;
        const newWs = {
          ...defaultWorkspace,
          workspaceId: newWsId,
          title,
          rawIdea,
          status: 'RESEARCHING'
        };
        setWorkspaces(prev => [newWs, ...prev]);

        // Fetch completed workspace details after research pipeline finishes
        setTimeout(async () => {
          await fetchWorkspaceDetails(newWsId);
          setResearchProgress({ stage: 4, message: 'Research complete! Opening DeepSearch...', percent: 100 });
          setTimeout(() => {
            setLoading(false);
            setCurrentScreen('deepsearch');
          }, 400);
        }, 2800);
      } else {
        throw new Error('API returned success=false');
      }
    } catch (err) {
      console.error('API error creating workspace:', err.message);
      setLoading(false);
      setResearchProgress({ stage: 1, message: 'Connection error — please retry.', percent: 0 });
    }
  };

  const selectWorkspace = (workspaceId) => {
    const ws = workspaces.find(w => w.workspaceId === workspaceId);
    if (ws) {
      setActiveWorkspace(ws);
      fetchWorkspaceDetails(workspaceId);
      setCurrentScreen('deepsearch');
    }
  };

  const deleteWorkspace = async (workspaceId, e) => {
    if (e) e.stopPropagation();
    try {
      await api.delete(`/workspaces/${workspaceId}`);
    } catch (err) {
      console.warn('API notice on delete workspace:', err.message);
    }
    const updatedList = workspaces.filter(w => w.workspaceId !== workspaceId);
    setWorkspaces(updatedList);

    if (activeWorkspace?.workspaceId === workspaceId) {
      if (updatedList.length > 0) {
        setActiveWorkspace(updatedList[0]);
      } else {
        setActiveWorkspace(null);
        setCurrentScreen('idea');
      }
    }
  };

  const updateMilestone = async (milestoneId, newStatus) => {
    if (!activeWorkspace) return;
    try {
      await api.patch(`/workspaces/${activeWorkspace.workspaceId}/milestones/${milestoneId}`, { status: newStatus });
      const updatedMilestones = activeWorkspace.projectHub.milestones.map(m => 
        m.id === milestoneId ? { ...m, status: newStatus } : m
      );
      setActiveWorkspace({
        ...activeWorkspace,
        projectHub: {
          ...activeWorkspace.projectHub,
          milestones: updatedMilestones
        }
      });
    } catch (err) {
      console.error('Error updating milestone:', err);
    }
  };

  const updatePersonaMode = async (newPersona) => {
    try {
      const updatedPrefs = {
        ...profile?.geminiAiPreferences,
        personaMode: newPersona
      };
      await api.put('/user/profile/ai-preferences', updatedPrefs);
      setProfile({
        ...profile,
        geminiAiPreferences: updatedPrefs
      });
    } catch (err) {
      console.error('Error updating persona mode:', err);
    }
  };

  /**
   * Handles user logout: clears active session and signs out via Clerk
   */
  const logout = async () => {
    try {
      setWorkspaces([]);
      setActiveWorkspace(null);
      setProfile(null);
      setCurrentScreen('idea');
      if (clerkSignOut) {
        await clerkSignOut();
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  /**
   * Permanently deletes user profile and associated workspaces
   */
  const deleteProfile = async () => {
    try {
      await api.delete('/user/profile');
    } catch (err) {
      console.warn('API error deleting profile, executing local state cleanup:', err.message);
    }
    await logout();
  };

  return (
    <WorkspaceContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      profile,
      setProfile,
      workspaces,
      activeWorkspace,
      setActiveWorkspace,
      fetchWorkspaceDetails,
      createWorkspace,
      selectWorkspace,
      deleteWorkspace,
      updateMilestone,
      updatePersonaMode,
      logout,
      deleteProfile,
      loading,
      researchProgress,
      profileModalOpen,
      setProfileModalOpen,
      onboardingModalOpen,
      setOnboardingModalOpen,
      language,
      setLanguage
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => useContext(WorkspaceContext);
