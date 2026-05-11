import { Home, BookOpen, Microscope, BarChart3, MessageSquare, Zap, Flame, Trophy, ShieldCheck } from "lucide-react";

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
    { id: 2, title: "Kinetic Energy Lab", duration: "30 min", xp: 300, active: false }
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
    }
  ],
  structural: [
    { 
      id: 1, 
      title: "Bridge Stress Testing", 
      duration: "40 min", 
      xp: 500, 
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
  { id: "community", icon: MessageSquare, label: "Forum" },
];
