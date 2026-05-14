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
  { 
    id: "chemical", 
    name: "Chemical Eng.", 
    icon: "🧪", 
    desc: "Reaction Kinetics & Thermodynamics",
    topics: ["Stoichiometry", "Fluid Flow", "Heat Exchange"]
  },
  { 
    id: "aerospace", 
    name: "Aerospace Eng.", 
    icon: "🚀", 
    desc: "Aerodynamics & Propulsion",
    topics: ["Lift", "Drag", "Rocketry", "Orbital Mechanics"]
  },
];

export const LAB_CATALOG = [
  // Physics (Labs 1-10)
  { id: "phys_001", name: "Virtual Ballistics Range", category: "physics", type: "physics" },
  { id: "phys_002", name: "Kinetic Energy Analyzer", category: "physics", type: "physics" },
  { id: "phys_003", name: "PE to KE Conversion", category: "physics", type: "ramp" },
  { id: "phys_004", name: "Newtonian Dynamics Analyzer", category: "physics", type: "physics" },
  { id: "phys_005", name: "Simple Harmonic Motion Lab", category: "physics", type: "physics" },
  { id: "phys_006", name: "Wave Interference Sandbox", category: "physics", type: "physics" },
  { id: "phys_007", name: "Electromagnetic Induction Coil", category: "physics", type: "physics" },
  { id: "phys_008", name: "Optical Refraction Bench", category: "physics", type: "physics" },
  { id: "phys_009", name: "Centripetal Force Rotor", category: "physics", type: "physics" },
  { id: "phys_010", name: "Torque & Equilibrium Beam", category: "physics", type: "physics" },
  
  // Electrical (Labs 11-20)
  { id: "ee_001", name: "Digital Logic Explorer", category: "ee", type: "ee" },
  { id: "ee_002", name: "S-Domain Solver & Op-Amp Design", category: "ee", type: "eecircuit" },
  { id: "ee_003", name: "Ohm's Law Fundamentals", category: "ee", type: "ee" },
  { id: "ee_004", name: "Transistor Characteristic Lab", category: "ee", type: "eecircuit" },
  { id: "ee_005", name: "Filter Network Analysis", category: "ee", type: "eecircuit" },
  { id: "ee_006", name: "Microcontroller IO Simulator", category: "ee", type: "ee" },
  { id: "ee_007", name: "Three-Phase Power Analyzer", category: "ee", type: "ee" },
  { id: "ee_008", name: "Signal Transformation (DFT/FFT)", category: "ee", type: "eecircuit" },
  { id: "ee_009", name: "Control Loop PID Tuner", category: "ee", type: "eecircuit" },
  { id: "ee_010", name: "Antenna Gain & Radiation", category: "ee", type: "ee" },

  // Civil/Structural (Labs 21-30)
  { id: "civil_001", name: "Automated Standards & Site Modeling", category: "structural", type: "structural" },
  { id: "bridge_001", name: "Loads & LSD Optimization", category: "structural", type: "bridge" },
  { id: "civil_003", name: "Borehole Ground Modeler", category: "structural", type: "structural" },
  { id: "civil_004", name: "Truss Strength Analyzer", category: "structural", type: "bridge" },
  { id: "civil_005", name: "Concrete Slump & Strength Lab", category: "structural", type: "structural" },
  { id: "civil_006", name: "Earthquake Simulation Table", category: "structural", type: "structural" },
  { id: "civil_007", name: "Hydraulic Canal Flow", category: "structural", type: "structural" },
  { id: "civil_008", name: "Steel Section Optimization", category: "structural", type: "structural" },
  { id: "civil_009", name: "Roadway Geometry Lab", category: "structural", type: "structural" },
  { id: "civil_010", name: "Pile Foundation Settlement", category: "structural", type: "structural" },

  // Mechanical (Labs 31-40)
  { id: "mech_001", name: "Intelligent Production Systems", category: "mechanical", type: "mechanical" },
  { id: "mech_002", name: "Thermodynamic Cycle Simulator", category: "mechanical", type: "mechanical" },
  { id: "mech_003", name: "CNC G-Code Generator", category: "mechanical", type: "mechanical" },
  { id: "mech_004", name: "Heat Exchanger Efficiency", category: "mechanical", type: "mechanical" },
  { id: "mech_005", name: "Gear Train Ratio Calculator", category: "mechanical", type: "mechanical" },
  { id: "mech_006", name: "Pneumatic Circuit Designer", category: "mechanical", type: "mechanical" },
  { id: "mech_007", name: "Combustion Engine Dynamics", category: "mechanical", type: "mechanical" },
  { id: "mech_008", name: "Robot Arm Kinematics", category: "mechanical", type: "mechanical" },
  { id: "mech_009", name: "Material Hardness Tester", category: "mechanical", type: "mechanical" },
  { id: "mech_010", name: "Vibration Analysis Bench", category: "mechanical", type: "mechanical" },

  // Bio (Labs 41-50)
  { id: "bio_001", name: "Cell Signaling and Transductions", category: "bio", type: "bio" },
  { id: "bio_002", name: "Programmable Genetic Circuits", category: "bio", type: "bio" },
  { id: "bio_003", name: "PCR Thermal Cycler Lab", category: "bio", type: "bio" },
  { id: "bio_004", name: "CRISPR Off-Target Auditor", category: "bio", type: "bio" },
  { id: "bio_005", name: "Protein Folding Sandbox", category: "bio", type: "bio" },
  { id: "bio_006", name: "Cell Membrane Permeability", category: "bio", type: "bio" },
  { id: "bio_007", name: "Bacterial Growth Kinetic Lab", category: "bio", type: "bio" },
  { id: "bio_008", name: "Enzyme Velocity Analyzer", category: "bio", type: "bio" },
  { id: "bio_009", name: "Metabolic Pathway Balancer", category: "bio", type: "bio" },
  { id: "bio_010", name: "Bio-Reactor Fluid Dynamics", category: "bio", type: "bio" },

  // Aerospace (Labs 51-55)
  { id: "aero_001", name: "Wind Tunnel Lift Analyzer", category: "aerospace", type: "physics" },
  { id: "fluid_001", name: "Bernoulli Flow Dynamics", category: "aerospace", type: "fluid" },
  { id: "aero_002", name: "Orbital Injection Simulator", category: "aerospace", type: "physics" },
  { id: "aero_003", name: "Rocket Engine ISP Bench", category: "aerospace", type: "physics" },
  { id: "aero_004", name: "Avionics Logic Debugger", category: "aerospace", type: "ee" },
  { id: "aero_005", name: "Composite Stress Mapping", category: "aerospace", type: "mechanical" },
  { id: "thermo_001", name: "Conductive Heat Transfer Lab", category: "mechanical", type: "thermo" },
  { id: "fluid_001", name: "Hydrodynamic Pressure Lab", category: "aerospace", type: "fluid" },
];

