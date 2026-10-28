import React from "react";
import { X, Sparkles, ExternalLink, ShieldCheck, AlertCircle, Info } from "lucide-react";

interface ApiInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiInfoModal: React.FC<ApiInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-2xl bg-[#141D38] border border-white/[0.1] shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Free-Tier AI Engine Architecture</h3>
              <p className="text-xs text-[#cbc3d7]">Genuinely free Google Gemini integration</p>
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

        <div className="flex flex-col gap-4 text-xs text-[#cbc3d7] leading-relaxed">
          <div className="p-4 rounded-xl bg-[#090e1c]/90 border border-[#06B6D4]/30 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#4cd7f6]" />
              <span>Configured Free-Tier Model: Gemini 2.5 Flash-Lite</span>
            </div>
            <p>
              ProjectLens is engineered to use <strong>Gemini 2.5 Flash-Lite</strong>, Google's lightweight, ultra-fast model provided under Google AI Studio's genuinely free tier.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Free-Tier Quota & Limits</span>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <li className="p-3 rounded-xl bg-[#090e1c] border border-white/[0.06] flex flex-col">
                <span className="text-sm font-bold text-[#4cd7f6] font-mono">15 RPM</span>
                <span className="text-[10px] text-white/50">Requests per minute</span>
              </li>
              <li className="p-3 rounded-xl bg-[#090e1c] border border-white/[0.06] flex flex-col">
                <span className="text-sm font-bold text-[#d0bcff] font-mono">1,000,000</span>
                <span className="text-[10px] text-white/50">Tokens per minute</span>
              </li>
              <li className="p-3 rounded-xl bg-[#090e1c] border border-white/[0.06] flex flex-col">
                <span className="text-sm font-bold text-[#4cd7f6] font-mono">1,500 RPD</span>
                <span className="text-[10px] text-white/50">Requests per day</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#090e1c]/80 border border-white/[0.06] flex flex-col gap-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#d0bcff]" />
              <span>Zero-Billing & Key Security</span>
            </span>
            <p>
              • <strong>No payment card required:</strong> The free tier operates without requiring paid billing to be enabled.
            </p>
            <p>
              • <strong>Server-side only:</strong> Your API key is stored securely in the backend environment (<code>GEMINI_API_KEY</code>) and never exposed to the client or browser bundle.
            </p>
            <p>
              • <strong>Graceful handling:</strong> If you exceed 15 RPM, ProjectLens returns an informative notice with automatic retry instead of breaking.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <a
              href="https://ai.google.dev/gemini-api/docs/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#4cd7f6] hover:underline"
            >
              <span>Official Gemini Pricing & Free Tier Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
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
    </div>
  );
};
