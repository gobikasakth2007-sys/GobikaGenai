import { useState } from 'react';
import { AchievementsPortal } from './components/AchievementsPortal';
import { AdmissionsPortal } from './components/AdmissionsPortal';
import { CampusPortal } from './components/CampusPortal';
import { ChatbotWidget } from './components/ChatbotWidget';
import { CourseForumsPortal } from './components/CourseForumsPortal';
import { CulturalsPortal } from './components/CulturalsPortal';
import { EnrollmentHostelPortal } from './components/EnrollmentHostelPortal';
import { FacilitiesPortal } from './components/FacilitiesPortal';
import { FacultyPortal } from './components/FacultyPortal';
import { Footer } from './components/Footer';
import { GlobalPortal } from './components/GlobalPortal';
import { Header } from './components/Header';
import { InterCollegePortal } from './components/InterCollegePortal';
import { OverviewPortal } from './components/OverviewPortal';
import { PlacementsPortal } from './components/PlacementsPortal';
import { PortalRail } from './components/PortalRail';
import type { PortalId } from './types/portal';

export default function App() {
  const [activePortal, setActivePortal] = useState<PortalId>('overview');
  const [chatPrompt, setChatPrompt] = useState<string | null>(null);

  const renderPortal = () => {
    switch (activePortal) {
      case 'overview':
        return (
          <OverviewPortal
            onSelectPortal={setActivePortal}
            onOpenChatWithPrompt={(prompt) => setChatPrompt(prompt)}
          />
        );
      case 'admissions':
        return <AdmissionsPortal />;
      case 'placements':
        return <PlacementsPortal />;
      case 'faculty':
        return <FacultyPortal />;
      case 'campus':
        return <CampusPortal />;
      case 'culturals':
        return <CulturalsPortal />;
      case 'achievements':
        return <AchievementsPortal />;
      case 'forums':
        return <CourseForumsPortal />;
      case 'facilities':
        return <FacilitiesPortal />;
      case 'enrollment-hostel':
        return <EnrollmentHostelPortal />;
      case 'inter-college':
        return <InterCollegePortal />;
      case 'global':
        return <GlobalPortal />;
      default:
        return (
          <OverviewPortal
            onSelectPortal={setActivePortal}
            onOpenChatWithPrompt={(prompt) => setChatPrompt(prompt)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      <Header activePortal={activePortal} onSelectPortal={setActivePortal} />
      <PortalRail activePortal={activePortal} onSelectPortal={setActivePortal} />

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-8">
        {renderPortal()}
      </main>

      <Footer onSelectPortal={setActivePortal} />

      <ChatbotWidget
        activePortal={activePortal}
        onNavigatePortal={setActivePortal}
        externalOpenPrompt={chatPrompt}
        onClearExternalPrompt={() => setChatPrompt(null)}
      />
    </div>
  );
}
