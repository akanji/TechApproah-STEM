import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, Database, Globe, Cpu, ChevronLeft, Info } from 'lucide-react';
import { useUser } from './UserContext';

export function PrivacyPolicy() {
  const { setPage } = useUser();

  return (
    <div className="space-y-8 pb-32">
      <header className="flex items-center gap-4">
        <button 
          onClick={() => setPage('home')}
          className="p-2 rounded-xl bg-[#161b22] border border-[#30363d] text-[#8b949e] hover:text-white transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase">Privacy Policy</h2>
          <p className="text-[#8b949e] text-xs font-mono uppercase tracking-widest">Protocol Version 1.0.4 • TechApproach Core</p>
          <p className="text-[9px] text-[#484f58] uppercase font-bold mt-1">Last Updated: May 14, 2026</p>
        </div>
      </header>

      <section className="bg-[#161b22] border border-[#30363d] rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3 text-blue-400 mb-2">
          <Shield size={24} />
          <h3 className="text-lg font-bold uppercase tracking-tight">Our Commitment</h3>
        </div>
        <p className="text-sm text-[#c9d1d9] leading-relaxed">
          At TechApproach, we prioritize the integrity of your scientific research and personal data. This policy outlines how we handle information across our virtual labs, AI specialist engines, and cloud synchronization services.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Collection */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-emerald-400">
            <Database size={20} />
            <h4 className="text-sm font-bold uppercase tracking-wider">Data Collection</h4>
          </div>
          <ul className="space-y-3 text-xs text-[#8b949e]">
            <li className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <span><strong>Identity:</strong> Google Auth provided email, name, and profile picture for account personalization.</span>
            </li>
            <li className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <span><strong>Research Progress:</strong> XP points, completed modules, and automated AI study notes generated during resource interaction ({">"}30s).</span>
            </li>
            <li className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
              <span><strong>Laboratory Data:</strong> Simulation parameters, circuit configurations, and materials selection history.</span>
            </li>
          </ul>
        </div>

        {/* AI Processing */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-3 text-purple-400">
            <Cpu size={20} />
            <h4 className="text-sm font-bold uppercase tracking-wider">AI Integration</h4>
          </div>
          <p className="text-[11px] text-[#8b949e] leading-relaxed">
            Your laboratory queries and Thinking Chat interactions are processed by <strong>Google Gemini</strong> models. This includes automated note synthesis in the ResourceHub and <strong>Veo</strong> video generation for circuit visualizations. Data is used solely for real-time insight and is not used for model training without consent.
          </p>
        </div>
      </div>

      <section className="bg-[#0d162d] border border-blue-500/20 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-3 text-blue-400">
          <Globe size={24} />
          <h3 className="text-lg font-bold uppercase tracking-tight">Third-Party Infrastructure</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-2xl">
            <p className="text-[10px] font-bold text-white uppercase mb-1">Hosting/Auth</p>
            <p className="text-[10px] text-blue-400 font-mono">Google Firebase</p>
          </div>
          <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-2xl">
            <p className="text-[10px] font-bold text-white uppercase mb-1">AI Engine</p>
            <p className="text-[10px] text-purple-400 font-mono">Gemini Flash/Pro</p>
          </div>
          <div className="p-4 bg-[#161b22] border border-[#30363d] rounded-2xl">
            <p className="text-[10px] font-bold text-white uppercase mb-1">Payments</p>
            <p className="text-[10px] text-emerald-400 font-mono">Stripe Connect</p>
          </div>
        </div>
      </section>

      <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-8 space-y-4">
        <div className="flex items-center gap-3 text-orange-400">
          <Lock size={20} />
          <h4 className="text-sm font-bold uppercase tracking-wider">Security Protocols</h4>
        </div>
        <p className="text-xs text-[#8b949e] leading-relaxed">
          All data transmissions are encrypted via SSL/TLS. Firestore database access is restricted via server-side Security Rules, ensuring that your research data is only accessible by your authenticated account.
        </p>
      </div>

      <div className="flex items-center justify-between p-6 bg-[#161b22]/50 border border-[#30363d] rounded-2xl">
        <div className="flex items-center gap-3">
          <Info size={16} className="text-[#484f58]" />
          <p className="text-[10px] text-[#8b949e] uppercase font-bold tracking-widest">Contact Governance: phidephefem@gmail.com</p>
        </div>
        <button 
          onClick={() => setPage('home')}
          className="text-[10px] font-bold text-blue-400 uppercase hover:underline"
        >
          Accept & Return Home
        </button>
      </div>
    </div>
  );
}
