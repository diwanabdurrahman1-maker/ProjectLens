import React from "react";
import { X, History, Trash2, ArrowRight, Calendar, Sparkles } from "lucide-react";
import { ProjectAnalysis } from "../types";

interface SavedProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProjects: ProjectAnalysis[];
  onSelectProject: (project: ProjectAnalysis) => void;
  onDeleteProject: (id: string) => void;
}

export const SavedProjectsModal: React.FC<SavedProjectsModalProps> = ({
  isOpen,
  onClose,
  savedProjects,
  onSelectProject,
  onDeleteProject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-2xl bg-[#141D38] border border-white/[0.1] shadow-2xl flex flex-col gap-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Saved Project Blueprints</h3>
              <p className="text-xs text-[#cbc3d7]">
                {savedProjects.length} {savedProjects.length === 1 ? "project" : "projects"} stored persistently
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedProjects.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#090e1c]/80 border border-white/[0.06] flex flex-col items-center justify-center text-center gap-3">
            <Sparkles className="w-8 h-8 text-[#d0bcff]/40" />
            <p className="text-sm font-semibold text-white">No saved projects yet</p>
            <p className="text-xs text-[#cbc3d7] max-w-xs">
              When you analyze a project idea, it is saved persistently to your workspace history here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {savedProjects.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-[#090e1c]/90 border border-white/[0.08] hover:border-[#8B5CF6]/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex flex-col gap-1 max-w-md">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white group-hover:text-[#4cd7f6] transition-colors">
                      {p.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#8B5CF6]/20 text-[#d0bcff] font-semibold">
                      Score: {p.clarityScore}
                    </span>
                  </div>
                  <p className="text-xs text-[#cbc3d7] line-clamp-1">{p.inputs?.idea || p.tagline}</p>
                  <span className="text-[10px] text-white/40 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectProject(p);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252939] hover:bg-[#303444] text-white text-xs font-semibold border border-white/[0.08] transition-all"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3 h-3 text-[#4cd7f6]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteProject(p.id)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-[#ffb4ab] hover:bg-white/[0.06] transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#252939] hover:bg-[#303444] text-white text-xs font-semibold border border-white/[0.08] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
