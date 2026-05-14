import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Video, Send, Copy, Check, Info, 
  Layers, Zap, Camera, Wand2, RefreshCcw, X
} from "lucide-react";
import { ai, MODELS } from "../lib/gemini";
import Markdown from "react-markdown";

interface PromptTemplate {
  name: string;
  description: string;
  base: string;
}

const TEMPLATES: PromptTemplate[] = [
  {
    name: "Scientific Visualization",
    description: "High-detail rendering of invisible forces or particle flows.",
    base: "A cinematic macro shot of [TOPIC], showing high-fidelity fluid dynamics and particle interactions. 4k resolution, scientific rendering, clear labels, slow motion."
  },
  {
    name: "Engineering Blueprint",
    description: "Isometric technical view of a complex mechanical system.",
    base: "An isometric 3D technical blueprint of [TOPIC]. The camera pans around the structure showing internal gears and components in high detail. Exploded view style, technical lighting, CAD-like precision."
  },
  {
    name: "Macro Material Study",
    description: "Close-up of material degradation or structural integrity.",
    base: "Extreme close-up of [TOPIC] undergoing stress testing. High-speed camera footage showing micro-fractures, texture changes, and thermal emissions. Photorealistic, 8k, laboratory environment."
  }
];

export function VeoPrompter() {
  const [subject, setSubject] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateVeoPrompt = async () => {
    if (!subject) return;
    setIsGenerating(true);
    setGeneratedPrompt(null);
    try {
      const templateContext = selectedTemplate ? `using the template style: ${selectedTemplate.base}` : "focusing on high-fidelity technical visualization";
      
      const response = await ai.models.generateContent({
        model: MODELS.pro,
        contents: [{
          role: "user",
          parts: [{ text: `Create a highly detailed, professional video generation prompt for Google's Veo. 
          The video subject is: ${subject}. 
          Style requirements: ${templateContext}. 
          The prompt should include camera angles, lighting details, motion descriptions, and technical accuracy. 
          Provide only the final prompt string in a clear format.` }]
        }],
        config: {
          systemInstruction: "You are an expert director of technical and scientific cinematography. Create precise, high-effort prompts for video AI.",
        }
      });
      setGeneratedPrompt(response.text || "Failed to generate prompt.");
    } catch (e) {
      console.error("Veo Prompt Error:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-[2rem] p-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
          <Video size={24} />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg tracking-tight">Veo Technical Prompter</h3>
          <p className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-[0.2em] mt-1">AI-Powered Cinematic Generation Interface</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest px-1">Technical Subject</label>
          <div className="relative">
            <input 
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Electromagnetic flux in a solenoid..."
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-indigo-500/50 transition-all shadow-inner"
            />
            <Zap size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 opacity-30" />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest px-1">Visual Modalities</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => setSelectedTemplate(t)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedTemplate?.name === t.name 
                    ? "bg-indigo-600/10 border-indigo-500 text-white shadow-lg shadow-indigo-900/20" 
                    : "bg-[#161b22] border-[#30363d] text-[#8b949e] hover:border-indigo-500/30 hover:bg-[#1c212a]"
                }`}
              >
                <div className="font-bold text-[10px] uppercase tracking-widest mb-1 flex items-center gap-2">
                  {t.name === "Scientific Visualization" ? <Layers size={14} /> : t.name === "Engineering Blueprint" ? <Camera size={14} /> : <Wand2 size={14} />}
                  {t.name}
                </div>
                <p className="text-[9px] leading-relaxed opacity-60">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={generateVeoPrompt}
          disabled={isGenerating || !subject}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-900/20 flex items-center justify-center gap-2 uppercase text-[11px] tracking-[0.2em]"
        >
          {isGenerating ? <RefreshCcw size={18} className="animate-spin" /> : <Sparkles size={18} />}
          {isGenerating ? "Analyzing Cinematic Physics..." : "Synthesize Veo Prompt"}
        </button>

        <AnimatePresence>
          {generatedPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 bg-indigo-600/5 border border-indigo-500/30 rounded-[2rem] relative group"
            >
              <button 
                onClick={() => setGeneratedPrompt(null)}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl text-indigo-400 transition-colors"
              >
                <X size={16} />
              </button>
              <div className="flex items-center gap-2 text-indigo-400 mb-4">
                <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                <h4 className="text-[10px] font-bold uppercase tracking-widest">Optimized Veo String</h4>
              </div>
              <div className="prose prose-invert prose-xs max-w-none text-indigo-100/80 leading-relaxed font-mono">
                <Markdown>{generatedPrompt}</Markdown>
              </div>
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 py-3 bg-white/5 border border-indigo-500/20 text-indigo-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  {copied ? "Copied to Port" : "Copy to Clipboard"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex gap-3 items-start">
        <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-[#8b949e] leading-relaxed">
          Google Veo is capable of generating consistent 1080p video at 60fps. This prompter uses advanced directorial knowledge to ensure your technical visualizations maintain physical grounding and high aesthetic value.
        </p>
      </div>
    </div>
  );
}
