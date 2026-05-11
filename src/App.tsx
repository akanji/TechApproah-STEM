import { useState, useEffect, useRef } from "react";
import { Home, BookOpen, Microscope, BarChart3, MessageSquare, 
  Sparkles, Brain, Mic, Video, Settings, Play, ChevronRight,
  Flame, Zap, Trophy, Headphones, Search, Link as LinkIcon, FileText, Info, CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ThinkingChat } from "./components/ThinkingChat";
import { VoicePartner } from "./components/VoicePartner";
import { MediaLab } from "./components/MediaLab";
import { AudioTranscriber } from "./components/AudioTranscriber";
import { LabEngine } from "./components/LabEngine";
import { LabContent } from "./components/LabContent";

const SUBJECTS = [
  { id: "physics", icon: "⚛️", name: "Physics", color: "#1a6fdb", bg: "#e6f1fb", topics: ["Mechanics","Thermodynamics","Electricity & Magnetism","Modern Physics"], desc: "From Newton's laws to quantum ideas" },
  { id: "chemistry", icon: "🧪", name: "Chemistry", color: "#0f6e56", bg: "#e1f5ee", topics: ["Foundations","Stoichiometry","Thermochemistry","Materials"], desc: "Atoms, reactions, and real materials" },
  { id: "biology", icon: "🧬", name: "Biology", color: "#3b6d11", bg: "#eaf3de", topics: ["Cell Biology","Genetics","Physiology","Biotech"], desc: "Life systems and bioengineering" },
  { id: "math", icon: "∫", name: "Math for Engineers", color: "#854f0b", bg: "#faeeda", topics: ["Pre-Calculus","Calculus","Linear Algebra","Statistics"], desc: "The language of engineering" },
  { id: "ee", icon: "⚡", name: "Electrical Engineering", color: "#993556", bg: "#fbeaf0", topics: ["Circuit Basics","DC Circuits","AC Basics","Digital Logic"], desc: "Circuits, signals, and electronics" },
  { id: "mech", icon: "⚙️", name: "Mechanical Engineering", color: "#5f5e5a", bg: "#f1efe8", topics: ["Statics","Structural Design","Fluid Basics","Machines"], desc: "Forces, materials, and machines" },
];

