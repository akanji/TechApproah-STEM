import React, { useState, useRef, useEffect } from "react";
import { ai, MODELS } from "@/src/lib/gemini";
import { Headphones, Upload, Loader2, FileText, CheckCircle2, ChevronRight, Mic, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AudioTranscriber() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setAudioUrl(URL.createObjectURL(selectedFile));
    }
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const mid = canvas.height / 2;
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let x = 0; x < canvas.width; x += 4) {
      const h = Math.random() * (canvas.height * 0.6);
      ctx.moveTo(x, mid - h / 2);
      ctx.lineTo(x, mid + h / 2);
    }
    ctx.stroke();
  };

  React.useEffect(() => {
    if (file) {
      const interval = setInterval(drawWaveform, 100);
      return () => clearInterval(interval);
    }
  }, [file]);

  const processAudio = async () => {
    if (!file || isProcessing) return;
    setIsProcessing(true);
    setTranscript(null);
    setSummary(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(",")[1];
        
        const response = await ai.models.generateContent({
          model: MODELS.flash,
          contents: [
            {
              parts: [
                { inlineData: { data: base64Audio, mimeType: file.type } },
                { text: "Transcribe this audio precisely. Then, provide a concise summary of the key STEM concepts discussed." }
              ]
            }
          ],
          config: {
            // High quality transcription
            temperature: 0, 
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                transcript: { type: "string" },
                summary: { type: "string" }
              },
              required: ["transcript", "summary"]
            }
          }
        });

        const data = JSON.parse(response.text || "{}");
        setTranscript(data.transcript);
        setSummary(data.summary);
      };
    } catch (error) {
      console.error("Transcribe Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
          <Headphones size={20} />
        </div>
        <div>
          <h3 className="text-[#e6edf3] font-bold">Audio Lab</h3>
          <p className="text-[#8b949e] text-xs">Transcribe and analyze study recordings</p>
        </div>
      </div>

      <div className="space-y-4">
        {!file ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="h-40 border-2 border-dashed border-[#30363d] hover:border-emerald-500/30 transition-colors rounded-xl flex flex-col items-center justify-center text-[#484f58] gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload size={20} />
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-medium text-[#c9d1d9]">Drop audio file or click to upload</p>
              <p className="text-xs text-[#8b949e] mt-1">MP3, WAV, AAC (Max 10MB)</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
          </div>
        ) : (
            <div className="space-y-4">
              <div className="bg-[#0b0e14] border border-[#30363d] rounded-2xl p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Mic size={18} className="text-emerald-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-sm font-medium text-[#e6edf3] truncate">{file.name}</p>
                      <p className="text-[10px] text-[#8b949e]">{(file.size / 1024 / 1024).toFixed(2)} MB • Audio Ready</p>
                    </div>
                  </div>
                  <button onClick={() => { setFile(null); setTranscript(null); setAudioUrl(null); }} className="p-2 hover:bg-white/5 rounded-lg text-[#8b949e] hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
                
                <div className="h-16 bg-black/40 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center p-2">
                  <canvas ref={canvasRef} width={400} height={60} className="w-full h-full" />
                </div>

                {audioUrl && (
                  <audio src={audioUrl} controls className="w-full h-10 accent-emerald-500 bg-transparent" />
                )}
              </div>

            <button
              onClick={processAudio}
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing Audio...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Transcribe & Summarize
                </>
              )}
            </button>
          </div>
        )}

        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-2"
            >
              <div className="p-4 bg-[#052616] border border-emerald-500/20 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 text-emerald-500/20">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Concept Summary</h4>
                <p className="text-sm text-emerald-100/90 leading-relaxed">{summary}</p>
              </div>

              <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-xl max-h-60 overflow-y-auto">
                <h4 className="text-xs font-bold text-[#8b949e] uppercase tracking-wider mb-3">Transcript</h4>
                <p className="text-xs text-[#c9d1d9] leading-relaxed italic">"{transcript}"</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
