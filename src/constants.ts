import { Home, BookOpen, Microscope, BarChart3, MessageSquare, Zap, Flame, Trophy, ShieldCheck, Sparkles } from "lucide-react";

export const SUBJECTS = [
  { 
    id: "physics", 
    name: "Applied Physics", 
    icon: "⚛️", 
    desc: "Mechanics, Waves, & Dynamics",
    topics: ["Kinematics", "Forces", "Energy", "Torque"]
  },
  { 
    id: "ee", 
    name: "Electrical Eng.", 
    icon: "🔌", 
    desc: "Circuits & Signal Processing",
    topics: ["Ohm's Law", "Logic Gates", "Microcontrollers"]
  },
  { 
    id: "structural", 
    name: "Civil Engineering", 
    icon: "🏗️", 
    desc: "Static Loads & Bridge Design",
    topics: ["Stress", "Strain", "Material Yield"]
  },
  { 
    id: "bio", 
    name: "Bio-Engineering", 
    icon: "🧬", 
    desc: "Cellular Mechanics & CRISPR",
    topics: ["Genetics", "Proteins", "Lab PCR"]
  },
  { 
    id: "mechanical", 
    name: "Mechanical Eng.", 
    icon: "⚙️", 
    desc: "Production & Machine Design",
    topics: ["Machining", "CAD/CAM", "Thermodynamics", "Robotics"]
  },
];

