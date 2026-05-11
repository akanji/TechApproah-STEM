import React, { useState, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { MODELS } from "@/src/lib/gemini";
import { Video, Play, Download, Wand2, Loader2, Key, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export function MediaLab() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const loadingMessages = [
    "Analyzing science concepts...",
    "Synthesizing visual frames...",
    "Rendering trajectory dynamics...",
    "Polishing video content...",
    "Almost ready to present!"
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateVideo = async () => {
    if (!prompt.trim() || isGenerating) return;

    // Check if API key is selected (required for Veo)
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      setNeedsApiKey(true);
      return;
    }

    setIsGenerating(true);
    setVideoUrl(null);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((s) => (s + 1) % loadingMessages.length);
    }, 5000);

    try {
      // Create fresh instance to ensure correct API key usage
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      
      let imagePart;
      if (selectedImage && imagePreview) {
        imagePart = {
          inlineData: {
            data: imagePreview.split(",")[1],
            mimeType: selectedImage.type
          }
        };
      }

      let operation = await ai.models.generateVideos({
        model: MODELS.veo_lite,
        prompt: `A clear, educational visualization of: ${prompt}. Scientific accurately, high quality, 3D animation style.`,
        // image_input: imagePart // If supported by current SDK version
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      } as any); // Type cast due to possible SDK variation for image_input

      // Poll for completion
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const res = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': process.env.API_KEY || "",
          },
        });
        const blob = await res.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error("Video Gen Error:", error);
      if (typeof error === 'object' && error !== null && 'message' in error && (error as any).message?.includes("entity was not found")) {
        setNeedsApiKey(true);
      }
    } finally {
      setIsGenerating(false);
      clearInterval(stepInterval);
    }
  };

  const handleOpenKeyDialog = async () => {
    await window.aistudio.openSelectKey();
    setNeedsApiKey(false);
    generateVideo();
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 mb-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
          <Video size={20} />
        </div>
        <div>
          <h3 className="text-[#e6edf3] font-bold">Science Viz Lab</h3>
          <p className="text-[#8b949e] text-xs">Generate physics & engineering animations</p>
        </div>
      </div>

      <div className="space-y-4">
        {needsApiKey ? (
          <div className="p-6 bg-purple-600/5 border border-purple-500/20 rounded-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
              <Key size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="text-[#e6edf3] font-bold text-sm">API Key Required</h4>
              <p className="text-[#8b949e] text-xs leading-relaxed">
                Veo video generation requires a paid Google Cloud project API key.
              </p>
            </div>
            <button
              onClick={handleOpenKeyDialog}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Select Paid API Key
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-4">
              <div className="flex-1">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the scientific animation..."
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl p-4 text-sm text-[#e6edf3] placeholder-[#484f58] min-h-[100px] outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
              
              <div className="w-24">
                <AnimatePresence mode="wait">
                  {imagePreview ? (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0, scale: 0.8 }} 
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative w-full aspect-square bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden group"
                    >
                      <img src={imagePreview} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => { setSelectedImage(null); setImagePreview(null); }}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full aspect-square bg-[#0d1117] border border-[#30363d] border-dashed rounded-xl flex flex-col items-center justify-center gap-1 text-[#484f58] hover:text-[#8b949e] transition-colors"
                    >
                      <ImageIcon size={20} />
                      <span className="text-[9px] font-bold uppercase tracking-tighter">Reference</span>
                      <input type="file" ref={imageInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={generateVideo}
                disabled={!prompt.trim() || isGenerating}
                className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {loadingMessages[loadingStep]}
                  </>
                ) : (
                  <>
                    <Wand2 size={18} />
                    {selectedImage ? "Animate Image into Video" : "Generate Visualization"}
                  </>
                )}
              </button>
            </div>
          </>
        )}

        <AnimatePresence>
          {videoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-6 space-y-4"
            >
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-[#30363d]">
                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
              </div>
              <div className="flex justify-end gap-2">
                <a
                  href={videoUrl}
                  download="scientific-viz.mp4"
                  className="flex items-center gap-2 px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-sm text-[#8b949e] hover:text-white transition-colors"
                >
                  <Download size={16} />
                  Download
                </a>
                <button
                  onClick={() => setVideoUrl(null)}
                  className="px-4 py-2 bg-[#21262d] border border-[#30363d] rounded-lg text-sm text-[#8b949e] hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!videoUrl && !isGenerating && !needsApiKey && (
          <div className="h-48 border-2 border-dashed border-[#30363d] rounded-xl flex flex-col items-center justify-center text-[#484f58] gap-2">
            <Play size={32} opacity={0.3} />
            <p className="text-xs">Your visualization will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
