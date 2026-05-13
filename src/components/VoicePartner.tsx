import React, { useState, useEffect, useRef } from "react";
import { ai, MODELS } from "@/src/lib/gemini";
import { Mic, MicOff, Phone, PhoneOff, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Modality, LiveServerMessage } from "@google/genai";

export function VoicePartner({ onClose }: { onClose: () => void }) {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState<"idle" | "connecting" | "active" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const startSession = async () => {
    try {
      setErrorMessage(null);
      setStatus("connecting");
      
      // Setup Microphone FIRST to ensure we have permission before connecting
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err: any) {
        console.error("Microphone Access Error:", err);
        if (err.name === "NotAllowedError" || err.name === "PermissionDismissedError") {
          setErrorMessage("Microphone permission was denied. Please allow access in browser settings.");
        } else {
          setErrorMessage("Could not access microphone. Please check your connection.");
        }
        setStatus("error");
        return;
      }

      const sessionPromise = ai.live.connect({
        model: MODELS.live,
        callbacks: {
          onopen: () => {
            setStatus("active");
            setIsActive(true);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio) {
              playPCM(base64Audio);
            }
          },
          onerror: (err: any) => {
            console.error("Live API Error:", err);
            setErrorMessage("Gemini Live service is currently unavailable.");
            setStatus("error");
          },
          onclose: () => {
            setStatus("idle");
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: "You are a friendly study partner. Help students by talking through problems in real-time. Keep responses conversational and supportive. You are participating in a voice call."
        }
      });

      sessionPromiseRef.current = sessionPromise;
      const session = await sessionPromise;
      sessionRef.current = session;

      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      // Deprecated but simple for this env, better to use AudioWorklet in production
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      processorRef.current.onaudioprocess = (e) => {
        if (isMuted || status !== "active") return;
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
        }
        
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
        sessionPromise.then((s) => s.sendRealtimeInput({
          audio: { data: base64Data, mimeType: "audio/pcm;rate=16000" }
        }));
      };

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

    } catch (error) {
      console.error("Setup Error:", error);
      setStatus("error");
    }
  };

  const stopSession = () => {
    sessionRef.current?.close();
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    audioContextRef.current?.close();
    setIsActive(false);
    setStatus("idle");
  };

  const playPCM = (base64Data: string) => {
    if (!audioContextRef.current) return;
    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const pcmData = new Int16Array(bytes.buffer);
    const floatData = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) floatData[i] = pcmData[i] / 32768.0;

    const buffer = audioContextRef.current.createBuffer(1, floatData.length, 16000);
    buffer.getChannelData(0).set(floatData);
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
    >
      <div className="w-full max-w-md bg-[#0d1117] border border-[#30363d] rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-blue-600/10 flex items-center justify-center mb-6 relative">
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-blue-500 rounded-full"
                />
              )}
            </AnimatePresence>
            <div className="relative z-10 w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
              <Phone size={32} className={isActive ? "animate-pulse" : ""} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Voice Study Partner</h2>
          <p className={`text-sm mb-8 px-4 ${status === "error" ? "text-red-400 font-medium" : "text-[#8b949e]"}`}>
            {status === "idle" && "Ready to talk? Start a real-time voice session about your studies."}
            {status === "connecting" && "Connecting to Gemini Live..."}
            {status === "active" && "Gemini is listening. Ask anything!"}
            {status === "error" && (errorMessage || "Connection failed. Please try again.")}
          </p>

          <div className="flex gap-4 mb-8">
            {isActive ? (
              <>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isMuted ? "bg-red-500/20 text-red-500" : "bg-[#161b22] text-[#8b949e] hover:bg-[#21262d]"
                  }`}
                >
                  {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>
                <button
                  onClick={stopSession}
                  className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-500 transition-all shadow-lg"
                >
                  <PhoneOff size={24} />
                </button>
              </>
            ) : (
              <button
                onClick={startSession}
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40"
              >
                Start Conversation
              </button>
            )}
          </div>

          <button onClick={onClose} className="text-[#8b949e] hover:text-white text-xs font-medium uppercase tracking-widest">
            Close Panel
          </button>
        </div>
      </div>
    </motion.div>
  );
}
