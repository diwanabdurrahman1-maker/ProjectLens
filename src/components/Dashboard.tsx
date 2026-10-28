import React, { useState } from "react";
import {
  Sparkles,
  LayoutDashboard,
  Compass,
  CheckCircle,
  TrendingUp,
  Cpu,
  FileText,
  RefreshCw,
  Edit,
  PlusCircle,
  Copy,
  Download,
  AlertTriangle,
  ExternalLink,
  Target,
  Zap,
  Layers,
  HelpCircle,
  ShieldAlert,
  Calendar,
  CheckSquare,
  Square
} from "lucide-react";
import { ProjectAnalysis } from "../types";

interface DashboardProps {
  analysis: ProjectAnalysis;
  onAnalyzeAgain: () => void;
  onRefineInStudio: () => void;
  onStartNewProject: () => void;
  onShowToast: (msg: string, type?: "success" | "alert" | "info") => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  analysis,
  onAnalyzeAgain,
  onRefineInStudio,
  onStartNewProject,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "research" | "validate" | "improve" | "build" | "plan">("overview");
  const [checklist, setChecklist] = useState(analysis.build.immediate72HourChecklist || []);

  const toggleChecklistItem = (index: number) => {
    const updated = [...checklist];
    updated[index].done = !updated[index].done;
    setChecklist(updated);
    onShowToast(updated[index].done ? "Task marked completed" : "Task marked incomplete");
  };

  const copyMarkdown = () => {
    const text = analysis.finalProjectPlan.markdownSpecification || "";
    navigator.clipboard.writeText(text).then(
      () => onShowToast("Markdown Specification copied to clipboard!"),
      () => onShowToast("Failed to copy to clipboard", "alert")
    );
  };

