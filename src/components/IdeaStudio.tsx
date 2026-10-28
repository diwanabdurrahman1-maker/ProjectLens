import React, { useState } from "react";
import { Sparkles, Wand2, Trash2, ArrowRight, HelpCircle, AlertCircle, RefreshCw, CheckCircle2, Clock, ShieldAlert } from "lucide-react";
import { ProjectInput } from "../types";
import { STUDENT_PLANNER_EXAMPLE } from "../constants";

interface IdeaStudioProps {
  input: ProjectInput;
  onChangeInput: (newInput: ProjectInput) => void;
  onSubmitAnalyze: () => void;
  isLoading: boolean;
  loadingStage: number;
  loadingProgress: number;
  errorMessage: string | null;
  errorCode?: string | null;
  onClearError: () => void;
  onShowToast: (msg: string, type?: "success" | "alert" | "info") => void;
}

export const IdeaStudio: React.FC<IdeaStudioProps> = ({
  input,
  onChangeInput,
  onSubmitAnalyze,
  isLoading,
  loadingStage,
  loadingProgress,
  errorMessage,
  errorCode,
  onClearError,
  onShowToast,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const handleFieldChange = (field: keyof ProjectInput, value: string) => {
    onChangeInput({
      ...input,
      [field]: value,
    });
    if (errorMessage) {
      onClearError();
    }
  };

  const handleLoadStudentExample = () => {
    onChangeInput({ ...STUDENT_PLANNER_EXAMPLE });
    onClearError();
    onShowToast("Loaded Student Study Planner example! Review and click 'Analyze My Project'.");
  };

  const handleClear = () => {
    onChangeInput({
      idea: "",
      audience: "",
      problem: "",
      solutions: "",
    });
    onClearError();
    onShowToast("Form cleared.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.idea.trim() || !input.audience.trim() || !input.problem.trim() || !input.solutions.trim()) {
      onShowToast("Please complete all four fields to begin analysis.", "alert");
      return;
    }
    onSubmitAnalyze();
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-8 pb-16">
      {/* Hero Banner with Cosmic Ambient Glow */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1b1f2e] via-[#141d38] to-[#0d1326] p-6 sm:p-10 lg:p-12 border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        {/* Glow Spheres */}
        <div className="absolute -top-24 -right-24 w-80 sm:w-96 h-80 sm:h-96 bg-[#8B5CF6]/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 sm:w-80 h-72 sm:h-80 bg-[#06B6D4]/15 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#d0bcff] w-fit text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#4cd7f6]" />
            <span>See Your Project Clearly</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Transform Raw Ideas into Clear, Validated Product Blueprints with Real AI
          </h1>

          <p className="text-base sm:text-lg text-[#cbc3d7] font-normal leading-relaxed max-w-2xl">
            Autonomous heuristic analysis across market research, risk validation, feature improvements, and MVP roadmap execution powered by Google Gemini free tier.
          </p>

          {/* Action buttons row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleLoadStudentExample}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#252939] hover:bg-[#303444] text-white text-xs font-semibold border border-white/[0.1] hover:border-[#8B5CF6]/40 transition-all shadow-md group"
            >
              <Wand2 className="w-4 h-4 text-[#4cd7f6] group-hover:rotate-12 transition-transform" />
              <span>Try Student Planner Example</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#cbc3d7] hover:text-white text-xs font-semibold border border-white/[0.06] transition-all"
            >
              <Trash2 className="w-3.5 h-3.5 text-white/50" />
              <span>Clear Form</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-white/40 ml-1">
              <span>•</span>
              <span className="hidden sm:inline">Free Tier Model: Gemini 2.5 Flash-Lite</span>
              <span className="sm:hidden">Free Tier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error / Quota Notice Banner if any */}
      {errorMessage && (
        <div className="p-5 rounded-2xl bg-[#93000a]/20 border border-[#ffb4ab]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#ffb4ab] shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#ffb4ab]">
                {errorCode === "MISSING_API_KEY"
                  ? "Server API Key Required"
                  : errorCode === "RATE_LIMIT"
                  ? "Free Tier Rate Limit Encountered"
                  : "Analysis Error"}
              </span>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                {errorMessage}
              </p>
              {errorCode === "MISSING_API_KEY" && (
                <div className="mt-2 text-xs text-[#d0bcff] bg-black/40 p-2.5 rounded-lg border border-white/10 font-mono">
                  Set <code>GEMINI_API_KEY</code> in your AI Studio Secrets panel or server environment to run real AI queries.
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onSubmitAnalyze}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#ffb4ab]/20 hover:bg-[#ffb4ab]/30 text-[#ffb4ab] text-xs font-semibold transition-all border border-[#ffb4ab]/30"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              type="button"
              onClick={onClearError}
              className="px-3 py-2 rounded-xl text-xs text-white/50 hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Input Form Card Grid (4 Core Lenses) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Field 1: Idea Description */}
        <div className="flex flex-col gap-3 p-6 rounded-2xl bg-[#141D38]/60 backdrop-blur-md border border-white/[0.08] hover:border-white/[0.14] transition-all shadow-lg group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-[#8B5CF6]/20 text-[#d0bcff] flex items-center justify-center text-xs font-bold border border-[#8B5CF6]/30">
                1
              </span>
              <label htmlFor="inputIdea" className="text-sm font-bold text-white tracking-wide">
                Idea Description
              </label>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveTooltip(activeTooltip === 1 ? null : 1)}
                className="text-white/40 hover:text-white/80 transition-colors"
                title="Field help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              {activeTooltip === 1 && (
                <div className="absolute right-0 bottom-6 w-64 p-3 rounded-xl bg-[#1e2b52] text-white/90 text-xs shadow-2xl border border-white/10 z-30">
                  Detail what you want to build, its main capabilities, interactions, and expected mechanics.
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-[#cbc3d7]">
            What do you want to build? Describe core functionality and how users experience it.
          </p>

          <textarea
            id="inputIdea"
            rows={5}
            value={input.idea}
            onChange={(e) => handleFieldChange("idea", e.target.value)}
            placeholder="e.g., An app that helps students organize homework, assignments, exams, and revision schedules in one place..."
            className="w-full p-4 rounded-xl bg-[#070b19]/90 text-white placeholder-white/25 text-sm resize-none outline-none border border-white/[0.1] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
            required
            disabled={isLoading}
          />

          <div className="flex justify-between items-center text-[11px] text-[#958ea0]">
            <span>Essential for capability synthesis</span>
            <span className={input.idea.length > 0 ? "text-[#4cd7f6]" : ""}>{input.idea.length} chars</span>
          </div>
        </div>

        {/* Field 2: Target Audience */}
        <div className="flex flex-col gap-3 p-6 rounded-2xl bg-[#141D38]/60 backdrop-blur-md border border-white/[0.08] hover:border-white/[0.14] transition-all shadow-lg group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-[#06B6D4]/20 text-[#4cd7f6] flex items-center justify-center text-xs font-bold border border-[#06B6D4]/30">
                2
              </span>
              <label htmlFor="inputAudience" className="text-sm font-bold text-white tracking-wide">
                Target Audience
              </label>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveTooltip(activeTooltip === 2 ? null : 2)}
                className="text-white/40 hover:text-white/80 transition-colors"
                title="Field help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              {activeTooltip === 2 && (
                <div className="absolute right-0 bottom-6 w-64 p-3 rounded-xl bg-[#1e2b52] text-white/90 text-xs shadow-2xl border border-white/10 z-30">
                  Target cohorts, demographics, tech literacy, daily context, and initial beachhead adopters.
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-[#cbc3d7]">
            Who will use it? Specify demographics, personas, or specific groups.
          </p>

          <textarea
            id="inputAudience"
            rows={5}
            value={input.audience}
            onChange={(e) => handleFieldChange("audience", e.target.value)}
            placeholder="e.g., School students and college students balancing multiple classes..."
            className="w-full p-4 rounded-xl bg-[#070b19]/90 text-white placeholder-white/25 text-sm resize-none outline-none border border-white/[0.1] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/25 transition-all"
            required
            disabled={isLoading}
          />

          <div className="flex justify-between items-center text-[11px] text-[#958ea0]">
            <span>Shapes persona clustering & user journeys</span>
            <span className={input.audience.length > 0 ? "text-[#4cd7f6]" : ""}>{input.audience.length} chars</span>
          </div>
        </div>

        {/* Field 3: Problem You're Solving */}
        <div className="flex flex-col gap-3 p-6 rounded-2xl bg-[#141D38]/60 backdrop-blur-md border border-white/[0.08] hover:border-white/[0.14] transition-all shadow-lg group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-[#b76dff]/25 text-[#ddb7ff] flex items-center justify-center text-xs font-bold border border-[#b76dff]/30">
                3
              </span>
              <label htmlFor="inputProblem" className="text-sm font-bold text-white tracking-wide">
                Problem You're Solving
              </label>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveTooltip(activeTooltip === 3 ? null : 3)}
                className="text-white/40 hover:text-white/80 transition-colors"
                title="Field help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              {activeTooltip === 3 && (
                <div className="absolute right-0 bottom-6 w-64 p-3 rounded-xl bg-[#1e2b52] text-white/90 text-xs shadow-2xl border border-white/10 z-30">
                  The acute daily frustration, wasted hours, mental stress, or financial cost users currently experience.
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-[#cbc3d7]">
            What problem does it solve? What is the main friction or pain point?
          </p>

          <textarea
            id="inputProblem"
            rows={5}
            value={input.problem}
            onChange={(e) => handleFieldChange("problem", e.target.value)}
            placeholder="e.g., Students may forget deadlines, struggle to prioritize tasks, and find it difficult to plan revision across multiple subjects..."
            className="w-full p-4 rounded-xl bg-[#070b19]/90 text-white placeholder-white/25 text-sm resize-none outline-none border border-white/[0.1] focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/25 transition-all"
            required
            disabled={isLoading}
          />

          <div className="flex justify-between items-center text-[11px] text-[#958ea0]">
            <span>Drives validation metrics & hypothesis testing</span>
            <span className={input.problem.length > 0 ? "text-[#4cd7f6]" : ""}>{input.problem.length} chars</span>
          </div>
        </div>

        {/* Field 4: Current Solutions */}
        <div className="flex flex-col gap-3 p-6 rounded-2xl bg-[#141D38]/60 backdrop-blur-md border border-white/[0.08] hover:border-white/[0.14] transition-all shadow-lg group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-white/10 text-white/90 flex items-center justify-center text-xs font-bold border border-white/20">
                4
              </span>
              <label htmlFor="inputSolutions" className="text-sm font-bold text-white tracking-wide">
                Current Solutions
              </label>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveTooltip(activeTooltip === 4 ? null : 4)}
                className="text-white/40 hover:text-white/80 transition-colors"
                title="Field help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              {activeTooltip === 4 && (
                <div className="absolute right-0 bottom-6 w-64 p-3 rounded-xl bg-[#1e2b52] text-white/90 text-xs shadow-2xl border border-white/10 z-30">
                  How do people manage today? Competitors, workarounds, pen-and-paper, spreadsheets, or asking friends.
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-[#cbc3d7]">
            How do people solve this problem today? Competitors, workarounds, or manual steps.
          </p>

          <textarea
            id="inputSolutions"
            rows={5}
            value={input.solutions}
            onChange={(e) => handleFieldChange("solutions", e.target.value)}
            placeholder="e.g., Paper planners, notebooks, calendar apps, reminders, and spreadsheets..."
            className="w-full p-4 rounded-xl bg-[#070b19]/90 text-white placeholder-white/25 text-sm resize-none outline-none border border-white/[0.1] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/25 transition-all"
            required
            disabled={isLoading}
          />

          <div className="flex justify-between items-center text-[11px] text-[#958ea0]">
            <span>Evaluates market defensibility & competitive wedge</span>
            <span className={input.solutions.length > 0 ? "text-[#4cd7f6]" : ""}>{input.solutions.length} chars</span>
          </div>
        </div>

        {/* Submit & Analysis Control Bar */}
        <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[#1b1f2e]/80 border border-white/[0.08] backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 text-[#d0bcff] flex items-center justify-center border border-[#8B5CF6]/30 shrink-0">
              <Sparkles className="w-5 h-5 text-[#4cd7f6]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Full Spectrum AI Intelligence Engine</span>
              <span className="text-xs text-[#cbc3d7]">
                Calls Google Gemini free tier to generate your Research, Validation, Improvement, and Build Roadmap.
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#9333EA] to-[#06B6D4] text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(139,92,246,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Running Free-Tier AI Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Analyze My Project</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Interactive Live Analysis Tracker during Loading */}
      {isLoading && (
        <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-2xl bg-[#0f1321] border border-[#8B5CF6]/30 shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border-2 border-[#4cd7f6] border-t-transparent animate-spin"></div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Gemini Free-Tier Synthesizer Active</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#06B6D4]/20 text-[#4cd7f6] border border-[#06B6D4]/30">
                    Live Inference
                  </span>
                </h3>
                <p className="text-xs text-[#958ea0]">
                  Synthesizing real AI recommendations tailored to your project inputs...
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-[#4cd7f6] font-mono">{loadingProgress}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-[#1b1f2e] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>

          {/* 4 Sequential Verification Stages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              className={`flex items-start gap-3 p-4 rounded-xl transition-all ${
                loadingStage >= 1
                  ? "bg-[#252939] border border-[#8B5CF6]/40 shadow-sm opacity-100"
                  : "bg-[#171b2a] opacity-40"
              }`}
            >
              {loadingStage > 1 ? (
                <CheckCircle2 className="w-5 h-5 text-[#4cd7f6] shrink-0" />
              ) : loadingStage === 1 ? (
                <RefreshCw className="w-5 h-5 text-[#d0bcff] animate-spin shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-white/30 shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Stage 1: Intent Mapping</span>
                <span className="text-[11px] text-[#cbc3d7]">Taxonomy parsing & vector extraction</span>
              </div>
            </div>

            <div
              className={`flex items-start gap-3 p-4 rounded-xl transition-all ${
                loadingStage >= 2
                  ? "bg-[#252939] border border-[#06B6D4]/40 shadow-sm opacity-100"
                  : "bg-[#171b2a] opacity-40"
              }`}
            >
              {loadingStage > 2 ? (
                <CheckCircle2 className="w-5 h-5 text-[#4cd7f6] shrink-0" />
              ) : loadingStage === 2 ? (
                <RefreshCw className="w-5 h-5 text-[#4cd7f6] animate-spin shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-white/30 shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Stage 2: Market Landscape</span>
                <span className="text-[11px] text-[#cbc3d7]">Simulating competitor moats & gaps</span>
              </div>
            </div>

            <div
              className={`flex items-start gap-3 p-4 rounded-xl transition-all ${
                loadingStage >= 3
                  ? "bg-[#252939] border border-[#A855F7]/40 shadow-sm opacity-100"
                  : "bg-[#171b2a] opacity-40"
              }`}
            >
              {loadingStage > 3 ? (
                <CheckCircle2 className="w-5 h-5 text-[#4cd7f6] shrink-0" />
              ) : loadingStage === 3 ? (
                <RefreshCw className="w-5 h-5 text-[#ddb7ff] animate-spin shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-white/30 shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Stage 3: Risk Validation</span>
                <span className="text-[11px] text-[#cbc3d7]">Synthesizing severity matrices</span>
              </div>
            </div>

            <div
              className={`flex items-start gap-3 p-4 rounded-xl transition-all ${
                loadingStage >= 4
                  ? "bg-[#252939] border border-[#4cd7f6]/40 shadow-sm opacity-100"
                  : "bg-[#171b2a] opacity-40"
              }`}
            >
              {loadingStage === 4 ? (
                <RefreshCw className="w-5 h-5 text-[#4cd7f6] animate-spin shrink-0" />
              ) : (
                <Clock className="w-5 h-5 text-white/30 shrink-0" />
              )}
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white">Stage 4: MVP Roadmap</span>
                <span className="text-[11px] text-[#cbc3d7]">Prioritizing sprints & build specs</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
