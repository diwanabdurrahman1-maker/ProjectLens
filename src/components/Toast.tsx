import React from "react";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface ToastProps {
  message: string | null;
  type?: "success" | "alert" | "info";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = "success", onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1e2b52]/90 border border-white/[0.12] text-white shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-in slide-in-from-bottom-5 duration-300">
      {type === "alert" ? (
        <AlertCircle className="w-4 h-4 text-[#ffb4ab] shrink-0" />
      ) : type === "info" ? (
        <Info className="w-4 h-4 text-[#d0bcff] shrink-0" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-[#4cd7f6] shrink-0" />
      )}
      <span className="text-xs font-medium">{message}</span>
    </div>
  );
};
