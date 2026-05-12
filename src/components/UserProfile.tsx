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
  Save
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
  const { profile, updateProfile, logout } = useUser();
  const { playSound } = useSoundEffects();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [specialization, setSpecialization] = useState(profile?.specialization || '');
  const [isSaving, setIsSaving] = useState(false);

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
          <p className="text-[#8b949e] text-xs font-mono uppercase tracking-widest">Level {level} Elite Scientist</p>
        </div>
      </header>

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
