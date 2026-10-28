import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { IdeaStudio } from "./components/IdeaStudio";
import { Dashboard } from "./components/Dashboard";
import { ApiInfoModal } from "./components/ApiInfoModal";
import { SavedProjectsModal } from "./components/SavedProjectsModal";
import { ResetConfirmModal } from "./components/ResetConfirmModal";
import { Toast } from "./components/Toast";
import { ProjectInput, ProjectAnalysis } from "./types";
import { INITIAL_INPUTS } from "./constants";

export default function App() {
  const [activeView, setActiveView] = useState<"studio" | "dashboard">("studio");
  const [inputs, setInputs] = useState<ProjectInput>({ ...INITIAL_INPUTS });
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);
  const [savedProjects, setSavedProjects] = useState<ProjectAnalysis[]>([]);

  // Loading & Progress states
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  // Modals & Toast
  const [isApiInfoOpen, setIsApiInfoOpen] = useState(false);
  const [isSavedProjectsOpen, setIsSavedProjectsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "alert" | "info">("success");

  // Show Toast helper
  const showToast = (msg: string, type: "success" | "alert" | "info" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Fetch saved projects on mount
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.projects)) {
          setSavedProjects(data.projects);
        }
      })
      .catch((err) => {
        console.warn("Could not load saved projects from backend:", err);
      });
  }, []);

  // Main AI Analysis Handler
  const handleAnalyze = async () => {
    if (!inputs.idea.trim() || !inputs.audience.trim() || !inputs.problem.trim() || !inputs.solutions.trim()) {
      showToast("Please complete all four fields to begin analysis.", "alert");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setErrorCode(null);
    setLoadingProgress(10);
    setLoadingStage(1);

    // Multi-stage visual progression timer
    const stageTimer1 = setTimeout(() => {
      setLoadingProgress(35);
      setLoadingStage(2);
    }, 700);

    const stageTimer2 = setTimeout(() => {
      setLoadingProgress(65);
      setLoadingStage(3);
    }, 1800);

    const stageTimer3 = setTimeout(() => {
      setLoadingProgress(85);
      setLoadingStage(4);
    }, 2900);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw {
          code: result.error || "SERVER_ERROR",
          message: result.message || "Failed to analyze project idea with Gemini AI.",
        };
      }

      setLoadingProgress(100);

      setTimeout(() => {
        setAnalysis(result.data);
        setActiveView("dashboard");
        setIsLoading(false);
        setLoadingStage(0);
        showToast("ProjectLens Blueprint Generated Successfully with Gemini Free Tier!");

        // Refresh saved projects list
        fetch("/api/projects")
          .then((r) => r.json())
          .then((d) => {
            if (d && Array.isArray(d.projects)) setSavedProjects(d.projects);
          });
      }, 500);
    } catch (err: any) {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);
      setIsLoading(false);
      setLoadingStage(0);
      setLoadingProgress(0);
      setErrorMessage(err.message || "An unexpected error occurred while communicating with Gemini API.");
      setErrorCode(err.code || "UNKNOWN_ERROR");
      showToast("Analysis failed. Review error message below.", "alert");
    }
  };

  const handleRefineInStudio = () => {
    setActiveView("studio");
    showToast("Loaded current project details into Idea Studio for refinement.");
  };

  const handleStartNewProject = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    setInputs({ ...INITIAL_INPUTS });
    setAnalysis(null);
    setActiveView("studio");
    setErrorMessage(null);
    showToast("Workspace cleared. Ready for a new project idea!");
  };

  const handleSelectSavedProject = (proj: ProjectAnalysis) => {
    setAnalysis(proj);
    if (proj.inputs) {
      setInputs(proj.inputs);
    }
    setActiveView("dashboard");
    showToast(`Loaded "${proj.title}" blueprint.`);
  };

  const handleDeleteSavedProject = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setSavedProjects((prev) => prev.filter((p) => p.id !== id));
      showToast("Project deleted from saved history.");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete project.", "alert");
    }
  };

  return (
    <div className="min-h-screen bg-[#070B19] text-[#dfe1f6] relative flex flex-col font-['Inter'] selection:bg-[#8B5CF6]/30 selection:text-white overflow-x-hidden">
      {/* Background Spectral Glow Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-[#8B5CF6]/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-[#06B6D4]/10 rounded-full blur-[130px]"></div>
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-[#A855F7]/10 rounded-full blur-[140px]"></div>
      </div>

      {/* Global Header */}
      <Header
        activeView={activeView}
        onSwitchView={setActiveView}
        hasAnalysis={Boolean(analysis)}
        onOpenApiInfo={() => setIsApiInfoOpen(true)}
        onOpenSavedProjects={() => setIsSavedProjectsOpen(true)}
        onResetWorkspace={handleStartNewProject}
        projectName={analysis?.title}
      />

      {/* Main Content View Container */}
      <main className="w-full pt-28 px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
        {activeView === "studio" ? (
          <IdeaStudio
            input={inputs}
            onChangeInput={setInputs}
            onSubmitAnalyze={handleAnalyze}
            isLoading={isLoading}
            loadingStage={loadingStage}
            loadingProgress={loadingProgress}
            errorMessage={errorMessage}
            errorCode={errorCode}
            onClearError={() => {
              setErrorMessage(null);
              setErrorCode(null);
            }}
            onShowToast={showToast}
          />
        ) : analysis ? (
          <Dashboard
            analysis={analysis}
            onAnalyzeAgain={handleAnalyze}
            onRefineInStudio={handleRefineInStudio}
            onStartNewProject={handleStartNewProject}
            onShowToast={showToast}
          />
        ) : (
          <div className="text-center py-20">
            <p className="text-sm text-[#cbc3d7]">No analysis generated yet.</p>
            <button
              onClick={() => setActiveView("studio")}
              className="mt-3 px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-semibold"
            >
              Go to Idea Studio
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#090e1c] border-t border-white/[0.06] py-6 mt-auto">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#958ea0]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">ProjectLens</span>
            <span>— See Your Project Clearly</span>
            <span>• Powered by Google Gemini Free Tier</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsApiInfoOpen(true)}
              className="hover:text-white transition-colors"
            >
              Free Tier Architecture & Pricing
            </button>
            <span>•</span>
            <span className="text-[#4cd7f6]">Autonomous Heuristic Engine v2.5</span>
          </div>
        </div>
      </footer>

      {/* Modals and Toasts */}
      <ApiInfoModal isOpen={isApiInfoOpen} onClose={() => setIsApiInfoOpen(false)} />

      <SavedProjectsModal
        isOpen={isSavedProjectsOpen}
        onClose={() => setIsSavedProjectsOpen(false)}
        savedProjects={savedProjects}
        onSelectProject={handleSelectSavedProject}
        onDeleteProject={handleDeleteSavedProject}
      />

      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
      />

      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
    </div>
  );
}
