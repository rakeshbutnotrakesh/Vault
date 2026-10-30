import React from 'react';
import { useDevVault } from '../../context/DevVaultContext';
import { TOOLS } from '../../lib/constants';
import { ToolId } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { VaultLogo } from '../common/VaultLogo';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';

interface SidebarProps {
  isOpenOnMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenOnMobile, onCloseMobile }) => {
  const { activeTool, setActiveTool, settings, updateSettings, toggleFavoriteTool } = useDevVault();
  const isCollapsed = settings.sidebarCollapsed;

  const categories = ['Workspace', 'Management', 'Playgrounds', 'Editors', 'Utilities'] as const;

  const handleToolClick = (toolId: ToolId) => {
    setActiveTool(toolId);
    onCloseMobile();
  };

  const toggleCollapsed = () => {
    updateSettings({ sidebarCollapsed: !isCollapsed });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container - NotebookLM sleek styling */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-[#f3f4f7] dark:bg-[#141519] border-r border-[#e2e5eb] dark:border-[#22252d] text-slate-700 dark:text-slate-300 transition-all duration-200 select-none ${
          isCollapsed ? 'w-18' : 'w-64'
        } ${isOpenOnMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header with new Vault Logo */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-[#e2e5eb] dark:border-[#22252d] shrink-0">
          <div
            onClick={() => handleToolClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform shadow-xs">
              <VaultLogo className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            {!isCollapsed && (
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Vault
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider">
                  STUDIO
                </span>
              </div>
            )}
          </div>

          <button
            onClick={toggleCollapsed}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex items-center justify-center w-6 h-6 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3.5">
          {categories.map((cat) => {
            const catTools = TOOLS.filter((t) => t.category === cat);
            if (catTools.length === 0) return null;

            return (
              <div key={cat} className="space-y-0.5">
                {!isCollapsed && (
                  <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-400 tracking-wider">
                    {cat}
                  </div>
                )}
                {catTools.map((tool) => {
                  const isActive = activeTool === tool.id;
                  const isFav = settings.favorites.includes(tool.id);

                  return (
                    <div
                      key={tool.id}
                      className="group/item relative flex items-center"
                    >
                      <button
                        onClick={() => handleToolClick(tool.id)}
                        title={isCollapsed ? tool.name : undefined}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left ${
                          isActive
                            ? 'bg-white dark:bg-[#20232b] text-indigo-600 dark:text-indigo-300 shadow-xs border border-slate-200/90 dark:border-slate-700/60'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-[#e7eaf0] dark:hover:bg-[#1b1d24] hover:text-slate-900 dark:hover:text-white'
                        } ${isCollapsed ? 'justify-center px-0' : ''}`}
                      >
                        <span
                          className={`shrink-0 ${
                            isActive
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-400 dark:text-slate-400 group-hover/item:text-slate-700 dark:group-hover/item:text-slate-200'
                          }`}
                        >
                          <IconRenderer name={tool.iconName} className="w-4 h-4" />
                        </span>

                        {!isCollapsed && (
                          <span className="flex-1 truncate">{tool.name}</span>
                        )}

                        {!isCollapsed && tool.badge && (
                          <span className="text-[10px] text-indigo-500 dark:text-indigo-300 font-mono">
                            {tool.badge}
                          </span>
                        )}
                      </button>

                      {/* Favorite toggle star */}
                      {!isCollapsed && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteTool(tool.id);
                          }}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          className={`absolute right-2 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 text-slate-400 hover:text-amber-500 ${
                            isFav ? 'opacity-100 text-amber-500' : ''
                          }`}
                        >
                          <Star className={`w-3 h-3 ${isFav ? 'fill-amber-500' : ''}`} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer info & privacy reassurance */}
        <div className="p-3 border-t border-[#e2e5eb] dark:border-[#22252d] shrink-0 text-xs">
          {!isCollapsed ? (
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">Local Storage Only</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">v1.2</span>
            </div>
          ) : (
            <div className="flex justify-center text-emerald-600 dark:text-emerald-400" title="Local Storage Only">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