export const MODULES: Record<string, any[]> = {
  physics: [
    { 
      id: 1, 
      title: "Projectile Dynamics", 
      duration: "45 min", 
      xp: 500, 
      active: true, 
      labType: "physics",
      content: {
        lab_id: "phys_001",
        title: "Virtual Ballistics Range",
        ai_notes: {
          definition: "Projectile motion is a form of motion experienced by an object or particle that is projected near the Earth's surface and moves along a curved path under the action of gravity only.",
          formulas: ["y = v₀sinθt - ½gt²", "x = v₀cosθt"],
          units: "m, m/s, degrees (θ)",
          quiz: [
            {q: "At what angle is maximum range achieved?", a: "45 degrees"},
            {q: "Does mass affect trajectory in a vacuum?", a: "No"}
          ]
        },
        resources: [
          {type: "video", url: "https://www.youtube.com/watch?v=M8xCj2VPHas", desc: "Kinematics Deep Dive"}
        ]
      }
    },
    { 
      id: 2, 
      title: "Kinetic Energy Lab", 
      duration: "30 min", 
      xp: 300, 
      active: true, 
      labType: "physics",
      content: {
        lab_id: "phys_002",
        title: "Kinetic Energy Analyzer",
        ai_notes: {
          definition: "Kinetic Energy (KE) is the energy an object possesses due to its motion, derived as KE = ½mv².",
          formulas: ["KE = ½mv²", "W = ΔKE (Work-Energy Theorem)"],
          units: "Joules (J)",
          technical_breakdown: [
            "Mass proportionality: Double mass = Double KE",
            "Velocity proportionality: Double velocity = Quadruple KE",
            "Work-Energy Theorem: Total work equals change in KE"
          ]
        },
        resources: [
          {type: "video", url: "https://youtu.be/jOeUlYaikJ4", desc: "Kinetic Energy and Velocity Modeling"},
          {type: "video", url: "https://youtu.be/DfzBYhO8aoY", desc: "Potential and Kinetic Energy LAB"}
        ]
      }
    },
    { 
      id: 3, 
      title: "Energy Ramp Lab", 
      duration: "25 min", 
      xp: 450, 
      active: true, 
      labType: "physics",
      content: {
        lab_id: "phys_003",
        title: "PE to KE Conversion",
        ai_notes: {
          definition: "Analysis of gravitational potential energy conversion into translational kinetic energy.",
          formulas: ["PE = mgh", "v = √(2gh)"],
          technical_breakdown: [
            "Energy Conservation Principle",
            "Height-Velocity Correlation: v = √(2gh)",
            "Mass Independence of Velocity in Vacuum"
          ]
        },
        resources: [
          {type: "video", url: "https://youtu.be/DfzBYhO8aoY", desc: "Potential and Kinetic Energy LAB"}
        ]
      }
    }

  ],
  ee: [
    { 
      id: 1, 
      title: "Logic Gate Simulator", 
      duration: "20 min", 
      xp: 200, 
      active: true, 
      labType: "ee",
      content: {
        lab_id: "ee_001",
        title: "Digital Logic Explorer",
        ai_notes: {
          definition: "Logic gates are the basic building blocks of any digital system. It is an electronic circuit having one or more than one input and only one output.",
          formulas: ["AND: A•B", "OR: A+B", "NAND: ¬(A•B)"],
          units: "Boolean (0/1)",
          quiz: [
            {q: "What is the output of AND if inputs are 1 and 0?", a: "0"},
            {q: "Which gate is universal?", a: "NAND or NOR"}
          ]
        },
        resources: [
          {type: "video", url: "https://www.youtube.com/watch?v=gI-qXJK_G5k", desc: "Digital Logic Basics"}
        ]
      }
    },
    { 
      id: 2, 
      title: "Circuits & Signal Processing", 
      duration: "50 min", 
      xp: 750, 
      active: true, 
      labType: "ee",
      content: {
        lab_id: "ee_002",
        title: "S-Domain Solver & Op-Amp Design",
        validation: {
          status: "validated",
          findings: [
            "Mathematical Precision: ✅ S-domain component transformations (sL and 1/sC) are accurate.",
            "Stability Logic: ✅ The 'Left-Half Plane' (LHP) stability rule is correctly implemented in the UI logic.",
            "Educational Depth: ✅ Integrates foundational theory with interactive visual feedback for signal processing."
          ]
        },
        ai_notes: {
          topic: "S-Domain Circuit Analysis",
          definition: "Using the Laplace transform to convert time-domain differential equations into algebraic equations in the s-domain (complex frequency).",
          technical_breakdown: [
            "Modeling L as sL and C as 1/sC",
            "Stability plotting on the s-plane (Poles/Zeros)",
            "Ideal Op-Amp configurations (Integrator/Differentiator)",
            "Filter design via transfer functions H(s)"
          ],
          audio_overview: "Host: Today we're tackling the math that makes your phone's audio filter possible. Guest: The Laplace Transform. It's like a secret shortcut. Instead of solving nasty calculus, we turn everything into algebra. Host: And for hardware? Guest: Op-Amps. They are the 'calculus engines' of the analog world. An integrator op-amp is literally doing calculus in real-time.",
          study_guide: "# S-Domain & Signal Processing\n\n## 1. The Power of Laplace\nResistors stay $R$, but Inductors become $sL$ and Capacitors become $1/sC$. This allows us to use Ohm's Law in a whole new dimension.\n\n## 2. Op-Amp Golden Rules\n1. No current flows into the inputs ($I_+ = I_- = 0$).\n2. The voltage difference is zero ($V_+ = V_-$) when negative feedback is applied.\n\n## 3. Filters\nLow-pass filters block high frequencies. In the s-domain, this is modeled by placing a 'pole' at the desired cutoff frequency.",
          video_prompts: [
            "A high-fidelity visualization of signal attenuation in a low-pass filter as frequency increases.",
            "A schematic growth animation showing the transition from an inverting amplifier to an integrator."
          ],
          quiz: [
            {q: "What is the s-domain impedance of a capacitor?", a: "1/sC"},
            {q: "If an Op-Amp has negative feedback, what is the voltage difference between inputs?", a: "Zero"},
            {q: "True or False: A pole in the right-half plane indicates an unstable system.", a: "True"}
          ]
        },
        resources: [
          {type: "video", url: "https://youtu.be/6um4oZVyzc0", desc: "Operational Amplifiers (Op-Amps)"},
          {type: "video", url: "https://youtu.be/V-IwuBEa0PE", desc: "Electrical Wiring & Controls"},
          {type: "video", url: "https://youtu.be/C9W6qTueNBI", desc: "Circuits & Electronics"},
          {type: "video", url: "https://youtu.be/ZuFlJ1IZyPs", desc: "Electronics Lab Intro"},
          {type: "video", url: "https://youtu.be/I6arUTJ045w", desc: "Practical Electronics"},
          {type: "link", url: "https://www.allaboutcircuits.com/", desc: "All About Circuits Reference"}
        ]
      }
    }
  ],
  structural: [
    { 
      id: 1, 
      title: "Structural & Geotechnical AI", 
      duration: "45 min", 
      xp: 600, 
      active: true, 
      labType: "structural",
      content: {
        lab_id: "mech_001",
        title: "Automated Standards & Site Modeling",
        validation: {
          status: "validated",
          findings: [
            "Technical Accuracy: ✅ Use of borehole data for ground modeling is standard geotechnical practice.",
            "Code Reliability: ✅ Python/FEA core provides scalable site strata representation.",
            "Industry Standards: ✅ Steel Beam design follows modern ACI/AASHTO curricula."
          ]
        },
        ai_notes: {
          topic: "Civil Engineering AI",
          definition: "Integration of AI agents for parsing engineering standards and visualizing sitewide geotechnical data using 3D rendering and FEA optimization.",
          technical_breakdown: [
            "Luma AI: 3D explainer videos for concrete testing",
            "Pictory AI: Converting lab manuals to professional video",
            "Site Strata: 2D ground modeling from borehole data",
            "Material Optimization: Sustainability-focused structural constraints"
          ],
          audio_overview: "Host: Civil Engineering is evolving. Guest: Exactly. We're using Luma AI for 3D lab visuals and Pictory for automated manuals. Host: And the borehole data? Guest: Civils.ai parses geotechnical reports to create instant ground models, which then inform our FEA simulations for steel beam design.",
          study_guide: "# Civil Engineering AI & Standards\n\n## 1. Automated Standards\nLLM agents parse structural codes (ACI/AASHTO) to extract pile settlement and beam specs with high precision.\n\n## 2. Laboratory Integration\n- **Virtual Visuals**: Luma AI generates 3D explainers for concrete strength testing.\n- **Pictory Video**: Transforms written manuals into accessible visual content.\n\n## 3. Structural Optimization\nAlgorithms optimize material types and geometric constraints based on sustainability and budget, reducing environmental impact.",
          video_prompts: [
            "A 3D explainer showing the concrete compression test process, rendered in hyper-realistic Detail via Luma AI.",
            "A dynamic visualization of internal structural stress on a suspension bridge during high-wind events."
          ],
          quiz: [
            {q: "Which tool generates 3D explainer videos for lab procedures?", a: "Luma AI"},
            {q: "What is used to convert written manuals into visual content?", a: "Pictory AI"},
            {q: "True or False: AI can optimize structural geometry for sustainability.", a: "True"}
          ]
        },
        resources: [
          {type: "video", url: "https://youtu.be/x9MOtb03jvI", desc: "Civils AI Writing Hack"},
          {type: "video", url: "https://youtu.be/5xkfhH2R3eo", desc: "Civils.ai Tutorial"},
          {type: "video", url: "https://youtu.be/z3v6iGaJNts", desc: "AI for Structural Eng."},
          {type: "video", url: "https://youtu.be/EZZOMXjERAI", desc: "AI in Geotech Eng."},
          {type: "link", url: "https://civils.ai/", desc: "Civils.ai Dashboard"}
        ]
      }
    },
    {
      id: 2,
      title: "Static Loads & Bridge Design",
      duration: "35 min",
      xp: 550,
      active: true,
      labType: "structural",
      content: {
        lab_id: "bridge_001",
        title: "Loads & LSD Optimization",
        ai_notes: {
          definition: "Analysis of constant forces (static loads) that a bridge must support throughout its lifespan, adhering to AASHTO LRFD Equilibrium codes.",
          formulas: [
            "ΣF = 0, ΣM = 0",
            "U = γ_D * D + γ_SD * SD"
          ],
          technical_breakdown: [
            "Dead Loads (D): Structural weight (steel, concrete)",
            "Superimposed Dead (SD): Add-ons (asphalt, railings)",
            "Hydrostatic Pressures (H): Water/Soil lateral forces",
            "Limit State Design (LSD): Using load factors (γ) for safety"
          ],
          audio_overview: "Host: Bridge design isn't just about the aesthetics. Guest: No, it's about balance. Every bridge is a massive math problem where the sum of forces must be zero. Host: And the loads? Guest: We distinguish between Dead Loads—the bridge itself—and Superimposed Dead Loads like the asphalt on top. AI tools like SimScale are now running mesh configuration and stress distribution workflows in seconds, something that used to take days of manual analysis.",
          study_guide: "# Static Loads & Bridge Design Guide\n\n## 1. Load Classification\n- **Dead Loads (D)**: Permanent structural weight.\n- **Superimposed Dead Loads (SD)**: Constant forces added post-finish (railings, asphalt).\n- **Hydrostatic Pressures (H)**: Lateral forces from soil or water.\n\n## 2. Governing Laws\nNewton's laws of equilibrium demand that $\\sum F = 0$ and $\\sum M = 0$. If these are not met, structural failure is inevitable.\n\n## 3. Limit State Design (LSD)\nDesigners add safety buffers using Load Factors ($\\gamma$): $U = \\gamma_D \\cdot D + \\gamma_{SD} \\cdot SD$. For factory concrete, $\\gamma_D$ is typically 1.25.",
          quiz: [
            {q: "What does LSD stand for in structural design?", a: "Limit State Design"},
            {q: "The sum of all forces and moments must equal what for equilibrium?", a: "Zero"},
            {q: "True or False: γ_SD is typically 1.50 for wearing surfaces.", a: "True"}
          ]
        },
        resources: [
          {type: "video", url: "https://youtu.be/SbCVRr5eANA", desc: "Bridge Engineering Basics"},
          {type: "video", url: "https://youtu.be/IqCIX76eBks", desc: "Static Load Analysis on Bridge"},
          {type: "video", url: "https://youtu.be/so_R_KDRzC0", desc: "Bridge Design: Staad Pro Optimization"}
        ]
      }
    }
  ],
  bio: [
    {
      id: 1,
      title: "Cell Signaling & Transductions",
      duration: "45 min",
      xp: 600,
      active: true,
      labType: "bio",
      content: {
        lab_id: "bio_001",
        title: "Cell Signaling and Signal Transductions",
        ai_notes: {
          definition: "The complex system of communication that governs basic cellular activities and coordinates cell actions.",
          formulas: ["Kd = [L][R] / [LR]", "Signal Amplification Factor"],
          technical_breakdown: [
            "GPCR & RTK Signaling pathways",
            "Second messengers (cAMP, Ca2+, IP3)",
            "Kinase cascades (MAPK/ERK)",
            "Ligand-receptor kinetics"
          ],
          audio_overview: "Host: Let's talk about how cells 'talk'. Guest: It's all about signal transduction. A ligand binds to a receptor, like a key in a lock, and then a whole cascade of events happens inside. Host: Like a game of telephone? Guest: Exactly, but a very fast and accurate one that tells the cell whether to grow, divide, or even die.",
          study_guide: "# Cell Signaling and Signal Transductions\n\n## 1. Types of Signaling\n- **Autocrine**: Signaling self.\n- **Paracrine**: Signaling neighbors.\n- **Endocrine**: Long-distance (hormones).\n\n## 2. The Transduction Cascade\nBinding -> Conformational Change -> Second Messenger Activation -> Phosphorylation Cascade -> Cellular Response.",
          video_prompts: [
            "A high-quality animation of a ligand binding to a receptor and the subsequent activation of an intracellular G-protein.",
            "Visualizing the amplification of a single signal through a phosphorylation cascade."
          ],
          quiz: [
            {q: "What is the term for a signaling molecule that binds to a receptor?", a: "Ligand"},
            {q: "Which type of signaling involves hormones traveling through the bloodstream?", a: "Endocrine"}
          ]
        },
        resources: [
          {type: "video", url: "https://youtu.be/dS6jn0gMSZ0", desc: "Cell Signaling and Signal Transductions"},
          {type: "video", url: "https://youtu.be/KQm-gfobUm8", desc: "Biomedical Engineering Intro"}
        ]
      }
    },
    {
      id: 2,
      title: "CRISPR-Cas9 Robotics",
      duration: "60 min",
      xp: 800,
      active: true,
      labType: "bio",
      content: {
        lab_id: "bio_002",
        title: "Programmable Genetic Circuits",
        ai_notes: {
          definition: "Implementing precise double-strand breaks using RNA-guided endonucleases for genomic editing.",
          technical_breakdown: [
            "gRNA Design & PAM recognition (NGG)",
            "R-loop configuration ethics",
            "NHEJ vs HDR repair pathways",
            "Off-target effect mitigation strategies"
          ],
          audio_overview: "Host: Today's deep dive: CRISPR-Cas9. Is it really 'molecular scissors'? Guest: More like a molecular GPS with a built-in cutter. The gRNA is the coordinate system, and Cas9 is the hardware. Host: And the 'Robotics' part? Guest: We're now programming these systems to execute logic gate operations—only cutting if two distinct bio-signals are present. It's biological computation.",
          study_guide: "# CRISPR-Cas9 Protocols\n\n## 1. Designing gRNA\nThe guide RNA must be complementary to the target DNA and located upstream of a Protospacer Adjacent Motif (PAM), typically 'NGG'.\n\n## 2. Repair Mechanisms\n- **NHEJ**: Fast but error-prone. Often used for gene knockouts.\n- **HDR**: Precise. Requires a template DNA. Used for gene insertions.",
          video_prompts: [
            "A high-fidelity 3D animation of the CRISPR-Cas9 complex scanning a DNA strand, showing the formation of the R-loop and the double-strand break at the specific PAM site.",
            "A time-lapse visualization of the DNA repair process showing both NHEJ and HDR pathways in action."
          ],
          quiz: [
            {q: "What is the specific DNA sequence Cas9 recognizes?", a: "PAM (NGG)"},
            {q: "Which repair pathway is most common after a break?", a: "NHEJ"}
          ]
        },
        resources: [
          {type: "video", url: "https://youtu.be/CgpZ2PUcGt0", desc: "Genome Engineering CRISPR"},
          {type: "video", url: "https://youtu.be/lIYvWcKyxCg", desc: "Deep Tech in Biology"},
          {type: "video", url: "https://youtu.be/2mP9Eos-A6s", desc: "iBiology: CRISPR Mechanics (Jennifer Doudna)"}
        ]
      }
    }
  ],
  mechanical: [
    {
      id: 1,
      title: "Manufacturing & Production",
      duration: "50 min",
      xp: 700,
      active: true,
      labType: "mechanical",
      content: {
        lab_id: "mech_001",
        title: "Intelligent Production Systems",
        ai_notes: {
          definition: "⚙️ This module focuses on the transition from design to physical production, utilizing AI to simulate stress, heat, and manufacturing workflows.",
          technical_breakdown: [
            "CNC Machining: G-Code and M-Code automation",
            "Tool Stack: SimScale (AI design), Ansys (Stress analysis)",
            "Industry 4.0: Integration of IoT and Edge Computing",
            "Generative Design: Siemens NX AI optimization"
          ],
          audio_overview: "Host: Mechanical Engineering is changing. We are moving from manual drafting to AI-powered documentation. Guest: Exactly. Tools like NotebookLM and Otter.ai are digesting syllabi and live lectures in real-time. Host: And production? Guest: CNC machining and lean manufacturing are being revolutionized by Mindgrasp AI, which summarizes expert lessons from YouTube. We are seeing a shift where Industry 4.0 meets Generative Design.",
          study_guide: "# Technical Production Study Guide\n\n## 1. AI-Powered Documentation\n- **NotebookLM**: Upload PDFs for structured summaries of Integrated Manufacturing.\n- **Otter.ai**: Capture live lecture principles into searchable text.\n- **Turbo AI**: Transform technical videos into editable notes.\n\n## 2. Manufacturing Strategy\nFocus on 'Industry 4.0', 'Additive Manufacturing', and 'Robotics'. CNC machining processes use tool wear monitoring and G-code automation.\n\n## 3. Tool Stack Summary\n| Task | Tool | Benefit |\n|---|---|---|\n| Notes | NoteGPT | Summarization |\n| Simulated Labs | SimScale | AI-guided validation |\n| Study Aids | MechiAI | Interview prep |",
          video_prompts: [
            "A 3D explainer of a CNC spindle operating at high RPM, showing material removal and chip formation in macroscopic detail.",
            "Visualizing the heat gradient across a titanium component during high-feed milling using thermal mapping.",
            "An animation showing generative design algorithms iteratively optimizing a machine bracket for structural integrity."
          ],
          quiz: [
            {q: "What AI tool is best for converting technical lecture audio to searchable notes?", a: "Otter.ai"},
            {q: "Which tool would you use for AI-guided stress/strain and thermal design validation?", a: "SimScale or Ansys AI"},
            {q: "What is the primary benefit of Siemens NX AI in mechanical engineering?", a: "Generative design and automated optimization for production."}
          ]
        },
        resources: [
          {type: "video", url: "https://youtu.be/Lu76Ua2AR4w", desc: "Mechanical Engineering - Made Easy"},
          {type: "video", url: "https://youtu.be/dhyAjUuDEGs", desc: "Production Engineering Essentials"},
          {type: "video", url: "https://youtu.be/kDJ3QzTCgXM", desc: "CNC Machining Process"},
          {type: "video", url: "https://youtu.be/-53F9sxYKi4", desc: "Intro to Thermodynamics"}
        ]
      }
    }
  ]
};

