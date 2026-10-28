import React from "react";
import { Sparkles, LayoutDashboard, Edit3, HelpCircle, History, RotateCcw, ShieldCheck } from "lucide-react";

interface HeaderProps {
  activeView: "studio" | "dashboard";
  onSwitchView: (view: "studio" | "dashboard") => void;
  hasAnalysis: boolean;
  onOpenApiInfo: () => void;
  onOpenSavedProjects: () => void;
  onResetWorkspace: () => void;
  projectName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSwitchView,
  hasAnalysis,
  onOpenApiInfo,
  onOpenSavedProjects,
  onResetWorkspace,
  projectName,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f1321]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="h-20 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Section */}
        <div className="flex items-center gap-4 lg:gap-6 shrink-0">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSwitchView("studio")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-['Inter']">ProjectLens</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-white/[0.08] text-[#d0bcff] text-[10px] font-semibold uppercase tracking-wider border border-white/[0.08]">
                  AI Idea Intelligence
                </span>
              </div>
              <span className="text-xs text-[#958ea0] hidden md:inline font-medium tracking-tight">
                See Your Project Clearly
              </span>
            </div>
          </div>

          {/* Main View Switcher (Desktop Nav) */}
          <nav className="hidden md:flex items-center bg-[#090e1c] p-1 rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => onSwitchView("studio")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === "studio"
                  ? "bg-[#252939] text-white shadow-[0_0_12px_rgba(208,188,255,0.2)] border border-white/[0.08]"
                  : "text-[#cbc3d7] hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-[#d0bcff]" />
              <span>1. Idea Studio</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (hasAnalysis) onSwitchView("dashboard");
              }}
              disabled={!hasAnalysis}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === "dashboard"
                  ? "bg-[#252939] text-white shadow-[0_0_12px_rgba(76,215,246,0.2)] border border-white/[0.08]"
                  : hasAnalysis
                  ? "text-[#cbc3d7] hover:text-white hover:bg-white/[0.04]"
                  : "text-white/30 cursor-not-allowed"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#4cd7f6]" />
              <span>2. Intelligence Dashboard</span>
              {hasAnalysis && (
                <span className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse"></span>
              )}
            </button>
          </nav>
        </div>

        {/* Right Tools Section */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* AI Free Tier Badge */}
          <div
            onClick={onOpenApiInfo}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#171b2a] border border-white/[0.08] cursor-pointer hover:border-[#8B5CF6]/50 transition-colors"
            title="Click for Gemini free tier details and quota info"
          >
            <div className="w-2 h-2 rounded-full bg-[#4cd7f6] animate-pulse shadow-[0_0_8px_rgba(76,215,246,0.8)]"></div>
            <span className="text-xs text-[#cbc3d7]">
              AI Engine: <span className="text-[#4cd7f6] font-medium">Gemini 2.5 Flash-Lite</span>{" "}
              <span className="text-white/40">(Free Tier)</span>
            </span>
          </div>

          {/* Quick Buttons */}
          <button
            type="button"
            onClick={onOpenApiInfo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252939] hover:bg-[#303444] text-[#dfe1f6] text-xs font-semibold transition-colors border border-white/[0.06]"
            title="Free Tier & Pricing Documentation"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#4cd7f6]" />
            <span className="hidden sm:inline">Free Tier Info</span>
          </button>

          <button
            type="button"
            onClick={onOpenSavedProjects}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252939] hover:bg-[#303444] text-[#dfe1f6] text-xs font-semibold transition-colors border border-white/[0.06]"
            title="View Saved Projects"
          >
            <History className="w-3.5 h-3.5 text-[#d0bcff]" />
            <span className="hidden sm:inline">Saved Plans</span>
          </button>

          <button
            type="button"
            onClick={onResetWorkspace}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252939] hover:bg-[#303444] text-[#dfe1f6] text-xs font-semibold transition-colors border border-white/[0.06]"
            title="Reset Workspace"
          >
            <RotateCcw className="w-3.5 h-3.5 text-white/60" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <div
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-white text-xs font-bold shadow-md cursor-default"
            title="ProjectLens Autonomous Analyst"
          >
            PL
          </div>
        </div>
      </div>

      {/* Mobile Nav Sub-Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-[#090e1c] border-t border-white/[0.06]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onSwitchView("studio")}
            className={`px-3 py-1 rounded-md text-xs font-semibold ${
              activeView === "studio" ? "bg-[#252939] text-white" : "text-[#cbc3d7]"
            }`}
          >
            Idea Studio
          </button>
          <button
            type="button"
            onClick={() => hasAnalysis && onSwitchView("dashboard")}
            disabled={!hasAnalysis}
            className={`px-3 py-1 rounded-md text-xs font-semibold ${
              activeView === "dashboard"
                ? "bg-[#252939] text-white"
                : hasAnalysis
                ? "text-[#cbc3d7]"
                : "text-white/30"
            }`}
          >
            Dashboard
          </button>
        </div>
        {projectName && (
          <span className="text-[11px] text-[#4cd7f6] truncate max-w-[150px] font-medium">
            {projectName}
          </span>
        )}
      </div>
    </header>
  );
};
