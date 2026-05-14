import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  Settings, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  Camera, 
  Cpu, 
  Microscope, 
  Wind, 
  Database,
  Save,
  Sparkles
} from 'lucide-react';
import { useUser } from './UserContext';
import { useSoundEffects } from '../hooks/useSoundEffects';

const SPECIALIZATIONS = [
  { id: 'mechanical', name: 'Mechanical', icon: Wind, color: 'text-orange-400' },
  { id: 'electrical', name: 'Electrical', icon: Cpu, color: 'text-blue-400' },
  { id: 'civil', name: 'Civil', icon: Database, color: 'text-emerald-400' },
  { id: 'software', name: 'Software', icon: Zap, color: 'text-purple-400' },
];

export function UserProfile() {
  const { profile, updateProfile, logout, setPage } = useUser();
  const { playSound } = useSoundEffects();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [specialization, setSpecialization] = useState(profile?.specialization || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpgrade = () => {
    playSound('click');
    setPage('pricing');
  };

  const handleSave = async () => {
    setIsSaving(true);
    playSound('click');
    await updateProfile({ displayName, specialization });
    setIsSaving(false);
    playSound('success');
  };

  if (!profile) return null;

  const level = Math.floor(profile.xp / 1000) + 1;
  const xpToNextLevel = 1000 - (profile.xp % 1000);
  const progressPercent = (profile.xp % 1000) / 10;

  const getTrialDaysRemaining = () => {
    if (!profile.trialExpiresAt) return 0;
    const expiry = new Date(profile.trialExpiresAt);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = getTrialDaysRemaining();

  return (
    <div className="space-y-8 pb-32">
      <header className="flex flex-col items-center text-center space-y-4">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-blue-600/10 border-4 border-blue-600/20 flex items-center justify-center overflow-hidden">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={40} className="text-blue-400" />
            )}
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-[#1f2937] rounded-full border border-[#30363d] text-[#8b949e] hover:text-white transition-all shadow-xl">
            <Camera size={14} />
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight uppercase">{profile.displayName}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-[#8b949e] text-xs font-mono uppercase tracking-widest">Level {level} Elite Scientist</p>
            {profile.isSubscribed ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-bold border border-emerald-500/20 uppercase tracking-widest">Pro Member</span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[8px] font-bold border border-blue-500/20 uppercase tracking-widest">Trial: {daysLeft}d left</span>
            )}
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-blue-500/20 rounded-[32px] p-8 space-y-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Zap size={140} fill="currentColor" className="text-blue-400" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest w-fit">
            <Sparkles size={12} /> {profile.isSubscribed ? "Premium Access" : "Trial Membership"}
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight uppercase">
            {profile.isSubscribed ? "Pro Features Active" : "Upgrade Your Research"}
          </h3>
          <p className="text-[#8b949e] text-xs leading-relaxed max-w-sm">
            {profile.isSubscribed 
              ? "Your Pro subscription is active. You have full access to all engineering specialist tools, virtual labs, and Gemini 3.1 AI integration."
              : "Unlock advanced virtual labs, exclusive engineering specialist tools, and unlimited AI sessions with Gemini 3.1."
            }
          </p>

          {!profile.isSubscribed && (
            <div className="grid grid-cols-1 gap-3 pt-2">
              <button 
                onClick={handleUpgrade}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
              >
                {daysLeft > 0 ? `Resume Trial (${daysLeft} Days Left)` : "Start 7-Day Free Trial"}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleUpgrade}
                  className="py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all flex flex-col items-center justify-center gap-0.5 uppercase tracking-tighter text-[9px]"
                >
                  <span>Pro Subscription</span>
                  <span className="opacity-80">$19.99 / Monthly</span>
                </button>
                <button 
                  onClick={handleUpgrade}
                  className="py-3 bg-[#161b22] hover:bg-[#1f2937] text-white font-bold rounded-2xl border border-blue-500/30 transition-all shadow-blue-900/20 flex flex-col items-center justify-center gap-0.5 uppercase tracking-tighter text-[9px]"
                >
                  <span>Premium Access</span>
                  <span className="text-blue-400">$199.99 / Yearly</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Settings size={14} className="text-blue-400" /> Personal Identity
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] text-[#484f58] font-bold uppercase tracking-widest">Research Name</label>
              <input 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl py-3 px-4 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
                placeholder="Enter display name..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-[#484f58] font-bold uppercase tracking-widest">Core Field</label>
              <div className="grid grid-cols-2 gap-2">
                {SPECIALIZATIONS.map(spec => (
                  <button
                    key={spec.id}
                    onClick={() => {
                      setSpecialization(spec.id);
                      playSound('click');
                    }}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                      specialization === spec.id 
                        ? "bg-blue-500/10 border-blue-500/50 text-white" 
                        : "bg-[#0d1117] border-[#30363d] text-[#8b949e] hover:border-blue-500/20"
                    }`}
                  >
                    <spec.icon size={16} className={spec.color} />
                    <span className="text-xs font-bold uppercase tracking-tight">{spec.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest shadow-lg shadow-blue-500/10 disabled:opacity-50"
            >
              {isSaving ? "Syncing..." : <>Save Profile <Save size={14} /></>}
            </button>

            <button 
              onClick={() => { logout(); playSound('click'); }}
              className="w-full py-3 bg-red-500/5 hover:bg-red-500/10 text-red-500 font-bold rounded-xl border border-red-500/10 transition-all flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest"
            >
              Sign Out session
            </button>

            <div className="pt-4 border-t border-[#30363d] flex justify-center gap-6">
              <button 
                onClick={() => setPage('privacy')}
                className="text-[10px] text-[#484f58] uppercase font-bold hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setPage('support')}
                className="text-[10px] text-[#484f58] uppercase font-bold hover:text-white transition-colors"
              >
                Support Center
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 space-y-6">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Trophy size={14} className="text-yellow-400" /> Academic Standing
          </h3>

          <div className="space-y-4">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#484f58] font-bold uppercase tracking-widest">Experience Points</span>
                <span className="text-xl font-bold text-white">{profile.xp} <span className="text-[10px] text-blue-400">XP</span></span>
              </div>
              <div className="h-2 bg-[#161b22] rounded-full overflow-hidden border border-[#30363d]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                />
              </div>
              <p className="text-[9px] text-[#8b949e] text-center font-mono">Next level in {xpToNextLevel} XP</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 text-center space-y-1">
                <p className="text-[9px] text-[#8b949e] font-bold uppercase tracking-tighter">Labs Completed</p>
                <p className="text-xl font-bold text-white">0</p>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-4 text-center space-y-1">
                <p className="text-[9px] text-[#8b949e] font-bold uppercase tracking-tighter">AI Queries</p>
                <p className="text-xl font-bold text-white">0</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Cloud Sync Enabled</p>
                <p className="text-[9px] text-[#8b949e]">Your progress is secure in Firebase.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