const MODULES: {[key: string]: any[]} = {
  physics: [
    { id: 1, title: "Scalars, Vectors & Units", duration: "12 min", xp: 150, completed: true },
    { id: 2, title: "Kinematics in 1D and 2D", duration: "18 min", xp: 200, completed: true },
    { 
      id: 3, 
      title: "Newton's Second Law (F=ma)", 
      duration: "20 min", 
      xp: 250, 
      completed: false, 
      active: true, 
      labType: "physics",
      content: {
        lab_id: "physics_001",
        title: "Newton's Second Law",
        ai_notes: {
          definition: "The acceleration of an object as produced by a net force is directly proportional to the magnitude of the net force.",
          formulas: ["F = ma", "a = F/m"],
          units: "Newton (N), Kilogram (kg), m/s²",
          quiz: [
            {q: "If force doubles and mass stays same, what happens to acceleration?", a: "It doubles"},
            {q: "What is the unit of Force?", a: "Newton"}
          ]
        },
        resources: [
          {type: "video", url: "https://youtube.com/watch?v=kKKM8Y-u7ds", desc: "Visualizing F=ma"},
          {type: "sim", url: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html", desc: "PhET Forces & Motion"}
        ]
      }
    },
    { 
      id: 4, 
      title: "Heat Transfer & Specific Heat", 
      duration: "25 min", 
      xp: 300, 
      completed: false, 
      labType: "thermo",
      content: {
        lab_id: "thermo_003",
        title: "Heat Transfer & Specific Heat",
        ai_notes: {
          topic: "Thermodynamics",
          definition: "Specific heat is the amount of heat per unit mass required to raise the temperature by one degree Celsius.",
          formulas: ["Q = mcΔT"],
          units: "Joules (J), kg, °C",
          notes: {
            definition: "Specific heat (c) varies by material. Water has a notably high capacity (4186 J/kg°C), making it an excellent heat sink.",
            formula_triangle: "Q / (m * c * ΔT)",
            real_world: "The high specific heat of water regulates Earth's climate and prevents rapid temperature spikes.",
            common_mistake: "Mixing up Mass (m) in kg vs grams. Always check consistency of units."
          },
          quiz: [
            {q: "What is the unit of Specific Heat Capacity?", a: "J/kg°C"},
            {q: "If mass increases, does it require more or less energy for the same temp change?", a: "More energy"}
          ]
        },
        resources: [
          {type: "video", url: "https://www.youtube.com/watch?v=kYI9FmHozYw", desc: "Specific Heat Capacity Explained"},
          {type: "link", url: "https://openstax.org/details/books/university-physics-volume-2", desc: "OpenStax University Physics Vol 2"},
          {type: "sim", url: "https://phet.colorado.edu/en/simulations/energy-forms-and-changes", desc: "Energy Forms & Changes PhET"}
        ]
      }
    },
  ],
  ee: [
    { 
      id: 1, 
      title: "Ohm's Law: V = IR", 
      duration: "15 min", 
      xp: 200, 
      completed: false, 
      active: true, 
      labType: "ee",
      content: {
        lab_id: "elec_002",
        title: "Ohm's Law",
        ai_notes: {
          topic: "Ohm's Law",
          notes: {
            definition: "Ohm's Law states that the current through a conductor between two points is directly proportional to the voltage across the two points.",
            formula_triangle: "V over I and R",
            real_world: "Dimmer switches, volume knobs, and battery chargers.",
            common_mistake: "Forgetting that resistance usually increases with temperature in real-world bulbs."
          },
          quiz: [
            {q: "What is the primary relationship expressed by Ohm's Law?", a: "V = IR"},
            {q: "If voltage is constant and resistance increases, what happens to current?", a: "Current decreases"}
          ]
        },
        resources: [
          {type: "link", url: "https://www.allaboutcircuits.com/textbook/direct-current/chpt-2/voltage-current-resistance-relate/", desc: "AllAboutCircuits Guide"},
          {type: "sim", url: "https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc", desc: "Interactive PhET DC Kit"}
        ]
      }
    },
    { id: 2, title: "Series & Parallel Circuits", duration: "20 min", xp: 300, completed: false },
  ],
  biology: [
    { 
      id: 1, 
      title: "DNA Synthesis & Matching", 
      duration: "20 min", 
      xp: 400, 
      completed: false, 
      active: true, 
      labType: "bio",
      content: {
        lab_id: "bio_001",
        title: "DNA Basics",
        validation: {
          status: "validated",
          findings: [
            "Biological Logic: Transcription pairing (A-U, T-A, C-G) is 100% accurate.",
            "UI Interaction: State-driven 'Success' message triggers only on perfect sequence matching.",
            "Error Prevention: Interaction logic prevents invalid bases (like T) from being injected into mRNA strand."
          ]
        },
        ai_notes: {
          topic: "Genetics",
          definition: "Transcription is the master process where genomic DNA is copied into messenger RNA (mRNA). This allows the genetic 'blueprint' to leave the nucleus without damaging the original source.",
          formulas: ["A → U (Uracil Replacement)", "T → A", "C → G", "G → C", "3 Nucleotides = 1 Codon"],
          units: "Nitrogenous Bases / Codons",
          notes: {
            definition: "Transcription: Genetic information flows from DNA → RNA. Translation: mRNA codons are read by ribosomes to assemble amino acids into proteins.",
            formula_triangle: "3 Nucleotides = 1 Codon = 1 Amino Acid",
            real_world: "mRNA vaccines (like COVID-19) deliver synthesized mRNA directly to cells, using these transcription principles to trigger immune responses.",
            common_mistake: "Thymine (T) exists ONLY in DNA. In RNA, Uracil (U) takes its place completely. Forgetting this leads to incorrect protein synthesis models."
          },
          quiz: [
            {q: "Which Nitrogenous base is unique to RNA?", a: "Uracil (U)"},
            {q: "How many nucleotides make up a single codon?", a: "Three (3)"},
            {q: "True or False: Transcription happens in the Ribosome.", a: "False. It happens in the Nucleus; Translation happens in Ribosomes."}
          ]
        },
        resources: [
          {type: "video", url: "https://www.youtube.com/watch?v=8m6hHRIKwxY", desc: "DNA Transcription Animation"},
          {type: "link", url: "https://vcell.ndsu.edu/animations/transcription/movie-flash.htm", desc: "Virtual Cell Synthesis"}
        ]
      }
    },
  ],
  mech: [
    { 
      id: 1, 
      title: "Structural Bridge Design", 
      duration: "30 min", 
      xp: 600, 
      completed: false, 
      active: true, 
      labType: "structural",
      content: {
        lab_id: "mech_001",
        title: "Virtual Lab 5: Bridge Design & Stress Testing",
        validation: {
          status: "validated",
          findings: [
            "Engineering Logic: Stress/Strain relationship follows Hooke's Law.",
            "Material Accuracy: Material constants for Steel (200 GPa) and Yield Strength (250 MPa) are verified.",
            "Safety Protocol: The 'Structural Failure' state correctly triggers when the Safety Factor falls below 1.0."
          ]
        },
        ai_notes: {
          topic: "Structural Engineering",
          definition: "Structural integrity testing calculates the internal resistance (Stress) and deformation (Strain) of materials under external loads.",
          formulas: ["Stress (σ) = Force / Area", "Strain (ε) = Stress / E (Young's Modulus)", "Safety Factor = Yield Strength / Actual Stress"],
          units: "Pascals (Pa), Newtons (N), m²",
          notes: {
            definition: "Young’s Modulus (E) is a measure of the stiffness of an elastic material. It defines the relationship between stress and strain.",
            formula_triangle: "σ = F/A | ε = σ/E",
            real_world: "Building skyscrapers, suspension bridges, and aircraft wings requires precise calculation of these factors to prevent catastrophic failure.",
            common_mistake: "Assuming the bridge breaks only at peak load. Cyclic loading and fatigue can cause failure even below yield strength in real-world scenarios."
          },
          quiz: [
            {q: "What is the formula for Stress (σ)?", a: "Force / Area"},
            {q: "What does Young's Modulus (E) measure?", a: "Stiffness of an elastic material"},
            {q: "True or False: Increasing 'Area' (A) reduces the Stress (σ) on a beam.", a: "True"}
          ]
        },
        resources: [
          {type: "video", url: "https://www.youtube.com/watch?v=XhS6_K_9I4A", desc: "Understanding Young's Modulus"},
          {type: "link", url: "https://skyciv.com/free-resources/beam-stress-calculator/", desc: "External Stress Calculator"}
        ]
      }
    },
  ]
};

const RESOURCES = [
  { name: "PhET Interactive Simulations", url: "https://phet.colorado.edu/", desc: "Physics and Chemistry visuals" },
  { name: "Khan Academy Engineering", url: "https://www.khanacademy.org/science/electrical-engineering", desc: "Foundational EE concepts" },
  { name: "OpenStax University Physics", url: "https://openstax.org/details/books/university-physics-volume-1", desc: "Verified OER Textbooks" },
];

const BADGES = [
  { id: 1, name: "Mechanics Master", icon: "🏆", earned: true, desc: "Complete all mechanics modules" },
  { id: 2, name: "Circuit Builder", icon: "⚡", earned: true, desc: "Build 5 virtual circuits" },
  { id: 3, name: "Data Detective", icon: "🔍", earned: false, desc: "Analyze 3 datasets" },
  { id: 4, name: "Code Wizard", icon: "🧙", earned: false, desc: "Complete Python track" },
  { id: 5, name: "Lab Pioneer", icon: "🔬", earned: true, desc: "Finish 3 mini-projects" },
  { id: 6, name: "Streak Champion", icon: "🔥", earned: false, desc: "30-day streak" },
];

import { UserProvider, useUser } from "./components/UserContext";

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

function AppContent() {
  const [page, setPage] = useState("home");
  const { user, profile, progress, login, logout, xp: userXp } = useUser();
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [studyMode, setStudyMode] = useState<"theory" | "lab">("theory");
  const [showThinkingChat, setShowThinkingChat] = useState(false);
  const [showVoicePartner, setShowVoicePartner] = useState(false);
  const [xp, setXp] = useState(1840);
  const [streak, setStreak] = useState(12);

  const activeModuleData = activeSubject ? MODULES[activeSubject]?.find(m => m.id === activeModule) : null;

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "subjects", label: "Library", icon: BookOpen },
    { id: "projects", label: "Labs", icon: Microscope },
    { id: "progress", label: "Stats", icon: BarChart3 },
    { id: "community", label: "Forums", icon: MessageSquare },
  ];

  // Simulation Panel
  function SimulationPanel({ onClose }: { onClose: () => void }) {
    const [mass, setMass] = useState(5);
    const [force, setForce] = useState(20);
    const accel = (force / mass).toFixed(2);
    const barWidth = Math.min(100, (force / mass / 10) * 100);

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0d1117] border border-[#30363d] rounded-2xl p-6 mt-4 mb-4 shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[#e6edf3] font-bold flex items-center gap-2">
            <Sparkles size={18} className="text-blue-400" />
            Interactive Simulation: F = ma
          </h3>
          <button onClick={onClose} className="p-1 px-3 rounded-lg bg-[#21262d] border border-[#30363d] text-xs text-[#8b949e]">Close</button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="text-[10px] uppercase font-bold text-blue-400 mb-2">Mass (kg)</div>
            <div className="text-3xl font-mono text-white mb-2">{mass}</div>
            <input type="range" min="1" max="20" value={mass} onChange={(e) => setMass(Number(e.target.value))} className="w-full accent-blue-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4">
            <div className="text-[10px] uppercase font-bold text-orange-400 mb-2">Force (N)</div>
            <div className="text-3xl font-mono text-white mb-2">{force}</div>
            <input type="range" min="1" max="100" value={force} onChange={(e) => setForce(Number(e.target.value))} className="w-full accent-orange-500 bg-[#30363d] h-1.5 rounded-lg appearance-none cursor-pointer" />
          </div>
        </div>
        <div className="bg-[#052616] border border-green-500/20 rounded-xl p-6 text-center">
          <div className="text-[10px] uppercase font-bold text-green-400 mb-2">Calculated Acceleration</div>
          <div className="text-5xl font-mono text-green-400 font-bold mb-4">{accel}<span className="text-xl ml-1">m/s²</span></div>
          <div className="h-2 bg-[#161b22] rounded-full overflow-hidden">
            <motion.div 
              animate={{ width: `${barWidth}%` }}
              className="h-full bg-green-500" 
            />
          </div>
          <p className="text-[10px] text-green-500/60 mt-3 font-mono">F({force}N) ÷ m({mass}kg) = a({accel}m/s²)</p>
        </div>
      </motion.div>
    );
  }

  const HomePage = () => (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d2248] via-[#1a3a6b] to-[#0d162d] rounded-3xl p-8 py-10 border border-blue-500/10">
        <div className="relative z-10 max-w-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Brain size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-blue-400/70">Source Grounding Ready</p>
              <h1 className="text-2xl font-bold text-white tracking-tight leading-none uppercase">TechApproach</h1>
            </div>
          </div>
          <p className="text-blue-100/60 text-sm leading-relaxed mb-6">
            Master laws of nature. Use the <strong className="text-white">(+) icon</strong> in the chat sidebar to upload manuals for NotebookLM-style reasoning.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage("subjects")}
              className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"
            >
              Resume Track
            </button>
            <button 
              onClick={() => setShowVoicePartner(true)}
              className="px-6 py-2.5 bg-white/5 border border-white/10 text-white text-xs font-bold rounded-full hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Mic size={14} />
              AI Voice Partner
            </button>
          </div>
        </div>
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-10 -mb-10 blur-2xl" />
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Streak", val: streak, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/5" },
          { label: "Level XP", val: (profile?.xp ?? xp).toLocaleString(), icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/5" },
          { label: "Shields", val: 14, icon: Trophy, color: "text-blue-500", bg: "bg-blue-500/5" }
        ].map(stat => (
          <div key={stat.label} className="bg-[#161b22] border border-[#30363d] rounded-2xl p-4 text-center">
            <div className={`w-8 h-8 rounded-lg ${stat.bg} mx-auto mb-2 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div className="text-lg font-mono font-bold text-white leading-none">{stat.val}</div>
            <div className="text-[10px] uppercase font-bold text-[#8b949e] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Active Module */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 relative group overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Current Goal · Physics</p>
            <h3 className="text-white font-bold text-lg">Newton's Second Law</h3>
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 uppercase">
            Module 3/5
          </div>
        </div>
        <div className="h-2 bg-[#0d1117] rounded-full overflow-hidden mb-6">
          <div className="h-full w-[60%] bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
        </div>
        <button 
          onClick={() => { setActiveSubject("physics"); setActiveModule(3); setPage("subjects"); }}
          className="w-full py-3 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Resume Module <ChevronRight size={16} />
        </button>
      </div>

      {/* AI Labs Promo */}
      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => setPage("projects")}
          className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 cursor-pointer hover:bg-emerald-500/10 transition-all border-dashed"
        >
          <Headphones size={24} className="text-emerald-400 mb-3" />
          <h4 className="text-white font-bold text-sm mb-1">Audio Transcriber</h4>
          <p className="text-[10px] text-emerald-400 font-medium uppercase">Analyze Lectures</p>
        </div>
        <div 
          onClick={() => setPage("projects")}
          className="bg-purple-500/5 border border-purple-500/10 rounded-2xl p-6 cursor-pointer hover:bg-purple-500/10 transition-all border-dashed"
        >
          <Video size={24} className="text-purple-400 mb-3" />
          <h4 className="text-white font-bold text-sm mb-1">Science Viz Lab</h4>
          <p className="text-[10px] text-purple-400 font-medium uppercase">Generate Anims</p>
        </div>
      </div>
    </div>
  );

  const SubjectsPage = () => {
    const filteredSubjects = SUBJECTS.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <div className="space-y-6">
        {!activeSubject ? (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#484f58]" size={16} />
              <input 
                placeholder="Search subjects, topics, equations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161b22] border border-[#30363d] rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500/40" 
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredSubjects.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => setActiveSubject(s.id)}
                  className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex items-center gap-5 cursor-pointer hover:border-blue-500/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0d162d] border border-blue-500/10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold">{s.name}</h3>
                    <p className="text-[#8b949e] text-xs mt-1">{s.desc}</p>
                  </div>
                  <ChevronRight size={18} className="text-[#484f58] group-hover:text-blue-400 transition-colors" />
                </div>
              ))}
            </div>
          </>
        ) : activeModule ? (
        <div className="space-y-4">
          <button onClick={() => setActiveModule(null)} className="text-[#8b949e] flex items-center gap-1 text-xs hover:text-white transition-colors mb-2 uppercase font-bold tracking-widest">
            <ChevronRight size={14} className="rotate-180" /> Back to Subject
          </button>
          
          <div className="bg-[#0d2248] rounded-2xl p-6 border border-blue-500/20">
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">
              {MODULES[activeSubject!]?.find(m => m.id === activeModule)?.title}
            </h2>
            <p className="text-blue-300/80 text-sm">Interactive exploration with Judge Agent verification.</p>
          </div>

          <div className="space-y-6">
            <div className="flex bg-[#161b22] border border-[#30363d] rounded-xl p-1">
              <button 
                onClick={() => setStudyMode("theory")}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${studyMode === "theory" ? "bg-blue-600 text-white" : "text-[#8b949e] hover:text-[#c9d1d9]"}`}
              >
                Study Mode
              </button>
              <button 
                onClick={() => setStudyMode("lab")}
                className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${studyMode === "lab" ? "bg-blue-600 text-white" : "text-[#8b949e] hover:text-[#c9d1d9]"}`}
              >
                Lab Mode
              </button>
            </div>

            <div className="space-y-4">
              {studyMode === "theory" && activeModuleData?.content ? (
                <LabContent 
                  data={activeModuleData.content} 
                  onComplete={() => setStudyMode("lab")} 
                />
              ) : (
                <>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 text-[#c9d1d9] space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                        <FileText size={16} />
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Insight Notes</h4>
                    </div>
                    <div className="space-y-2 text-xs leading-relaxed opacity-80">
                      <p>• <strong className="text-blue-400">Definition:</strong> {activeModuleData?.content?.ai_notes?.definition || "Fundamental relationship governing movement in classical systems."}</p>
                      <p>• <strong className="text-blue-400">Key Formula:</strong> {activeModuleData?.content?.ai_notes?.formulas?.[0] || "$F = ma$"} where $F$ is net force, $m$ is mass, and $a$ is acceleration.</p>
                      <p>• <strong className="text-blue-400">Units:</strong> {activeModuleData?.content?.ai_notes?.units || "Newton (N), Kilogram (kg), m/s²."}</p>
                    </div>
                  </div>

                  {activeModuleData?.labType && (
                    <LabEngine 
                      type={activeModuleData.labType} 
                      labId={activeModuleData.content?.lab_id}
                      onComplete={() => { if(!user) setXp(p => p + 500); setActiveModule(null); }}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          <div className="bg-[#0d162d] border border-blue-500/10 rounded-2xl p-6">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <LinkIcon size={14} /> Verified Resources
            </h4>
            <div className="space-y-3">
              {RESOURCES.map(r => (
                <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="block p-3 bg-[#161b22] border border-[#30363d] rounded-xl hover:border-blue-500/30 transition-all">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">{r.name}</p>
                      <p className="text-[10px] text-[#8b949e]">{r.desc}</p>
                    </div>
                    <ChevronRight size={14} className="text-[#484f58]" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <button onClick={() => setActiveSubject(null)} className="text-[#8b949e] flex items-center gap-1 text-xs hover:text-white transition-colors mb-2 uppercase font-bold tracking-widest">
            <ChevronRight size={14} className="rotate-180" /> All Subjects
          </button>
          <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 flex flex-col items-center text-center">
            <div className="text-6xl mb-4">{SUBJECTS.find(s => s.id === activeSubject)?.icon}</div>
            <h2 className="text-2xl font-bold text-white">{SUBJECTS.find(s => s.id === activeSubject)?.name}</h2>
            <p className="text-[#8b949e] text-sm mt-2">{SUBJECTS.find(s => s.id === activeSubject)?.desc}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-[#484f58] uppercase tracking-[0.2em] mb-2 px-1">Curriculum</h4>
            {MODULES[activeSubject!]?.map(m => {
              const labId = m.content?.lab_id;
              const isCompleted = m.completed || (labId && progress[labId]?.completed);
              const isAvailable = m.active || isCompleted || m.id === 1; // Basic logic for availability

              return (
                <div 
                  key={m.id} 
                  onClick={() => isAvailable ? setActiveModule(m.id) : null}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isCompleted 
                      ? "bg-[#161b22] border-green-500/20 opacity-80 cursor-pointer" 
                      : isAvailable 
                      ? "bg-[#161b22] border-blue-500/50 cursor-pointer shadow-lg shadow-blue-900/10" 
                      : "bg-[#0d1117] border-[#30363d] opacity-40 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted ? "bg-green-500/20 text-green-400" : isAvailable ? "bg-blue-600 text-white" : "bg-[#21262d] text-[#8b949e]"
                    }`}>
                      {isCompleted ? "✓" : m.id}
                    </div>
                    <div>
                      <h5 className="text-white text-sm font-bold">{m.title}</h5>
                      <p className="text-[10px] text-[#8b949e] uppercase font-bold">{m.duration} · +{m.xp} XP</p>
                    </div>
                  </div>
                  {isAvailable && !isCompleted && <Play size={16} className="text-blue-400" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
  };

  const ProjectsPage = () => (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">AI Multi-Modal Labs</h2>
        <p className="text-[#8b949e] text-sm">Leverage Gemini 3.1 for advanced science processing.</p>
      </div>
      
      <MediaLab />
      <AudioTranscriber />

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-[#484f58] uppercase tracking-widest">Active Challenges</h3>
        {[
          { title: "Phone Accelerometer Lab", subject: "Mechanics", diff: "Easy", xp: 500 },
          { title: "Circuit Builder Pro", subject: "EE", diff: "Hard", xp: 1200 }
        ].map(p => (
          <div key={p.title} className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex justify-between items-center">
            <div>
              <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">{p.subject} · {p.diff}</p>
              <h4 className="text-white font-bold">{p.title}</h4>
            </div>
            <div className="text-xs font-mono text-yellow-500 font-bold">+{p.xp} XP</div>
          </div>
        ))}
      </div>
    </div>
  );

  const ProgressPage = () => {
    const progressList = Object.values(progress);
    const completedCount = progressList.filter((p: any) => p.completed).length;
    const totalModules = Object.values(MODULES).flat().length;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 text-center">
            <p className="text-[10px] font-bold text-[#8b949e] uppercase mb-2">Total Points</p>
            <div className="text-4xl font-mono text-white font-bold">{(profile?.xp ?? xp).toLocaleString()}</div>
          </div>
          <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6 text-center">
            <p className="text-[10px] font-bold text-[#8b949e] uppercase mb-2">Modules Finished</p>
            <div className="text-4xl font-mono text-emerald-500 font-bold">{completedCount} <span className="text-xs text-[#484f58]">/ {totalModules}</span></div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold">Mastery Badges</h3>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{BADGES.filter(b => b.earned).length}/{BADGES.length}</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {BADGES.map(b => (
              <div key={b.id} className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-2 text-center transition-all ${
                b.earned ? "bg-[#0d2248] border-blue-500/30 opacity-100" : "bg-[#161b22] border-[#30363d] opacity-30 grayscale"
              }`}>
                <div className="text-3xl mb-2">{b.icon}</div>
                <p className="text-[9px] font-bold text-white uppercase tracking-tighter leading-tight">{b.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Learning History */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#484f58] uppercase tracking-widest px-1">Verified Completion Log</h3>
          <div className="space-y-2">
            {Object.entries(progress).length > 0 ? (
              Object.entries(progress)
                .sort((a: any, b: any) => (b[1].lastAttemptAt?.seconds || 0) - (a[1].lastAttemptAt?.seconds || 0))
                .map(([id, p]: [string, any]) => {
                  // Find module name (expensive search, but for small dataset it's fine)
                  let modTitle = id;
                  Object.values(MODULES).flat().forEach((m: any) => {
                    if (m.content?.lab_id === id) modTitle = m.title;
                  });

                  return (
                    <div key={id} className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase">{modTitle}</h4>
                          <p className="text-[9px] text-[#8b949e] font-mono">CODE: {id}</p>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded">SCORE: {p.score}%</div>
                    </div>
                  );
                })
            ) : (
              <div className="p-8 border border-dashed border-[#30363d] rounded-2xl text-center text-[#484f58]">
                <Info size={24} className="mx-auto mb-2 opacity-20" />
                <p className="text-xs font-mono">No verified logs found yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const CommunityPage = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/10 to-transparent p-6 rounded-2xl border border-blue-500/10">
        <h3 className="text-lg font-bold text-white mb-2">Technical Forums</h3>
        <p className="text-sm text-[#8b949e]">Join 14,000+ engineering students discussing advanced concepts.</p>
      </div>

      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">U</div>
                <span className="text-xs font-bold text-[#e6edf3]">User_{i}42</span>
              </div>
              <span className="text-[10px] text-[#484f58] font-bold uppercase">2h ago</span>
            </div>
            <p className="text-sm text-[#c9d1d9] leading-relaxed">How does the Multimodal Live API handle low-latency PCM audio segments compared to standard WebSockets? Any performance benchmarks available?</p>
            <div className="flex gap-4 text-[10px] font-bold text-blue-400/60 uppercase">
              <span>{i * 4} Replies</span>
              <span>{i * 12} Upvotes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans selection:bg-blue-500/30">
      <main className="max-w-[480px] mx-auto min-h-screen relative pb-32">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tighter uppercase">TechApproach</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{profile?.displayName}</span>
                  <span className="text-[8px] text-blue-400 font-mono">ID: {user.uid.slice(0, 6)}</span>
                </div>
                <button 
                  onClick={logout}
                  className="w-10 h-10 rounded-xl bg-[#161b22] border border-[#30363d] overflow-hidden hover:border-red-500/50 transition-all transition-colors"
                >
                  <img src={profile?.photoURL} alt="Profile" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                </button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="px-4 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 uppercase tracking-widest"
              >
                Sign In
              </button>
            )}
            <button 
              onClick={() => setShowThinkingChat(!showThinkingChat)}
              className={`p-2 rounded-xl border transition-all ${showThinkingChat ? "bg-blue-600 text-white border-blue-500" : "bg-[#161b22] border-[#30363d] text-[#8b949e] hover:text-white"}`}
            >
              <Brain size={20} />
            </button>
            <button className="p-2 rounded-xl bg-[#161b22] border border-[#30363d] text-[#8b949e] hover:text-white transition-all">
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={page + activeSubject + activeModule}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {page === "home" && <HomePage />}
              {page === "subjects" && <SubjectsPage />}
              {page === "projects" && <ProjectsPage />}
              {page === "progress" && <ProgressPage />}
              {page === "community" && <CommunityPage />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating AI Bubbles */}
        <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50 pointer-events-none">
          <AnimatePresence>
            {!showVoicePartner && !showThinkingChat && (
              <motion.button
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 45 }}
                onClick={() => setShowVoicePartner(true)}
                className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all pointer-events-auto shadow-blue-900/40 border-4 border-[#0d1117] relative group"
              >
                <div className="absolute -top-10 right-0 bg-white text-blue-600 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest shadow-xl">Talk to Gemini</div>
                <Mic size={24} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Side Panels */}
        <AnimatePresence>
          {showThinkingChat && <ThinkingChat onClose={() => setShowThinkingChat(false)} />}
          {showVoicePartner && <VoicePartner onClose={() => setShowVoicePartner(false)} />}
        </AnimatePresence>

        {/* Navigation Bar */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-[#161b22]/90 backdrop-blur-xl border-t border-[#30363d] px-2 py-3 flex justify-around z-40">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={() => { setPage(item.id); if(item.id !== "subjects") { setActiveSubject(null); setActiveModule(null); } }}
              className={`flex flex-col items-center gap-1 min-w-[64px] transition-all ${page === item.id ? "text-blue-400" : "text-[#484f58] hover:text-[#8b949e]"}`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${page === item.id ? "bg-blue-400/10" : ""}`}>
                <item.icon size={22} strokeWidth={page === item.id ? 2.5 : 2} />
              </div>
              <span className="text-[9px] font-bold tracking-widest uppercase">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}