export const MODULES: Record<string, any[]> = {
  physics: [
    {
      id: 1,
      title: "Course Overview & Foundations",
      duration: "15 min",
      xp: 200,
      active: true,
      content: {
        lab_id: "phys_000",
        title: "Applied Physics: Mechanics, Waves, & Dynamics",
        ai_notes: {
          definition: "This section explores the bridge between fundamental physical laws and practical engineering, emphasizing real-world technology applications of movement, energy, and system response.",
          technical_breakdown: [
            "Mechanics & Dynamics",
            "Wave Propagation",
            "Thermodynamic Systems"
          ],
          study_guide: `# Applied Physics: Mechanics, Waves, & Dynamics

## 1. Core Learning Modules
- **Fundamental Mechanics**: A deep dive into classical mechanics, including Newton’s laws, rotational dynamics, and the conservation of energy and momentum.
- **Wave Mechanics & Optics**: Exploring wave propagation, interference, and diffraction. Practical applications in Laser Technology, Fiber Optics, and Optical Imaging.
- **Dynamics & Thermodynamics**: Analyzing systems in motion and thermal properties, essential for heat engines and energy transfer.
- **Materials Science & Crystallography**: Solid-state physics, crystal structures, and magnetic properties in modern engineering.

## 2. Specialized Applications
| Specialization | Focus Areas |
|---|---|
| **Nanotechnology** | Nanoscale mechanics and molecular electronics. |
| **Medical Physics** | Radiotherapy, diagnostic imaging, and bioengineering. |
| **Sustainable Energy** | Renewable energy harvesting and advanced storage. |
| **Computational Physics** | Numerical simulations and data analysis. |

## 3. Laboratory & Simulation
- **Experimental Physics**: Lab work focusing on modern optics, spectroscopy, and nuclear physics.
- **Methods & Simulation**: Utilizing computational tools for numerical simulations and industrial problem-solving.

## 4. Recommended Resources & Literature
- *Fundamentals of Physics* — Halliday, Resnick, and Walker.
- *University Physics* — Young and Freedman.
- *Schaum’s Outline of Applied Physics* — For practical problem-solving.

**Note**: Students are expected to integrate computational methods into their final projects to simulate real-world dynamic systems.`,
          quiz: [
            { q: "What is the focus of the 'Specialized Applications' section?", a: "Nanotechnology, Medical Physics, Sustainable Energy, and Computational Physics." },
            { q: "Which textbook is recommended for practical problem-solving?", a: "Schaum’s Outline of Applied Physics." }
          ]
        },
        resources: [
          { type: "link", url: "https://openstax.org/details/books/university-physics-volume-1", desc: "University Physics - Vol 1" }
        ]
      }
    },
    { 
      id: 2, 
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
      id: 3, 
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
      id: 4, 
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
    },
    { 
      id: 5, 
      title: "Newton's Second Law (F=ma)", 
      duration: "40 min", 
      xp: 600, 
      active: true, 
      labType: "physics",
      content: {
        lab_id: "phys_004",
        title: "Newtonian Dynamics Analyzer",
        ai_notes: {
          definition: "Deep dive into the relationship between Force, Mass, and Acceleration with integrated friction analysis.",
          formulas: ["F = ma", "F_net = F_app - F_f", "F_f = μ • m • g"],
          technical_breakdown: [
            "Friction dynamics",
            "Force-Velocity correlation",
            "Unit conversion (SI vs Imperial)"
          ],
          quiz: [
            { q: "What happens to acceleration if mass is doubled (constant force)?", a: "It is halved." },
            { q: "What is the net force if applied force equals friction?", a: "Zero." }
          ]
        },
        resources: [
          { type: "video", url: "https://www.youtube.com/watch?v=Zv9lJtf9_8U", desc: "Newton's Second Law Explanation" }
        ]
      }
    }
  ],
  ee: [
    {
      id: 1,
      title: "Course Overview & Foundations",
      duration: "20 min",
      xp: 250,
      active: true,
      content: {
        lab_id: "ee_000",
        title: "Electrical Engineering: Circuits & Signal Processing",
        ai_notes: {
          definition: "A comprehensive deep-dive into the technical heart of Electrical Engineering, bridging fundamental physical laws with modern signal processing, power generation, and automation.",
          technical_breakdown: [
            "Faraday's Law of Induction",
            "Circuit Theory & Hardware",
            "Digital Signal Processing (DSP)"
          ],
          study_guide: `# Electrical Engineering: Circuits & Signal Processing

## 1. Circuit Theory & Electronics
- **Circuit Analysis**: Mastery of DC/AC circuits using Ohm’s Law, Kirchhoff’s Laws, and transient analysis.
- **Semiconductor Electronics**: Device characteristics of diodes, transistors (BJTs/MOSFETs), and Op-Amp design.
- **Electromagnetics**: Maxwell’s equations, field theory, wave propagation, and transmission lines.

## 2. Digital Systems & Signal Processing
- **Signals & Systems**: Fourier analysis, Z-transforms, and frequency response for continuous and discrete signals.
- **Digital Logic Design**: Binary systems, Boolean algebra, and microprocessor architectures.
- **Computational Engineering**: MATLAB, Python, and C++ for engineering simulations.

## 3. Specialized Learning Paths
| Specialization | Key Focus Areas |
|---|---|
| **Power & Energy** | Renewable systems, power electronics, and grid protection. |
| **Communications** | Wireless systems, antenna theory, and fiber optics. |
| **Control Systems** | Robotics, industrial automation, and feedback loops. |
| **Biomedical** | Medical equipment design and bio-signal processing. |

## 4. Technical Foundations
- **Advanced Mathematics**: Calculus I-III, Linear Algebra, and Differential Equations.
- **Engineering Physics**: Core principles of electricity, magnetism, and thermodynamics.

## 5. Verified Resources
- **MIT OpenCourseWare**: Introduction to EECS I.
- **Engineers Canada**: Standardized Electrical Engineering Syllabus.
- **Khan Academy**: Circuit elements and signal analysis modules.
- **LinkedIn Learning**: PLC programming and motor controls.

**Note**: This course emphasizes both theoretical derivation and practical application for research and industrial roles.`,
          quiz: [
            { q: "Which law serves as the bridge between fundamental physics and EE in this course?", a: "Faraday’s Law of Induction." },
            { q: "What are the key computational tools mentioned for system simulations?", a: "MATLAB, Python, and C++." }
          ]
        },
        resources: [
          { type: "link", url: "https://ocw.mit.edu/courses/6-01sc-introduction-to-electrical-engineering-and-computer-science-i-spring-2011/", desc: "MIT OpenCourseWare - Intro to EECS I" },
          { type: "link", url: "https://engineerscanada.ca/regulatory-excellence/examination-syllabi/electrical-engineering-syllabus", desc: "Engineers Canada - EE Syllabus" }
        ]
      }
    },
    { 
      id: 2, 
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
      id: 3, 
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
      title: "Course Overview & Foundations",
      duration: "20 min",
      xp: 250,
      active: true,
      content: {
        lab_id: "civil_000",
        title: "Civil Engineering: Foundations & Specializations",
        ai_notes: {
          definition: "Civil Engineering programs provide foundational knowledge in mathematics, physics, and chemistry, specialized in structural, geotechnical, environmental, and transportation engineering.",
          technical_breakdown: [
            "Structural & Geotechnical Engineering",
            "Transportation & Infrastructure",
            "Water Resources & Construction Management"
          ],
          study_guide: `# Civil Engineering Curriculum Overview

## 1. Core Learning Pillars
- **Structural Engineering**: Study of steel, concrete, and timber design; structural analysis and dynamics.
- **Geotechnical Engineering**: Soil mechanics, rock engineering, foundation design, and engineering geology.
- **Transportation Engineering**: Planning, design, and operations of roads, highways, and traffic systems.
- **Water Resources/Environmental**: Hydrology, hydraulic structures, municipal services, potable water, and wastewater treatment.
- **Construction Engineering**: Project scheduling, estimating, site investigation, and material testing.

## 2. Technical Foundations
- **Foundational Science**: Mathematics (Calculus, Linear Algebra, Stats), Physics, and Chemistry.
- **Digital Modeling**: AutoCAD Civil 3D, Revit, and Structural Analysis software.
- **Project Management**: Site assessment and construction scheduling.

## 3. Recommended Resources
- **LinkedIn Learning**: Courses on AutoCAD Civil 3D, Revit, and structural analysis.
- **Coursera**: Introductory courses on site assessment and management.

**Note**: This course emphasizes foundational knowledge followed by specialized technical studies and real-world project management.`,
          quiz: [
            { q: "What is the primary focus of Geotechnical Engineering?", a: "Soil mechanics, foundation design, and engineering geology." },
            { q: "Which software is commonly used for 3D digital modeling in Civil?", a: "AutoCAD Civil 3D and Revit." }
          ]
        },
        resources: [
          { type: "link", url: "https://www.linkedin.com/learning/topics/civil-engineering", desc: "LinkedIn Learning - Civil Engineering" },
          { type: "link", url: "https://www.coursera.org/search?query=civil%20engineering", desc: "Coursera - Civil Engineering" }
        ]
      }
    },
    { 
      id: 2, 
      title: "Structural & Geotechnical AI", 
      duration: "45 min", 
      xp: 600, 
      active: true, 
      labType: "structural",
      content: {
        lab_id: "civil_001",
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
      id: 3,
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
    },
    {
      id: 4,
      title: "Infrastructure & Environmental Systems",
      duration: "40 min",
      xp: 650,
      active: true,
      labType: "structural",
      content: {
        lab_id: "civil_002",
        title: "Transportation & Water Management",
        ai_notes: {
          definition: "Exploration of transportation network planning and water resource management, including hydrology and wastewater systems.",
          technical_breakdown: [
            "Transportation: Traffic flow and highway geometry",
            "Hydrology: Rainwater runoff and pipe flow",
            "Environmental: Municipal water treatment cycles",
            "Construction: Scheduling and site testing"
          ],
          study_guide: `# Transportation, Water & Construction

## 1. Transportation Engineering
Focus on the planning, design, and operations of roads and high-capacity traffic systems. Key tools include AutoCAD Civil 3D for highway design.

## 2. Water Resources & Environmental
- **Hydrology**: Study of water movement and hydraulic structures.
- **Wastewater**: Treatment processes for municipal potable water and sewage.

## 3. Construction Engineering
Critical processes include project scheduling, estimating, site investigation, and material testing to ensure safety and compliance.`,
          quiz: [
            { q: "What does Hydrology study in Civil Engineering?", a: "The movement and distribution of water and hydraulic structures." },
            { q: "What is a key focus of Construction Engineering?", a: "Project scheduling, estimating, and material testing." }
          ]
        },
        resources: [
          { type: "link", url: "https://ocw.mit.edu/courses/1-001-introduction-to-civil-and-environmental-engineering-design-i-fall-2005/", desc: "MIT OCW - Intro to Civil & Environmental Design" }
        ]
      }
    }
  ],
  bio: [
    {
      id: 1,
      title: "Course Overview & Foundations",
      duration: "25 min",
      xp: 300,
      active: true,
      content: {
        lab_id: "bio_000",
        title: "Bio-Engineering: Cellular Mechanics & CRISPR",
        ai_notes: {
          definition: "Exploration of the intersection between molecular biology and mechanical engineering, focusing on physical forces governing cell behavior and genetic tools for reprogramming biological systems.",
          technical_breakdown: [
            "CRISPR-Cas9 & Gene Editing",
            "Cellular Biomechanics",
            "Synthetic Biology & Tissue Engineering"
          ],
          study_guide: `# Bio-Engineering Curriculum Overview

## 1. Molecular & Genetic Engineering
- **CRISPR-Cas9 & Gene Editing**: Site-specific genomic modification, synthetic biology, and molecular modeling.
- **Cell Culture**: Engineering cell lines for regenerative medicine.
- **Synthetic Biology**: Designing new biological parts and systems.

## 2. Biomechanics & Bioinstrumentation
- **Cellular Mechanics**: How cells sense and respond to mechanical loads and cytoskeleton physical properties.
- **Bioimaging & Biosensors**: Advanced imaging (MRI) and real-time biological signal monitoring.
- **Bio-instrumentation**: Medical devices interfacing with biological systems.

## 3. Biomaterials & Tissue Engineering
- **Biocompatibility**: Interaction between materials and human tissues (cytotoxicity, immune response).
- **Regenerative Medicine**: Using scaffolds and engineered cells to repair tissues.
- **Solid-State Properties**: Materials science behind implants and prosthetics.

## 4. Bio-computing & Informatics
- **Computational Biology**: Modeling complex biological systems and predicting stimuli responses.
- **Bioinformatics**: Analyzing large genetic/protein datasets for therapeutic targets.

## 5. Foundations & Ethics
| Category | Topics Covered |
|---|---|
| **Fundamental Sciences** | Organic Chemistry, Physics, and Advanced Mathematics (Calculus, Stats). |
| **Regulatory Affairs** | FDA approval processes, biosafety protocols, and medical standards. |
| **Bioethics** | Moral implications of genetic engineering and human enhancement. |`,
          quiz: [
            { q: "What is the focus of cellular mechanics?", a: "How cells sense and respond to mechanical loads and physical properties of the cytoskeleton." },
            { q: "Which repair pathway is used for gene insertions with CRISPR?", a: "HDR (Homology-Directed Repair)." }
          ]
        },
        resources: [
          { type: "link", url: "https://www.nature.com/subjects/bioengineering", desc: "Nature - Bioengineering Research" },
          { type: "link", url: "https://syntheticbiology.org/", desc: "Synthetic Biology Community" }
        ]
      }
    },
    {
      id: 2,
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
      id: 3,
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
      title: "Course Overview & Foundations",
      duration: "25 min",
      xp: 300,
      active: true,
      content: {
        lab_id: "mech_000",
        title: "Mechanical Engineering: Production & Machine Design",
        ai_notes: {
          definition: "This course integrates classical mechanical principles with modern industrial systems, preparing students for advanced manufacturing and automated design.",
          technical_breakdown: [
            "Mechanical Core & Design Foundations",
            "Production & Manufacturing Systems",
            "Modern Tech & Industry 4.0"
          ],
          study_guide: `# Mechanical Engineering: Production & Machine Design

## 1. Mechanical Core & Design Foundations
- **Engineering Mechanics & Kinematics**: Study of forces, moments, and motion of machine elements.
- **Machine Design**: Principles of gears, bearings, shafts, and fasteners.
- **Materials Science**: Selection of metals, polymers, and composites.
- **Thermal & Fluid Systems**: Thermodynamics, Heat Transfer, and Fluid Mechanics.

## 2. Production & Manufacturing Systems
- **Manufacturing Processes**: Machining, casting, and joining techniques.
- **Tool & Die Design**: Hardware for mass production and precision.
- **Production Planning & Control (PPC)**: Resource optimization and scheduling.
- **Quality Control**: Statistical methods and human-machine interaction.

## 3. Modern Technologies & Industry 4.0
| Technology | Focus Area |
|---|---|
| **CAM & Digital Twin** | Virtual modeling of production lines. |
| **Additive Manufacturing** | Industrial 3D printing and rapid prototyping. |
| **Mechatronics & Robotics** | Synergy of mechanics, electronics, and control. |
| **Industry 4.0** | IoT, smart sensors, and data-driven systems. |

## 4. Specialized Learning Paths
- **DUT/BSc**: Core technical subjects and production technology.
- **M.E./Master’s**: Hydraulic/pneumatic systems and advanced management.
- **Thermal Specialization**: I.C. engines and energy transfer.

## 5. Professional Standards & Resources
- **MSBTE K-Scheme**: Specialized diploma curricula.
- **UCEOU Framework**: Advanced research-focused manufacturing.
- **Ideal Gases & Steam**: Foundational thermal engineering lectures.`,
          quiz: [
            { q: "What is the focus of PPC in manufacturing?", a: "Optimization of resources, scheduling, and workflow to maximize output." },
            { q: "Which technology involves virtual modeling of production lines?", a: "CAM & Digital Twin." }
          ]
        },
        resources: [
          { type: "link", url: "https://www.scribd.com/document/961028708/DUT-GMP", desc: "DUT GMP Syllabus" },
          { type: "video", url: "https://www.youtube.com/watch?v=YOPaUBIfGw4", desc: "Thermal Engineering Fundamentals" }
        ]
      }
    },
    {
      id: 2,
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
    },
    {
      id: 3,
      title: "Heat Transfer & Thermodynamics",
      duration: "35 min",
      xp: 400,
      active: true,
      labType: "thermo",
      content: {
        lab_id: "thermo_001",
        title: "Conductive Heat Transfer Lab",
        ai_notes: {
          definition: "Analysis of heat energy transfer through solid materials via molecular vibration (Conduction).",
          formulas: ["q = -k * A * (dT/dx)", "R_th = L / (k * A)"],
          technical_breakdown: [
            "Fourier's Law applications",
            "Thermal conductivity (k) comparison",
            "Insulation efficiency in high-temp environments"
          ]
        },
        resources: [
          { type: "video", url: "https://youtu.be/Lu76Ua2AR4w", desc: "Heat Transfer Fundamentals" }
        ]
      }
    },
    {
      id: 4,
      title: "Pipe Flow & Bernoulli",
      duration: "40 min",
      xp: 450,
      active: true,
      labType: "fluid",
      content: {
        lab_id: "fluid_001",
        title: "Hydrodynamic Pressure Lab",
        ai_notes: {
          definition: "Deep dive into internal flows, Reynolds numbers, and pressure losses in plumbing systems.",
          formulas: ["Re = (ρvD)/μ", "hL = f(L/D)(v²/2g)"],
          technical_breakdown: [
            "Laminar vs Turbulent regimes",
            "Darcy-Weisbach head loss",
            "Bernoulli's Principle for pressure-velocity trade-off"
          ]
        },
        resources: [
          { type: "video", url: "https://youtu.be/V-IwuBEa0PE", desc: "Fluids in Engineering" }
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
