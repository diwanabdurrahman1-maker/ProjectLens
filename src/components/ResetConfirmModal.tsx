import React from "react";
import { AlertTriangle } from "lucide-react";

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#141D38] border border-white/[0.1] shadow-2xl flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ffb4ab]/20 text-[#ffb4ab] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Start New Project?</h3>
            <p className="text-xs text-[#cbc3d7] mt-0.5">
              This will clear your current studio form inputs and active dashboard analysis.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#252939] hover:bg-[#303444] text-[#cbc3d7] hover:text-white text-xs font-semibold border border-white/[0.08] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-[#93000a] hover:bg-[#ba1a1a] text-white text-xs font-bold transition-all shadow-md"
          >
            Start Fresh
          </button>
        </div>
      </div>
    </div>
  );
};
