import React, { useState } from 'react';
import { DevVaultProvider, useDevVault } from './context/DevVaultContext';
import { Sidebar } from './components/navigation/Sidebar';
import { TopNav } from './components/navigation/TopNav';
import { ToastContainer } from './components/common/ToastContainer';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { ShortcutsModal } from './components/modals/ShortcutsModal';

// Features
import { Dashboard } from './features/dashboard/Dashboard';
import { PolyglotStudio } from './features/polyglot/PolyglotStudio';
import { CodeVault } from './features/code-vault/CodeVault';
import { JsonFormatter } from './features/json-tools/JsonFormatter';
import { MarkdownEditor } from './features/markdown/MarkdownEditor';
import { HtmlPlayground } from './features/playgrounds/HtmlPlayground';
import { CssPlayground } from './features/playgrounds/CssPlayground';
import { JsPlayground } from './features/playgrounds/JsPlayground';
import { TextToolkit } from './features/text-tools/TextToolkit';
import { Base64Converter } from './features/base64/Base64Converter';
import { ColorStudio } from './features/color-studio/ColorStudio';
import { RegexTester } from './features/regex/RegexTester';
import { DiffChecker } from './features/diff/DiffChecker';
import { NotesManager } from './features/notes/NotesManager';
import { TaskManager } from './features/tasks/TaskManager';
import { SettingsView } from './features/settings/SettingsView';

const WorkspaceContent: React.FC = () => {
  const { activeTool, settings } = useDevVault();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'dashboard':
        return <Dashboard />;
      case 'polyglot':
        return <PolyglotStudio />;
      case 'code-vault':
        return <CodeVault />;
      case 'json-tools':
        return <JsonFormatter />;
      case 'markdown':
        return <MarkdownEditor />;
      case 'html-playground':
        return <HtmlPlayground />;
      case 'css-playground':
        return <CssPlayground />;
      case 'js-playground':
        return <JsPlayground />;
      case 'text-tools':
        return <TextToolkit />;
      case 'base64':
        return <Base64Converter />;
      case 'color-studio':
        return <ColorStudio />;
      case 'regex':
        return <RegexTester />;
      case 'diff':
        return <DiffChecker />;
      case 'notes':
        return <NotesManager />;
      case 'tasks':
        return <TaskManager />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  const isCollapsed = settings.sidebarCollapsed;

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#111215] text-[#1f2328] dark:text-[#f0f2f5] flex flex-col antialiased selection:bg-indigo-500/20 selection:text-indigo-400 transition-colors duration-150">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenOnMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main App Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${
          isCollapsed ? 'lg:pl-18' : 'lg:pl-64'
        }`}
      >
        <TopNav onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {renderActiveTool()}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <ShortcutsModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <DevVaultProvider>
      <WorkspaceContent />
    </DevVaultProvider>
  );
}