export const RESOURCES = [
  { name: "PhET Interactive Simulations", url: "https://phet.colorado.edu/", desc: "Physics and Chemistry visuals" },
  { name: "Khan Academy Engineering", url: "https://www.khanacademy.org/science/electrical-engineering", desc: "Foundational EE concepts" },
  { name: "OpenStax University Physics", url: "https://openstax.org/details/books/university-physics-volume-1", desc: "Verified OER Textbooks" },
];

export const BADGES = [
  { id: 1, name: "Bridge Master", icon: "🏗️", earned: true, desc: "Completed Bridge Lab" },
  { id: 2, name: "Circuit Expert", icon: "⚡", earned: true, desc: "Mastered Logic Gates" },
  { id: 3, name: "Physics Wiz", icon: "🍎", earned: false, desc: "Projectiles 101" },
  { id: 4, name: "Data Titan", icon: "📊", earned: false, desc: "Log 10 Experiments" },
  { id: 5, name: "AI Partner", icon: "🧠", earned: true, desc: "Used Thinking Chat" },
  { id: 6, name: "Streak Champion", icon: "🔥", earned: false, desc: "30-day streak" },
];

export const NAV_ITEMS = [
  { id: "home", icon: Home, label: "Home" },
  { id: "subjects", icon: BookOpen, label: "Curriculum" },
  { id: "projects", icon: Microscope, label: "Projects" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "resources", icon: Zap, label: "Study Hub" },
  { id: "specialist", icon: ShieldCheck, label: "Specialist" },
  { id: "pricing", icon: Sparkles, label: "Upgrade" },
  { id: "community", icon: MessageSquare, label: "Forum" },
];