  const exportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    const safeTitle = (analysis.title || "projectlens-plan").toLowerCase().replace(/[^a-z0-9]/g, "-");
    downloadAnchor.setAttribute("download", `${safeTitle}-blueprint.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast("Exported complete project analysis as JSON");
  };

  // Radar polygon points based on real analysis numbers
  const radar = analysis.radarScores || { demand: 90, techEase: 80, defensibility: 85, velocity: 88 };
  // Center is (50, 50), max radius 38
  const rTop = 50 - (radar.demand / 100) * 38;
  const rRight = 50 + (radar.techEase / 100) * 38;
  const rBottom = 50 + (radar.defensibility / 100) * 38;
  const rLeft = 50 - (radar.velocity / 100) * 38;
  const radarPoints = `50,${rTop} ${rRight},50 50,${rBottom} ${rLeft},50`;

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-6 pb-24">
      {/* Top Management Bar: Project Meta & Quick Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141D38]/70 border border-white/[0.08] backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] text-white flex items-center justify-center font-extrabold text-lg shadow-[0_0_15px_rgba(139,92,246,0.4)] shrink-0">
            PL
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {analysis.title}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#06B6D4]/15 text-[#4cd7f6] text-xs font-semibold border border-[#06B6D4]/30">
                Viability: {analysis.clarityScore}/100
              </span>
            </div>
            <p className="text-xs text-[#cbc3d7] mt-0.5">
              {analysis.tagline || "Generated with ProjectLens Autonomous AI Intelligence"}
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={onAnalyzeAgain}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#252939] hover:bg-[#303444] text-[#dfe1f6] hover:text-white text-xs font-semibold border border-white/[0.08] transition-all"
            title="Run analysis again with current inputs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#4cd7f6]" />
            <span>Analyze Again</span>
          </button>

          <button
            type="button"
            onClick={onRefineInStudio}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#252939] hover:bg-[#303444] text-[#dfe1f6] hover:text-white text-xs font-semibold border border-white/[0.08] transition-all"
            title="Edit input fields in Idea Studio"
          >
            <Edit className="w-3.5 h-3.5 text-[#d0bcff]" />
            <span>Refine Project</span>
          </button>

          <button
            type="button"
            onClick={onStartNewProject}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#93000a]/30 hover:bg-[#93000a]/50 text-[#ffb4ab] text-xs font-semibold border border-[#ffb4ab]/20 transition-all"
            title="Clear and start a new project from scratch"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* 6-Tab Section Navigation Bar */}
      <div className="w-full overflow-x-auto pb-1 scrollbar-none">
        <nav className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#090e1c]/90 border border-white/[0.08] min-w-[760px]">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-[#252939] text-white shadow-[0_0_12px_rgba(208,188,255,0.2)] border border-white/[0.1]"
                : "text-[#cbc3d7] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#d0bcff]" />
            <span>1. Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("research")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "research"
                ? "bg-[#252939] text-white shadow-[0_0_12px_rgba(76,215,246,0.2)] border border-white/[0.1]"
                : "text-[#cbc3d7] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Compass className="w-4 h-4 text-[#4cd7f6]" />
            <span>2. Research & Market</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("validate")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "validate"
                ? "bg-[#252939] text-white shadow-[0_0_12px_rgba(208,188,255,0.2)] border border-white/[0.1]"
                : "text-[#cbc3d7] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <CheckCircle className="w-4 h-4 text-[#d0bcff]" />
            <span>3. Risk & Validation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("improve")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "improve"
                ? "bg-[#252939] text-white shadow-[0_0_12px_rgba(76,215,246,0.2)] border border-white/[0.1]"
                : "text-[#cbc3d7] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#4cd7f6]" />
            <span>4. Improve & Differentiate</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("build")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "build"
                ? "bg-[#252939] text-white shadow-[0_0_12px_rgba(208,188,255,0.2)] border border-white/[0.1]"
                : "text-[#cbc3d7] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <Cpu className="w-4 h-4 text-[#d0bcff]" />
            <span>5. Build & MVP Roadmap</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("plan")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "plan"
                ? "bg-[#252939] text-white shadow-[0_0_12px_rgba(76,215,246,0.2)] border border-white/[0.1]"
                : "text-[#cbc3d7] hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            <FileText className="w-4 h-4 text-[#4cd7f6]" />
            <span>6. Final Plan & Export</span>
          </button>
        </nav>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: OVERVIEW                                                */}
      {/* ============================================================== */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Scorecards Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Clarity Score */}
            <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#cbc3d7]">Clarity Score</span>
                <Sparkles className="w-4 h-4 text-[#4cd7f6]" />
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white font-mono">{analysis.clarityScore}</span>
                <span className="text-xs text-[#958ea0]">/ 100</span>
              </div>
              <div className="w-full bg-[#090e1c] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, analysis.clarityScore)}%` }}
                ></div>
              </div>
              <span className="text-[11px] text-[#4cd7f6] mt-2">Problem-solution alignment indicator</span>
            </div>

            {/* Card 2: Feasibility Index */}
            <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#cbc3d7]">Feasibility Index</span>
                <Layers className="w-4 h-4 text-[#d0bcff]" />
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white font-mono">{analysis.feasibilityIndex}</span>
                <span className="text-xs text-[#958ea0]">% Tier A</span>
              </div>
              <div className="w-full bg-[#090e1c] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#d0bcff] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, analysis.feasibilityIndex)}%` }}
                ></div>
              </div>
              <span className="text-[11px] text-[#d0bcff] mt-2">Technical & market executability</span>
            </div>

            {/* Card 3: Implementation Risk */}
            <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#cbc3d7]">Implementation Risk</span>
                <ShieldAlert className="w-4 h-4 text-[#ddb7ff]" />
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white font-mono">{analysis.riskRating}</span>
                <span className="text-xs text-[#958ea0]">Controlled</span>
              </div>
              <div className="w-full bg-[#090e1c] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    analysis.riskRating.toLowerCase().includes("high")
                      ? "bg-[#ffb4ab] w-4/5"
                      : analysis.riskRating.toLowerCase().includes("low")
                      ? "bg-[#4cd7f6] w-1/4"
                      : "bg-[#b76dff] w-1/2"
                  }`}
                ></div>
              </div>
              <span className="text-[11px] text-[#cbc3d7] mt-2">Manageable with phased validation</span>
            </div>

            {/* Card 4: Speed to MVP */}
            <div className="flex flex-col justify-between p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#cbc3d7]">Sprint Velocity</span>
                <Zap className="w-4 h-4 text-[#4cd7f6]" />
              </div>
              <div className="my-4 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white font-mono">{analysis.estimatedWeeksToAlpha}</span>
                <span className="text-xs text-[#958ea0]">Weeks to Alpha</span>
              </div>
              <div className="w-full bg-[#090e1c] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#4cd7f6] h-full rounded-full transition-all duration-500"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <span className="text-[11px] text-[#4cd7f6] mt-2">4 modular development sprints</span>
            </div>
          </div>

          {/* Executive Summary & Radar Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Executive Synthesis */}
            <div className="lg:col-span-2 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-lg">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#d0bcff]" />
                  <h3 className="text-lg font-bold text-white">Executive Strategic Synthesis</h3>
                </div>
                <p className="text-sm sm:text-base text-[#cbc3d7] leading-relaxed">
                  {analysis.executiveSummary}
                </p>
              </div>

              {/* 3 Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/[0.08]">
                <div className="p-4 rounded-xl bg-[#090e1c]/80 border border-white/[0.06]">
                  <span className="text-xs font-bold text-[#d0bcff] uppercase tracking-wider">Primary Advantage</span>
                  <p className="text-xs text-white/90 mt-1 leading-relaxed">
                    {analysis.strategicPillars?.primaryAdvantage || "Direct algorithmic automation of fragmented manual steps."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1c]/80 border border-white/[0.06]">
                  <span className="text-xs font-bold text-[#4cd7f6] uppercase tracking-wider">Targeted Beachhead</span>
                  <p className="text-xs text-white/90 mt-1 leading-relaxed">
                    {analysis.strategicPillars?.targetAudiencePillar || "High-intent users suffering from daily cognitive overload."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#090e1c]/80 border border-white/[0.06]">
                  <span className="text-xs font-bold text-[#ddb7ff] uppercase tracking-wider">Monetization Path</span>
                  <p className="text-xs text-white/90 mt-1 leading-relaxed">
                    {analysis.strategicPillars?.monetizationPath || "Freemium core with paid power-user features and team/institution licensing."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Radar Matrix Visual */}
            <div className="flex flex-col items-center justify-between p-6 sm:p-8 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-lg">
              <div className="w-full flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Viability Radar Matrix</span>
                <span className="text-[10px] text-[#4cd7f6] font-mono px-2 py-0.5 rounded bg-[#06B6D4]/10 border border-[#06B6D4]/20">
                  AI Grounded
                </span>
              </div>

              {/* SVG Radar Visual */}
              <div className="relative w-48 h-48 my-2 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Outer & Inner Guide Rings */}
                  <polygon
                    points="50,12 88,50 50,88 12,50"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                  />
                  <polygon
                    points="50,25 75,50 50,75 25,50"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeWidth="1"
                  />
                  <line x1="50" y1="12" x2="50" y2="88" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
                  <line x1="12" y1="50" x2="88" y2="50" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
                  {/* Dynamic Radar Score Polygon */}
                  <polygon
                    points={radarPoints}
                    fill="rgba(139, 92, 246, 0.25)"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase font-bold text-white/50">Overall</span>
                  <span className="text-2xl font-black text-[#4cd7f6]">
                    {analysis.clarityScore >= 90 ? "A+" : analysis.clarityScore >= 80 ? "A" : "B+"}
                  </span>
                </div>
              </div>

              {/* Radar Metrics Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full text-xs text-[#cbc3d7] pt-2 border-t border-white/[0.06]">
                <div className="flex justify-between">
                  <span>Demand:</span> <b className="text-white font-mono">{radar.demand}%</b>
                </div>
                <div className="flex justify-between">
                  <span>Tech Ease:</span> <b className="text-white font-mono">{radar.techEase}%</b>
                </div>
                <div className="flex justify-between">
                  <span>Moat:</span> <b className="text-white font-mono">{radar.defensibility}%</b>
                </div>
                <div className="flex justify-between">
                  <span>Speed:</span> <b className="text-white font-mono">{radar.velocity}%</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: RESEARCH & MARKET                                       */}
      {/* ============================================================== */}
      {activeTab === "research" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Target Personas Grid */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-[#4cd7f6]" />
              <span>Target User Cohorts & Profiles</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(analysis.research.personas || []).map((p, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md flex flex-col justify-between gap-4 shadow-md"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/20 text-[#d0bcff] flex items-center justify-center font-bold text-xs border border-[#8B5CF6]/30">
                        {p.id || `P${idx + 1}`}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{p.title}</h4>
                        <span className="text-[11px] text-[#4cd7f6]">{p.demographics}</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#cbc3d7] leading-relaxed">{p.description}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090e1c]/80 border border-white/[0.06] text-xs text-white/90">
                    <b className="text-[#ffb4ab]">Core Friction: </b>
                    <span>{p.coreFriction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor Analysis Table */}
          <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#4cd7f6]" />
                <h3 className="text-base font-bold text-white">Competitive Landscape & Gap Analysis</h3>
              </div>
              <span className="text-xs text-[#cbc3d7]">Evaluation of current market workarounds</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white">
                <thead className="bg-[#090e1c] text-[11px] uppercase tracking-wider text-[#cbc3d7] border-b border-white/[0.08]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Solution Class / Existing Tool</th>
                    <th className="p-3">Core Strengths</th>
                    <th className="p-3">Critical Weaknesses</th>
                    <th className="p-3 rounded-r-xl">ProjectLens Opportunity Gap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {(analysis.research.competitorAnalysis || []).map((comp, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-semibold text-[#d0bcff]">{comp.solutionClass}</td>
                      <td className="p-3 text-[#cbc3d7]">{comp.coreStrengths}</td>
                      <td className="p-3 text-[#cbc3d7]">{comp.criticalWeaknesses}</td>
                      <td className="p-3 text-[#4cd7f6] font-medium">{comp.opportunityGap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5 Critical Research Questions & Domain Authority Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 5 Research Inquiries */}
            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#d0bcff]" />
                <span>5 Critical Market Research Inquiries</span>
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs text-[#cbc3d7]">
                {(analysis.research.marketResearchQuestions || []).map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white/[0.02]">
                    <span className="text-[#d0bcff] font-bold font-mono">{idx + 1}.</span>
                    <span className="leading-relaxed">{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verified Domain Repositories */}
            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-[#4cd7f6]" />
                <span>Verified Domain Repositories & Data Sources</span>
              </h4>
              <div className="flex flex-col gap-2.5 text-xs text-[#cbc3d7]">
                {(analysis.research.domainAuthoritySources || []).map((src, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#090e1c]/80 border border-white/[0.06] flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{src.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.08] text-[#4cd7f6] font-mono">
                        {src.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#cbc3d7]">{src.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: RISK & VALIDATION                                       */}
      {/* ============================================================== */}
      {activeTab === "validate" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Validation Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md flex flex-col gap-2 shadow-md">
              <span className="text-xs text-[#cbc3d7] uppercase font-semibold">Problem Clarity</span>
              <div className="text-2xl font-extrabold text-[#4cd7f6]">
                {analysis.validate.problemClarity.status}
              </div>
              <p className="text-xs text-[#cbc3d7] mt-1 leading-relaxed">
                {analysis.validate.problemClarity.explanation}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md flex flex-col gap-2 shadow-md">
              <span className="text-xs text-[#cbc3d7] uppercase font-semibold">Willingness to Pay</span>
              <div className="text-2xl font-extrabold text-[#d0bcff]">
                {analysis.validate.willingnessToPay.assessment}
              </div>
              <p className="text-xs text-[#cbc3d7] mt-1 leading-relaxed">
                {analysis.validate.willingnessToPay.pricingModel}: {analysis.validate.willingnessToPay.details}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md flex flex-col gap-2 shadow-md">
              <span className="text-xs text-[#cbc3d7] uppercase font-semibold">Core Risk Vector</span>
              <div className="text-2xl font-extrabold text-[#ffb4ab]">
                {analysis.validate.prioritizedRisks?.[0]?.title || "User Retention / Habit Loop"}
              </div>
              <p className="text-xs text-[#cbc3d7] mt-1 leading-relaxed">
                Requires early verification through targeted lightweight prototypes.
              </p>
            </div>
          </div>

          {/* Prioritized Risk Assessment Matrix */}
          <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#ffb4ab]" />
                <span>Prioritized Risk & Vulnerability Matrix</span>
              </h3>
              <span className="text-xs text-[#cbc3d7]">Severity × Probability Heuristic</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {(analysis.validate.prioritizedRisks || []).map((risk, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-xl bg-[#090e1c]/80 flex flex-col justify-between gap-3 border-l-4 ${
                    idx === 0 ? "border-[#ffb4ab]" : idx === 1 ? "border-[#A855F7]" : "border-[#4cd7f6]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#ffb4ab] uppercase">{risk.tier}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-white/[0.08] text-white/80 font-mono">
                        Sev: {risk.severity} / Lik: {risk.likelihood}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-2">{risk.title}</h4>
                    <p className="text-xs text-[#cbc3d7] mt-1 leading-relaxed">{risk.description}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.04] text-xs text-white">
                    <b className="text-[#4cd7f6]">Mitigation: </b>
                    <span>{risk.mitigation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4 Concrete Validation Smoke Tests */}
          <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#4cd7f6]" />
              <span>4 Empirical Validation Experiments to Run Immediately</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(analysis.validate.smokeTestExperiments || []).map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#090e1c]/80 border border-white/[0.06] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#d0bcff]">{exp.title}</span>
                    <span className="text-[11px] text-[#4cd7f6] font-mono">{exp.costDuration}</span>
                  </div>
                  <p className="text-xs text-[#cbc3d7] leading-relaxed">{exp.description}</p>
                  <div className="text-xs text-white font-medium pt-1">
                    <b className="text-[#4cd7f6]">Success Criterion: </b>
                    <span>{exp.successCriterion}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: IMPROVE & DIFFERENTIATE                                 */}
      {/* ============================================================== */}
      {activeTab === "improve" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weak Points & Vulnerabilities */}
            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#ffb4ab]" />
                <span>Identified Concept Vulnerabilities & Pitfalls</span>
              </h3>
              <div className="flex flex-col gap-3">
                {(analysis.improve.vulnerabilities || []).map((v, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#090e1c]/80 border border-white/[0.06] flex flex-col gap-1">
                    <span className="text-xs font-bold text-[#ffb4ab]">{idx + 1}. {v.title}</span>
                    <p className="text-xs text-[#cbc3d7] leading-relaxed">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* High Impact Differentiation Opportunities */}
            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#4cd7f6]" />
                <span>High-Impact Differentiation Features & Moats</span>
              </h3>
              <div className="flex flex-col gap-3">
                {(analysis.improve.differentiationOpportunities || []).map((diff, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#090e1c]/80 border border-white/[0.06] flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#4cd7f6]">{idx + 1}. {diff.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#06B6D4]/15 text-[#4cd7f6] font-mono">
                        Moat Factor: {diff.moatFactor}
                      </span>
                    </div>
                    <p className="text-xs text-[#cbc3d7] leading-relaxed">{diff.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Specific Recommendations */}
          <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d0bcff]" />
              <span>Specific Strategic Recommendations</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#cbc3d7]">
              {(analysis.improve.specificRecommendations || []).map((rec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#090e1c]/80 border border-white/[0.06] flex items-start gap-2.5">
                  <span className="text-[#d0bcff] font-bold font-mono">#{idx + 1}</span>
                  <span className="leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: BUILD & MVP ROADMAP                                     */}
      {/* ============================================================== */}
      {activeTab === "build" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Phased MVP Feature Prioritization */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Must-Have */}
            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#8B5CF6]/20 text-[#d0bcff] border border-[#8B5CF6]/30">
                  Must-Have (MVP v1.0)
                </span>
                <span className="text-xs text-[#cbc3d7]">Sprint 1-2</span>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs text-white">
                {(analysis.build.mvpFeatures?.mustHave || []).map((f, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-[#090e1c]/80 border border-white/[0.06] flex flex-col gap-1">
                    <span className="font-semibold text-white">{f.title}</span>
                    <span className="text-[11px] text-[#cbc3d7]">{f.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Should-Have */}
            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#06B6D4]/20 text-[#4cd7f6] border border-[#06B6D4]/30">
                  Should-Have (v1.1)
                </span>
                <span className="text-xs text-[#cbc3d7]">Sprint 3</span>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs text-white">
                {(analysis.build.mvpFeatures?.shouldHave || []).map((f, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-[#090e1c]/80 border border-white/[0.06] flex flex-col gap-1">
                    <span className="font-semibold text-white">{f.title}</span>
                    <span className="text-[11px] text-[#cbc3d7]">{f.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nice-to-Have */}
            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/[0.08] text-[#cbc3d7] border border-white/[0.1]">
                  Nice-to-Have (v2.0)
                </span>
                <span className="text-xs text-[#cbc3d7]">Sprint 4+</span>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs text-white">
                {(analysis.build.mvpFeatures?.niceToHave || []).map((f, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-[#090e1c]/80 border border-white/[0.06] flex flex-col gap-1">
                    <span className="font-semibold text-white">{f.title}</span>
                    <span className="text-[11px] text-[#cbc3d7]">{f.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sprint Milestones & Technical Architecture */}
          <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#d0bcff]" />
              <span>Step-by-Step Sprint Milestones Roadmap</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {(analysis.build.sprintRoadmap || []).map((sprint, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#090e1c]/80 border border-white/[0.06] flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-[#4cd7f6] font-bold">
                    {sprint.sprint} • {sprint.timeRange}
                  </span>
                  <h5 className="text-xs font-bold text-white">{sprint.title}</h5>
                  <p className="text-[11px] text-[#cbc3d7] leading-relaxed">{sprint.description}</p>
                  {sprint.keyDeliverables && (
                    <div className="mt-2 pt-2 border-t border-white/[0.06] flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-white/40">Key Deliverables:</span>
                      {sprint.keyDeliverables.map((del, dIdx) => (
                        <span key={dIdx} className="text-[11px] text-white/80 flex items-center gap-1.5">
                          • {del}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Tech Stack Badges */}
          {analysis.build.suggestedTechStack && (
            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#4cd7f6]" />
                <span>Recommended Architectural Stack</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#090e1c]/80 border border-white/[0.06]">
                  <span className="text-[10px] text-[#cbc3d7] uppercase font-semibold">Frontend</span>
                  <p className="text-white font-medium mt-0.5">{analysis.build.suggestedTechStack.frontend}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#090e1c]/80 border border-white/[0.06]">
                  <span className="text-[10px] text-[#cbc3d7] uppercase font-semibold">Backend</span>
                  <p className="text-white font-medium mt-0.5">{analysis.build.suggestedTechStack.backend}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#090e1c]/80 border border-white/[0.06]">
                  <span className="text-[10px] text-[#cbc3d7] uppercase font-semibold">Database</span>
                  <p className="text-white font-medium mt-0.5">{analysis.build.suggestedTechStack.database}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#090e1c]/80 border border-white/[0.06]">
                  <span className="text-[10px] text-[#cbc3d7] uppercase font-semibold">AI Services</span>
                  <p className="text-white font-medium mt-0.5">{analysis.build.suggestedTechStack.aiServices}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#090e1c]/80 border border-white/[0.06]">
                  <span className="text-[10px] text-[#cbc3d7] uppercase font-semibold">Auth & Storage</span>
                  <p className="text-white font-medium mt-0.5">{analysis.build.suggestedTechStack.auth}</p>
                </div>
              </div>
            </div>
          )}

          {/* Immediate 72-Hour Execution Checklist */}
          <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col gap-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#4cd7f6]" />
              <span>Immediate 72-Hour Execution Checklist</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleChecklistItem(idx)}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#090e1c]/80 border border-white/[0.06] cursor-pointer hover:bg-white/[0.04] transition-colors select-none"
                >
                  {item.done ? (
                    <CheckSquare className="w-4 h-4 text-[#4cd7f6] shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-white/40 shrink-0" />
                  )}
                  <span className={item.done ? "line-through text-white/40" : "text-white/90"}>
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 6: FINAL PROJECT PLAN & EXPORT                             */}
      {/* ============================================================== */}
      {activeTab === "plan" && (
        <div className="flex flex-col gap-6 animate-in fade-in duration-200">
          {/* Action Header */}
          <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Project Specification & Hand-Off Plan</h3>
              <p className="text-xs text-[#cbc3d7] mt-0.5">
                Full compiled architectural and strategic plan ready for engineering hand-off or investment memos.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={copyMarkdown}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#252939] hover:bg-[#303444] text-white text-xs font-semibold border border-white/[0.08] transition-all shadow-sm"
              >
                <Copy className="w-3.5 h-3.5 text-[#4cd7f6]" />
                <span>Copy as Markdown</span>
              </button>
              <button
                type="button"
                onClick={exportJson}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white text-xs font-semibold transition-all hover:brightness-110 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Structured Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md flex flex-col gap-2">
              <span className="text-xs font-bold text-[#d0bcff] uppercase">Problem Statement</span>
              <p className="text-xs text-[#cbc3d7] leading-relaxed">
                {analysis.finalProjectPlan.problemStatement}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md flex flex-col gap-2">
              <span className="text-xs font-bold text-[#4cd7f6] uppercase">Target Audience</span>
              <p className="text-xs text-[#cbc3d7] leading-relaxed">
                {analysis.finalProjectPlan.targetAudience}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md flex flex-col gap-2">
              <span className="text-xs font-bold text-[#ddb7ff] uppercase">Proposed Solution</span>
              <p className="text-xs text-[#cbc3d7] leading-relaxed">
                {analysis.finalProjectPlan.proposedSolution}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141D38]/60 border border-white/[0.08] backdrop-blur-md flex flex-col gap-2">
              <span className="text-xs font-bold text-[#4cd7f6] uppercase">MVP Scope</span>
              <p className="text-xs text-[#cbc3d7] leading-relaxed">
                {analysis.finalProjectPlan.mvpScope}
              </p>
            </div>
          </div>

          {/* Raw Plan Markdown Preview */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#090e1c] border border-white/[0.08] font-mono text-xs leading-relaxed text-[#dfe1f6]/90 overflow-x-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08] text-[11px] text-[#958ea0]">
              <span>MARKDOWN PLAN PREVIEW</span>
              <span>UTF-8 • Generated with Gemini 2.5 Flash-Lite</span>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[12px] text-[#dfe1f6] select-all">
              {analysis.finalProjectPlan.markdownSpecification}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
