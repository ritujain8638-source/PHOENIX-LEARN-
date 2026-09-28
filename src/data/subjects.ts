// ─────────────────────────────────────────────
//  PhoenixLearn – Subjects Data
//  Full curriculum: Math, Physics, Chemistry,
//  Biology, Computer Science, English
// ─────────────────────────────────────────────

import type { Subject } from '@/types';

// ── Helper: build a minimal Topic shell ───────
function mkTopic(
  id: string,
  chapterId: string,
  name: string,
  order: number,
  videoId?: string,
  estimatedMinutes = 45
) {
  return {
    id,
    chapterId,
    name,
    order,
    theory: `# ${name}\n\nTheory content for **${name}** will be loaded here. This covers the essential concepts, derivations, and examples needed for CBSE and competitive exams.`,
    questions: [],
    flashcards: [],
    simulations: [],
    videoId: videoId ?? '',
    estimatedMinutes,
    isUnlocked: order === 1,
    completionPercent: 0,
    keyFormulas: [],
    keyPoints: [],
    prerequisites: [],
  };
}

// ── Helper: build a Chapter ───────────────────
function mkChapter(
  id: string,
  subjectId: string,
  name: string,
  order: number,
  description: string,
  topics: ReturnType<typeof mkTopic>[],
  estimatedHours = 8,
  learningOutcomes: string[] = []
) {
  return {
    id,
    subjectId,
    name,
    order,
    description,
    topics,
    isUnlocked: order === 1,
    completionPercent: 0,
    icon: '',
    estimatedHours,
    prerequisites: [],
    learningOutcomes,
  };
}

// ══════════════════════════════════════════════
//  1. MATHEMATICS
// ══════════════════════════════════════════════

const mathChapters = [
  mkChapter('math-ch1', 'mathematics', 'Sets, Relations & Functions', 1,
    'Foundation of modern mathematics — sets, Cartesian products, relations, and types of functions.',
    [
      mkTopic('math-ch1-t1', 'math-ch1', 'Sets and Set Operations', 1, 'dQw4w9WgXcQ', 40),
      mkTopic('math-ch1-t2', 'math-ch1', 'Venn Diagrams', 2, '', 30),
      mkTopic('math-ch1-t3', 'math-ch1', 'Relations: Domain, Range, Codomain', 3, '', 45),
      mkTopic('math-ch1-t4', 'math-ch1', 'Types of Functions', 4, '', 50),
      mkTopic('math-ch1-t5', 'math-ch1', 'Composition and Inverse Functions', 5, '', 55),
    ],
    6,
    ['Understand set operations and Venn diagrams', 'Classify relations and functions', 'Find composite and inverse functions']
  ),

  mkChapter('math-ch2', 'mathematics', 'Complex Numbers & Quadratic Equations', 2,
    'Extend the number system to complex plane, Argand diagram, De Moivre\'s theorem.',
    [
      mkTopic('math-ch2-t1', 'math-ch2', 'Complex Numbers: Introduction', 1, '', 40),
      mkTopic('math-ch2-t2', 'math-ch2', 'Argand Plane & Polar Form', 2, '', 45),
      mkTopic('math-ch2-t3', 'math-ch2', 'Modulus and Argument', 3, '', 40),
      mkTopic('math-ch2-t4', 'math-ch2', 'De Moivre\'s Theorem', 4, '', 50),
      mkTopic('math-ch2-t5', 'math-ch2', 'Quadratic Equations with Complex Roots', 5, '', 45),
      mkTopic('math-ch2-t6', 'math-ch2', 'Cube Roots of Unity', 6, '', 40),
    ],
    8,
    ['Perform arithmetic on complex numbers', 'Represent complex numbers geometrically', 'Apply De Moivre\'s theorem']
  ),

  mkChapter('math-ch3', 'mathematics', 'Sequences & Series', 3,
    'Arithmetic and geometric progressions, sum of series, and special sequences.',
    [
      mkTopic('math-ch3-t1', 'math-ch3', 'Arithmetic Progression (AP)', 1, '', 45),
      mkTopic('math-ch3-t2', 'math-ch3', 'Geometric Progression (GP)', 2, '', 45),
      mkTopic('math-ch3-t3', 'math-ch3', 'Harmonic Progression (HP)', 3, '', 35),
      mkTopic('math-ch3-t4', 'math-ch3', 'AM-GM-HM Inequality', 4, '', 40),
      mkTopic('math-ch3-t5', 'math-ch3', 'Sum of Special Series (Σn, Σn², Σn³)', 5, '', 50),
      mkTopic('math-ch3-t6', 'math-ch3', 'Infinite GP & Convergence', 6, '', 40),
    ],
    7,
    ['Find terms and sums of AP/GP/HP', 'Apply AM-GM inequality', 'Evaluate special series sums']
  ),

  mkChapter('math-ch4', 'mathematics', 'Permutations & Combinations', 4,
    'Fundamental principle of counting, permutations, combinations, and their applications.',
    [
      mkTopic('math-ch4-t1', 'math-ch4', 'Fundamental Principle of Counting', 1, '', 35),
      mkTopic('math-ch4-t2', 'math-ch4', 'Permutations (nPr)', 2, '', 45),
      mkTopic('math-ch4-t3', 'math-ch4', 'Combinations (nCr)', 3, '', 45),
      mkTopic('math-ch4-t4', 'math-ch4', 'Permutations with Repetition', 4, '', 40),
      mkTopic('math-ch4-t5', 'math-ch4', 'Combinations: Advanced Problems', 5, '', 50),
    ],
    6,
    ['Apply counting principles', 'Calculate permutations and combinations', 'Solve arrangement and selection problems']
  ),

  mkChapter('math-ch5', 'mathematics', 'Binomial Theorem', 5,
    'Binomial expansion, general term, middle term, and applications.',
    [
      mkTopic('math-ch5-t1', 'math-ch5', 'Binomial Theorem Statement', 1, '', 40),
      mkTopic('math-ch5-t2', 'math-ch5', 'General Term (Tr+1)', 2, '', 45),
      mkTopic('math-ch5-t3', 'math-ch5', 'Middle Term & Independent Term', 3, '', 45),
      mkTopic('math-ch5-t4', 'math-ch5', 'Properties of Binomial Coefficients', 4, '', 40),
      mkTopic('math-ch5-t5', 'math-ch5', 'Applications and Special Cases', 5, '', 50),
    ],
    6,
    ['Expand binomials using the theorem', 'Find general, middle, and specific terms', 'Prove properties of binomial coefficients']
  ),

  mkChapter('math-ch6', 'mathematics', 'Trigonometry', 6,
    'Trigonometric ratios, identities, equations, and inverse trigonometric functions.',
    [
      mkTopic('math-ch6-t1', 'math-ch6', 'Trigonometric Ratios & Identities', 1, '', 50),
      mkTopic('math-ch6-t2', 'math-ch6', 'Compound Angle Formulas', 2, '', 50),
      mkTopic('math-ch6-t3', 'math-ch6', 'Multiple & Sub-multiple Angles', 3, '', 45),
      mkTopic('math-ch6-t4', 'math-ch6', 'Trigonometric Equations', 4, '', 55),
      mkTopic('math-ch6-t5', 'math-ch6', 'Inverse Trigonometric Functions', 5, '', 55),
      mkTopic('math-ch6-t6', 'math-ch6', 'Properties of Triangles (Sine Rule, Cosine Rule)', 6, '', 50),
      mkTopic('math-ch6-t7', 'math-ch6', 'Heights and Distances', 7, '', 40),
    ],
    10,
    ['Prove and use trigonometric identities', 'Solve trigonometric equations', 'Apply inverse trig functions']
  ),

  mkChapter('math-ch7', 'mathematics', 'Limits, Continuity & Differentiability', 7,
    'Formal definition of limits, continuity at a point, and differentiability.',
    [
      mkTopic('math-ch7-t1', 'math-ch7', 'Limits: Concept and Evaluation', 1, '', 55),
      mkTopic('math-ch7-t2', 'math-ch7', 'Standard Limits', 2, '', 45),
      mkTopic('math-ch7-t3', 'math-ch7', 'Continuity at a Point', 3, '', 45),
      mkTopic('math-ch7-t4', 'math-ch7', 'Differentiability', 4, '', 50),
      mkTopic('math-ch7-t5', 'math-ch7', 'Differentiation Rules', 5, '', 50),
      mkTopic('math-ch7-t6', 'math-ch7', 'Chain Rule & Implicit Differentiation', 6, '', 55),
    ],
    10,
    ['Evaluate limits algebraically and using L\'Hôpital\'s rule', 'Test continuity and differentiability', 'Apply differentiation rules']
  ),

  mkChapter('math-ch8', 'mathematics', 'Applications of Derivatives', 8,
    'Tangents, normals, rate of change, maxima, minima, and monotonicity.',
    [
      mkTopic('math-ch8-t1', 'math-ch8', 'Rate of Change', 1, '', 40),
      mkTopic('math-ch8-t2', 'math-ch8', 'Tangents and Normals', 2, '', 45),
      mkTopic('math-ch8-t3', 'math-ch8', 'Increasing and Decreasing Functions', 3, '', 45),
      mkTopic('math-ch8-t4', 'math-ch8', 'Maxima and Minima', 4, '', 55),
      mkTopic('math-ch8-t5', 'math-ch8', 'Rolle\'s and Mean Value Theorems', 5, '', 45),
      mkTopic('math-ch8-t6', 'math-ch8', 'Approximations using Derivatives', 6, '', 35),
    ],
    9,
    ['Find tangents and normals to curves', 'Identify maxima, minima, and inflection points', 'Apply MVT and Rolle\'s theorem']
  ),

  mkChapter('math-ch9', 'mathematics', 'Integrals', 9,
    'Indefinite and definite integration, techniques, and applications.',
    [
      mkTopic('math-ch9-t1', 'math-ch9', 'Indefinite Integration: Basic Formulas', 1, '', 50),
      mkTopic('math-ch9-t2', 'math-ch9', 'Integration by Substitution', 2, '', 55),
      mkTopic('math-ch9-t3', 'math-ch9', 'Integration by Parts', 3, '', 55),
      mkTopic('math-ch9-t4', 'math-ch9', 'Integration by Partial Fractions', 4, '', 60),
      mkTopic('math-ch9-t5', 'math-ch9', 'Definite Integrals and Properties', 5, '', 60),
      mkTopic('math-ch9-t6', 'math-ch9', 'Area Under Curves', 6, '', 55),
      mkTopic('math-ch9-t7', 'math-ch9', 'Differential Equations: Introduction', 7, '', 60),
    ],
    12,
    ['Apply standard integration formulas', 'Use substitution, by parts, and partial fractions', 'Evaluate definite integrals and find areas']
  ),

  mkChapter('math-ch10', 'mathematics', 'Vectors & 3D Geometry', 10,
    'Vectors, dot/cross products, lines and planes in three dimensions.',
    [
      mkTopic('math-ch10-t1', 'math-ch10', 'Vectors: Types and Operations', 1, '', 45),
      mkTopic('math-ch10-t2', 'math-ch10', 'Dot Product (Scalar Product)', 2, '', 45),
      mkTopic('math-ch10-t3', 'math-ch10', 'Cross Product (Vector Product)', 3, '', 50),
      mkTopic('math-ch10-t4', 'math-ch10', 'Straight Lines in 3D', 4, '', 50),
      mkTopic('math-ch10-t5', 'math-ch10', 'Planes in 3D Space', 5, '', 55),
      mkTopic('math-ch10-t6', 'math-ch10', 'Angle Between Lines and Planes', 6, '', 45),
    ],
    9,
    ['Perform vector operations', 'Find dot and cross products with applications', 'Derive equations of lines and planes']
  ),

  mkChapter('math-ch11', 'mathematics', 'Matrices & Determinants', 11,
    'Matrix operations, determinants, inverse matrix, and Cramer\'s rule.',
    [
      mkTopic('math-ch11-t1', 'math-ch11', 'Matrices: Types and Operations', 1, '', 45),
      mkTopic('math-ch11-t2', 'math-ch11', 'Matrix Multiplication', 2, '', 50),
      mkTopic('math-ch11-t3', 'math-ch11', 'Determinants: 2×2 and 3×3', 3, '', 50),
      mkTopic('math-ch11-t4', 'math-ch11', 'Adjoint and Inverse of a Matrix', 4, '', 55),
      mkTopic('math-ch11-t5', 'math-ch11', 'System of Linear Equations (Cramer\'s Rule)', 5, '', 55),
    ],
    8,
    ['Perform matrix arithmetic', 'Calculate determinants and inverses', 'Solve systems of equations using matrices']
  ),

  mkChapter('math-ch12', 'mathematics', 'Probability', 12,
    'Classical and axiomatic probability, conditional probability, Bayes\' theorem, and distributions.',
    [
      mkTopic('math-ch12-t1', 'math-ch12', 'Basic Probability: Sample Space and Events', 1, '', 40),
      mkTopic('math-ch12-t2', 'math-ch12', 'Addition and Multiplication Theorems', 2, '', 45),
      mkTopic('math-ch12-t3', 'math-ch12', 'Conditional Probability', 3, '', 50),
      mkTopic('math-ch12-t4', 'math-ch12', 'Bayes\' Theorem', 4, '', 55),
      mkTopic('math-ch12-t5', 'math-ch12', 'Random Variables and Probability Distributions', 5, '', 55),
      mkTopic('math-ch12-t6', 'math-ch12', 'Binomial Distribution', 6, '', 50),
    ],
    9,
    ['Calculate probabilities using classical and axiomatic approaches', 'Apply Bayes\' theorem', 'Work with discrete probability distributions']
  ),
];

// ══════════════════════════════════════════════
//  2. PHYSICS
// ══════════════════════════════════════════════

const physicsChapters = [
  mkChapter('phy-ch1', 'physics', 'Units, Dimensions & Measurement', 1,
    'Physical quantities, SI units, dimensional analysis, significant figures, and errors.',
    [
      mkTopic('phy-ch1-t1', 'phy-ch1', 'Physical Quantities and SI Units', 1, '', 35),
      mkTopic('phy-ch1-t2', 'phy-ch1', 'Dimensional Analysis', 2, '', 45),
      mkTopic('phy-ch1-t3', 'phy-ch1', 'Significant Figures and Errors', 3, '', 40),
      mkTopic('phy-ch1-t4', 'phy-ch1', 'Vernier Caliper and Screw Gauge', 4, '', 35),
    ],
    5
  ),

  mkChapter('phy-ch2', 'physics', 'Kinematics', 2,
    'Motion in one and two dimensions, projectile motion, relative velocity.',
    [
      mkTopic('phy-ch2-t1', 'phy-ch2', 'Motion in a Straight Line', 1, '', 45),
      mkTopic('phy-ch2-t2', 'phy-ch2', 'Equations of Motion (SUVAT)', 2, '', 45),
      mkTopic('phy-ch2-t3', 'phy-ch2', 'Graphs of Motion (v-t, s-t)', 3, '', 40),
      mkTopic('phy-ch2-t4', 'phy-ch2', 'Projectile Motion', 4, '', 55),
      mkTopic('phy-ch2-t5', 'phy-ch2', 'Relative Velocity', 5, '', 45),
      mkTopic('phy-ch2-t6', 'phy-ch2', 'Circular Motion: Basics', 6, '', 50),
    ],
    8
  ),

  mkChapter('phy-ch3', 'physics', 'Laws of Motion', 3,
    'Newton\'s three laws, friction, tension, and applications to connected systems.',
    [
      mkTopic('phy-ch3-t1', 'phy-ch3', 'Newton\'s First Law & Inertia', 1, '', 40),
      mkTopic('phy-ch3-t2', 'phy-ch3', 'Newton\'s Second Law (F = ma)', 2, '', 45),
      mkTopic('phy-ch3-t3', 'phy-ch3', 'Newton\'s Third Law', 3, '', 35),
      mkTopic('phy-ch3-t4', 'phy-ch3', 'Friction: Static and Kinetic', 4, '', 50),
      mkTopic('phy-ch3-t5', 'phy-ch3', 'Connected Bodies and Pulleys', 5, '', 55),
      mkTopic('phy-ch3-t6', 'phy-ch3', 'Pseudo Force & Non-inertial Frames', 6, '', 50),
    ],
    9
  ),

  mkChapter('phy-ch4', 'physics', 'Work, Energy & Power', 4,
    'Work-energy theorem, potential and kinetic energy, conservation laws, collisions.',
    [
      mkTopic('phy-ch4-t1', 'phy-ch4', 'Work Done by a Force', 1, '', 40),
      mkTopic('phy-ch4-t2', 'phy-ch4', 'Kinetic and Potential Energy', 2, '', 45),
      mkTopic('phy-ch4-t3', 'phy-ch4', 'Conservation of Energy', 3, '', 50),
      mkTopic('phy-ch4-t4', 'phy-ch4', 'Power and Efficiency', 4, '', 40),
      mkTopic('phy-ch4-t5', 'phy-ch4', 'Elastic and Inelastic Collisions', 5, '', 55),
    ],
    7
  ),

  mkChapter('phy-ch5', 'physics', 'Thermodynamics', 5,
    'Zeroth, first, and second laws of thermodynamics, heat engines, entropy.',
    [
      mkTopic('phy-ch5-t1', 'phy-ch5', 'Thermal Equilibrium & Zeroth Law', 1, '', 35),
      mkTopic('phy-ch5-t2', 'phy-ch5', 'First Law of Thermodynamics', 2, '', 50),
      mkTopic('phy-ch5-t3', 'phy-ch5', 'Isothermal, Adiabatic, Isochoric, Isobaric Processes', 3, '', 60),
      mkTopic('phy-ch5-t4', 'phy-ch5', 'Second Law & Entropy', 4, '', 50),
      mkTopic('phy-ch5-t5', 'phy-ch5', 'Carnot Engine & Efficiency', 5, '', 55),
      mkTopic('phy-ch5-t6', 'phy-ch5', 'Kinetic Theory of Gases', 6, '', 55),
    ],
    9
  ),

  mkChapter('phy-ch6', 'physics', 'Waves & Sound', 6,
    'Transverse and longitudinal waves, superposition, Doppler effect, standing waves.',
    [
      mkTopic('phy-ch6-t1', 'phy-ch6', 'Wave Motion: Types and Parameters', 1, '', 45),
      mkTopic('phy-ch6-t2', 'phy-ch6', 'Speed of Sound in Different Media', 2, '', 40),
      mkTopic('phy-ch6-t3', 'phy-ch6', 'Superposition & Interference', 3, '', 50),
      mkTopic('phy-ch6-t4', 'phy-ch6', 'Standing Waves & Resonance', 4, '', 50),
      mkTopic('phy-ch6-t5', 'phy-ch6', 'Doppler Effect', 5, '', 45),
      mkTopic('phy-ch6-t6', 'phy-ch6', 'Beats', 6, '', 35),
    ],
    8
  ),

  mkChapter('phy-ch7', 'physics', 'Electrostatics', 7,
    'Coulomb\'s law, electric field, potential, capacitors, and dielectrics.',
    [
      mkTopic('phy-ch7-t1', 'phy-ch7', 'Coulomb\'s Law', 1, '', 45),
      mkTopic('phy-ch7-t2', 'phy-ch7', 'Electric Field and Field Lines', 2, '', 50),
      mkTopic('phy-ch7-t3', 'phy-ch7', 'Electric Potential and Potential Energy', 3, '', 55),
      mkTopic('phy-ch7-t4', 'phy-ch7', 'Gauss\'s Law and Applications', 4, '', 55),
      mkTopic('phy-ch7-t5', 'phy-ch7', 'Capacitors and Capacitance', 5, '', 55),
      mkTopic('phy-ch7-t6', 'phy-ch7', 'Dielectrics and Polarisation', 6, '', 45),
    ],
    10
  ),

  mkChapter('phy-ch8', 'physics', 'Current Electricity', 8,
    'Ohm\'s law, Kirchhoff\'s laws, Wheatstone bridge, and EMF of cells.',
    [
      mkTopic('phy-ch8-t1', 'phy-ch8', 'Electric Current and Drift Velocity', 1, '', 45),
      mkTopic('phy-ch8-t2', 'phy-ch8', 'Ohm\'s Law & Resistance', 2, '', 40),
      mkTopic('phy-ch8-t3', 'phy-ch8', 'Kirchhoff\'s Laws', 3, '', 55),
      mkTopic('phy-ch8-t4', 'phy-ch8', 'Wheatstone Bridge & Metre Bridge', 4, '', 50),
      mkTopic('phy-ch8-t5', 'phy-ch8', 'EMF and Internal Resistance', 5, '', 45),
      mkTopic('phy-ch8-t6', 'phy-ch8', 'Potentiometer', 6, '', 40),
    ],
    9
  ),

  mkChapter('phy-ch9', 'physics', 'Magnetism & Electromagnetic Induction', 9,
    'Biot-Savart law, Faraday\'s law, Lenz\'s law, transformers, and AC circuits.',
    [
      mkTopic('phy-ch9-t1', 'phy-ch9', 'Magnetic Force on Charges and Wires', 1, '', 50),
      mkTopic('phy-ch9-t2', 'phy-ch9', 'Biot-Savart Law & Ampere\'s Law', 2, '', 55),
      mkTopic('phy-ch9-t3', 'phy-ch9', 'Faraday\'s Law of Induction', 3, '', 50),
      mkTopic('phy-ch9-t4', 'phy-ch9', 'Lenz\'s Law & Self-Inductance', 4, '', 50),
      mkTopic('phy-ch9-t5', 'phy-ch9', 'AC Circuits: LCR Series', 5, '', 60),
      mkTopic('phy-ch9-t6', 'phy-ch9', 'Transformers and Power Transmission', 6, '', 45),
    ],
    10
  ),

  mkChapter('phy-ch10', 'physics', 'Optics', 10,
    'Reflection, refraction, lenses, mirrors, interference, diffraction, and polarisation.',
    [
      mkTopic('phy-ch10-t1', 'phy-ch10', 'Ray Optics: Reflection and Mirrors', 1, '', 50),
      mkTopic('phy-ch10-t2', 'phy-ch10', 'Refraction and Total Internal Reflection', 2, '', 50),
      mkTopic('phy-ch10-t3', 'phy-ch10', 'Lenses: Lens Formula and Power', 3, '', 50),
      mkTopic('phy-ch10-t4', 'phy-ch10', 'Optical Instruments (Microscope, Telescope)', 4, '', 50),
      mkTopic('phy-ch10-t5', 'phy-ch10', 'Wave Optics: Interference (YDSE)', 5, '', 60),
      mkTopic('phy-ch10-t6', 'phy-ch10', 'Diffraction and Polarisation', 6, '', 55),
    ],
    10
  ),

  mkChapter('phy-ch11', 'physics', 'Modern Physics', 11,
    'Photoelectric effect, atomic models, nuclear physics, and semiconductors.',
    [
      mkTopic('phy-ch11-t1', 'phy-ch11', 'Photoelectric Effect', 1, '', 50),
      mkTopic('phy-ch11-t2', 'phy-ch11', 'Bohr\'s Atomic Model', 2, '', 55),
      mkTopic('phy-ch11-t3', 'phy-ch11', 'de Broglie Wavelength & Uncertainty Principle', 3, '', 50),
      mkTopic('phy-ch11-t4', 'phy-ch11', 'Nuclear Physics: Radioactivity', 4, '', 55),
      mkTopic('phy-ch11-t5', 'phy-ch11', 'Nuclear Fission and Fusion', 5, '', 45),
      mkTopic('phy-ch11-t6', 'phy-ch11', 'Semiconductors and p-n Junctions', 6, '', 55),
    ],
    10
  ),
];

// ══════════════════════════════════════════════
//  3. CHEMISTRY
// ══════════════════════════════════════════════

const chemistryChapters = [
  mkChapter('chem-ch1', 'chemistry', 'Some Basic Concepts of Chemistry', 1,
    'Laws of chemical combination, mole concept, stoichiometry, and concentration expressions.',
    [
      mkTopic('chem-ch1-t1', 'chem-ch1', 'Laws of Chemical Combination', 1, '', 35),
      mkTopic('chem-ch1-t2', 'chem-ch1', 'Atomic Mass, Molecular Mass, Mole Concept', 2, '', 50),
      mkTopic('chem-ch1-t3', 'chem-ch1', 'Stoichiometry and Limiting Reagent', 3, '', 55),
      mkTopic('chem-ch1-t4', 'chem-ch1', 'Concentration Expressions (Molarity, Molality, etc.)', 4, '', 50),
    ],
    6
  ),

  mkChapter('chem-ch2', 'chemistry', 'Atomic Structure', 2,
    'Bohr model, quantum numbers, orbitals, electronic configuration, and periodic trends.',
    [
      mkTopic('chem-ch2-t1', 'chem-ch2', 'Atomic Models: Thomson, Rutherford, Bohr', 1, '', 45),
      mkTopic('chem-ch2-t2', 'chem-ch2', 'Quantum Numbers and Orbitals', 2, '', 55),
      mkTopic('chem-ch2-t3', 'chem-ch2', 'Electronic Configuration and Aufbau Principle', 3, '', 50),
      mkTopic('chem-ch2-t4', 'chem-ch2', 'Periodic Table and Periodic Trends', 4, '', 50),
    ],
    7
  ),

  mkChapter('chem-ch3', 'chemistry', 'Chemical Bonding & Molecular Structure', 3,
    'Ionic, covalent, and metallic bonding; VSEPR theory; hybridisation; molecular orbital theory.',
    [
      mkTopic('chem-ch3-t1', 'chem-ch3', 'Ionic Bonding and Lattice Energy', 1, '', 45),
      mkTopic('chem-ch3-t2', 'chem-ch3', 'Covalent Bonding and Lewis Structures', 2, '', 50),
      mkTopic('chem-ch3-t3', 'chem-ch3', 'VSEPR Theory and Molecular Geometry', 3, '', 55),
      mkTopic('chem-ch3-t4', 'chem-ch3', 'Hybridisation (sp, sp², sp³, sp³d, sp³d²)', 4, '', 55),
      mkTopic('chem-ch3-t5', 'chem-ch3', 'Molecular Orbital Theory (MOT)', 5, '', 60),
      mkTopic('chem-ch3-t6', 'chem-ch3', 'Hydrogen Bonding and van der Waals Forces', 6, '', 45),
    ],
    10
  ),

  mkChapter('chem-ch4', 'chemistry', 'Chemical Thermodynamics', 4,
    'First and second laws, enthalpy, entropy, Gibbs free energy, and Hess\'s law.',
    [
      mkTopic('chem-ch4-t1', 'chem-ch4', 'System, Surroundings, and State Functions', 1, '', 40),
      mkTopic('chem-ch4-t2', 'chem-ch4', 'First Law and Enthalpy Changes', 2, '', 50),
      mkTopic('chem-ch4-t3', 'chem-ch4', 'Hess\'s Law and Bond Enthalpies', 3, '', 50),
      mkTopic('chem-ch4-t4', 'chem-ch4', 'Entropy and Second Law', 4, '', 50),
      mkTopic('chem-ch4-t5', 'chem-ch4', 'Gibbs Free Energy and Spontaneity', 5, '', 55),
    ],
    8
  ),

  mkChapter('chem-ch5', 'chemistry', 'Equilibrium', 5,
    'Chemical equilibrium, Le Chatelier\'s principle, ionic equilibrium, and buffer solutions.',
    [
      mkTopic('chem-ch5-t1', 'chem-ch5', 'Law of Mass Action and Equilibrium Constant', 1, '', 50),
      mkTopic('chem-ch5-t2', 'chem-ch5', 'Le Chatelier\'s Principle', 2, '', 45),
      mkTopic('chem-ch5-t3', 'chem-ch5', 'Ionic Equilibrium and pH', 3, '', 55),
      mkTopic('chem-ch5-t4', 'chem-ch5', 'Solubility Product (Ksp)', 4, '', 50),
      mkTopic('chem-ch5-t5', 'chem-ch5', 'Buffer Solutions', 5, '', 50),
    ],
    8
  ),

  mkChapter('chem-ch6', 'chemistry', 'Electrochemistry', 6,
    'Galvanic cells, electrode potentials, Nernst equation, electrolysis, and corrosion.',
    [
      mkTopic('chem-ch6-t1', 'chem-ch6', 'Electrochemical Cells and EMF', 1, '', 50),
      mkTopic('chem-ch6-t2', 'chem-ch6', 'Standard Electrode Potentials', 2, '', 50),
      mkTopic('chem-ch6-t3', 'chem-ch6', 'Nernst Equation', 3, '', 55),
      mkTopic('chem-ch6-t4', 'chem-ch6', 'Electrolysis and Faraday\'s Laws', 4, '', 55),
      mkTopic('chem-ch6-t5', 'chem-ch6', 'Conductance and Kohlrausch\'s Law', 5, '', 50),
      mkTopic('chem-ch6-t6', 'chem-ch6', 'Corrosion and Prevention', 6, '', 35),
    ],
    9
  ),

  mkChapter('chem-ch7', 'chemistry', 'Organic Chemistry: Basics', 7,
    'IUPAC nomenclature, isomerism, reaction mechanisms, and functional groups.',
    [
      mkTopic('chem-ch7-t1', 'chem-ch7', 'IUPAC Nomenclature', 1, '', 55),
      mkTopic('chem-ch7-t2', 'chem-ch7', 'Isomerism: Structural and Stereoisomerism', 2, '', 60),
      mkTopic('chem-ch7-t3', 'chem-ch7', 'Reaction Mechanisms: SN1, SN2, E1, E2', 3, '', 65),
      mkTopic('chem-ch7-t4', 'chem-ch7', 'Inductive Effect, Resonance, Hyperconjugation', 4, '', 55),
      mkTopic('chem-ch7-t5', 'chem-ch7', 'Functional Groups and Their Properties', 5, '', 50),
    ],
    10
  ),

  mkChapter('chem-ch8', 'chemistry', 'Coordination Compounds', 8,
    'Werner\'s theory, ligands, crystal field theory, and isomerism in coordination compounds.',
    [
      mkTopic('chem-ch8-t1', 'chem-ch8', 'Werner\'s Theory and Terminology', 1, '', 45),
      mkTopic('chem-ch8-t2', 'chem-ch8', 'Nomenclature of Coordination Compounds', 2, '', 50),
      mkTopic('chem-ch8-t3', 'chem-ch8', 'Crystal Field Theory (CFT)', 3, '', 60),
      mkTopic('chem-ch8-t4', 'chem-ch8', 'Isomerism in Coordination Compounds', 4, '', 50),
      mkTopic('chem-ch8-t5', 'chem-ch8', 'Biological Importance and Applications', 5, '', 40),
    ],
    8
  ),
];

// ══════════════════════════════════════════════
//  4. BIOLOGY
// ══════════════════════════════════════════════

const biologyChapters = [
  mkChapter('bio-ch1', 'biology', 'Cell: The Unit of Life', 1,
    'Cell theory, prokaryotic and eukaryotic cells, organelles, and cell membrane.',
    [
      mkTopic('bio-ch1-t1', 'bio-ch1', 'Cell Theory and History', 1, '', 35),
      mkTopic('bio-ch1-t2', 'bio-ch1', 'Prokaryotic vs Eukaryotic Cells', 2, '', 45),
      mkTopic('bio-ch1-t3', 'bio-ch1', 'Cell Organelles and Their Functions', 3, '', 60),
      mkTopic('bio-ch1-t4', 'bio-ch1', 'Cell Membrane Structure (Fluid Mosaic Model)', 4, '', 50),
      mkTopic('bio-ch1-t5', 'bio-ch1', 'Cell Division: Mitosis and Meiosis', 5, '', 65),
    ],
    9
  ),

  mkChapter('bio-ch2', 'biology', 'Biomolecules', 2,
    'Carbohydrates, proteins, lipids, nucleic acids, and enzymes.',
    [
      mkTopic('bio-ch2-t1', 'bio-ch2', 'Carbohydrates: Types and Functions', 1, '', 45),
      mkTopic('bio-ch2-t2', 'bio-ch2', 'Proteins: Amino Acids and Structure', 2, '', 55),
      mkTopic('bio-ch2-t3', 'bio-ch2', 'Lipids and Their Biological Roles', 3, '', 40),
      mkTopic('bio-ch2-t4', 'bio-ch2', 'Nucleic Acids: DNA and RNA', 4, '', 60),
      mkTopic('bio-ch2-t5', 'bio-ch2', 'Enzymes: Structure, Mechanism, and Kinetics', 5, '', 60),
    ],
    9
  ),

  mkChapter('bio-ch3', 'biology', 'Genetics & Molecular Biology', 3,
    'Mendel\'s laws, DNA replication, transcription, translation, and gene expression.',
    [
      mkTopic('bio-ch3-t1', 'bio-ch3', 'Mendel\'s Laws of Inheritance', 1, '', 55),
      mkTopic('bio-ch3-t2', 'bio-ch3', 'Chromosomal Theory and Linkage', 2, '', 50),
      mkTopic('bio-ch3-t3', 'bio-ch3', 'DNA Structure and Replication', 3, '', 65),
      mkTopic('bio-ch3-t4', 'bio-ch3', 'Transcription and Translation (Central Dogma)', 4, '', 65),
      mkTopic('bio-ch3-t5', 'bio-ch3', 'Gene Regulation and Operon Model', 5, '', 55),
      mkTopic('bio-ch3-t6', 'bio-ch3', 'Mutations and DNA Repair', 6, '', 50),
    ],
    10
  ),

  mkChapter('bio-ch4', 'biology', 'Plant Physiology', 4,
    'Photosynthesis, respiration in plants, mineral nutrition, and transport.',
    [
      mkTopic('bio-ch4-t1', 'bio-ch4', 'Photosynthesis: Light Reactions', 1, '', 60),
      mkTopic('bio-ch4-t2', 'bio-ch4', 'Calvin Cycle (Dark Reactions)', 2, '', 55),
      mkTopic('bio-ch4-t3', 'bio-ch4', 'Respiration in Plants', 3, '', 55),
      mkTopic('bio-ch4-t4', 'bio-ch4', 'Mineral Nutrition and Transport', 4, '', 45),
      mkTopic('bio-ch4-t5', 'bio-ch4', 'Plant Growth Hormones', 5, '', 50),
    ],
    8
  ),

  mkChapter('bio-ch5', 'biology', 'Human Physiology', 5,
    'Digestive, respiratory, circulatory, excretory, and nervous systems.',
    [
      mkTopic('bio-ch5-t1', 'bio-ch5', 'Digestive System', 1, '', 60),
      mkTopic('bio-ch5-t2', 'bio-ch5', 'Respiratory System and Gas Exchange', 2, '', 55),
      mkTopic('bio-ch5-t3', 'bio-ch5', 'Circulatory System and Heart', 3, '', 65),
      mkTopic('bio-ch5-t4', 'bio-ch5', 'Excretory System (Kidneys)', 4, '', 60),
      mkTopic('bio-ch5-t5', 'bio-ch5', 'Nervous System and Neural Coordination', 5, '', 65),
      mkTopic('bio-ch5-t6', 'bio-ch5', 'Endocrine System and Hormones', 6, '', 60),
    ],
    10
  ),

  mkChapter('bio-ch6', 'biology', 'Ecology & Environment', 6,
    'Ecosystem, food chains, biodiversity, environmental issues, and conservation.',
    [
      mkTopic('bio-ch6-t1', 'bio-ch6', 'Ecosystem: Structure and Function', 1, '', 50),
      mkTopic('bio-ch6-t2', 'bio-ch6', 'Food Chains, Food Webs, and Energy Flow', 2, '', 50),
      mkTopic('bio-ch6-t3', 'bio-ch6', 'Biogeochemical Cycles', 3, '', 50),
      mkTopic('bio-ch6-t4', 'bio-ch6', 'Biodiversity and Conservation', 4, '', 45),
      mkTopic('bio-ch6-t5', 'bio-ch6', 'Environmental Issues and Pollution', 5, '', 45),
    ],
    7
  ),
];

// ══════════════════════════════════════════════
//  5. COMPUTER SCIENCE / CODING
// ══════════════════════════════════════════════

const csChapters = [
  mkChapter('cs-ch1', 'cs', 'Python Programming Fundamentals', 1,
    'Syntax, data types, control flow, functions, and file handling in Python.',
    [
      mkTopic('cs-ch1-t1', 'cs-ch1', 'Introduction to Python & Setup', 1, '', 30),
      mkTopic('cs-ch1-t2', 'cs-ch1', 'Variables, Data Types, and Operators', 2, '', 45),
      mkTopic('cs-ch1-t3', 'cs-ch1', 'Control Flow: if-else and Loops', 3, '', 50),
      mkTopic('cs-ch1-t4', 'cs-ch1', 'Functions and Recursion', 4, '', 55),
      mkTopic('cs-ch1-t5', 'cs-ch1', 'Lists, Tuples, Dictionaries, and Sets', 5, '', 60),
      mkTopic('cs-ch1-t6', 'cs-ch1', 'File Handling and Exceptions', 6, '', 50),
    ],
    8
  ),

  mkChapter('cs-ch2', 'cs', 'Object-Oriented Programming (OOP)', 2,
    'Classes, objects, inheritance, polymorphism, encapsulation, and abstraction.',
    [
      mkTopic('cs-ch2-t1', 'cs-ch2', 'Classes and Objects', 1, '', 50),
      mkTopic('cs-ch2-t2', 'cs-ch2', 'Constructors and Destructors', 2, '', 45),
      mkTopic('cs-ch2-t3', 'cs-ch2', 'Inheritance and Method Overriding', 3, '', 55),
      mkTopic('cs-ch2-t4', 'cs-ch2', 'Polymorphism and Duck Typing', 4, '', 50),
      mkTopic('cs-ch2-t5', 'cs-ch2', 'Encapsulation and Abstraction', 5, '', 45),
    ],
    7
  ),

  mkChapter('cs-ch3', 'cs', 'Data Structures', 3,
    'Arrays, linked lists, stacks, queues, trees, and graphs — theory and implementation.',
    [
      mkTopic('cs-ch3-t1', 'cs-ch3', 'Arrays and Strings', 1, '', 50),
      mkTopic('cs-ch3-t2', 'cs-ch3', 'Linked Lists (Singly, Doubly, Circular)', 2, '', 60),
      mkTopic('cs-ch3-t3', 'cs-ch3', 'Stacks and Queues', 3, '', 55),
      mkTopic('cs-ch3-t4', 'cs-ch3', 'Trees: BST, AVL, and Heaps', 4, '', 65),
      mkTopic('cs-ch3-t5', 'cs-ch3', 'Graphs: BFS, DFS, and Shortest Path', 5, '', 70),
      mkTopic('cs-ch3-t6', 'cs-ch3', 'Hashing and Hash Tables', 6, '', 55),
    ],
    12
  ),

  mkChapter('cs-ch4', 'cs', 'Algorithms & Complexity', 4,
    'Sorting, searching, dynamic programming, greedy algorithms, and Big-O analysis.',
    [
      mkTopic('cs-ch4-t1', 'cs-ch4', 'Big-O Notation and Complexity Analysis', 1, '', 50),
      mkTopic('cs-ch4-t2', 'cs-ch4', 'Sorting Algorithms (Bubble, Merge, Quick, Heap)', 2, '', 65),
      mkTopic('cs-ch4-t3', 'cs-ch4', 'Searching: Binary Search and Variations', 3, '', 55),
      mkTopic('cs-ch4-t4', 'cs-ch4', 'Divide and Conquer', 4, '', 60),
      mkTopic('cs-ch4-t5', 'cs-ch4', 'Dynamic Programming (Memoisation & Tabulation)', 5, '', 75),
      mkTopic('cs-ch4-t6', 'cs-ch4', 'Greedy Algorithms', 6, '', 60),
    ],
    12
  ),

  mkChapter('cs-ch5', 'cs', 'Web Development Basics', 5,
    'HTML, CSS, JavaScript fundamentals, and introduction to React.',
    [
      mkTopic('cs-ch5-t1', 'cs-ch5', 'HTML5: Structure and Semantic Elements', 1, '', 45),
      mkTopic('cs-ch5-t2', 'cs-ch5', 'CSS3: Selectors, Box Model, Flexbox, Grid', 2, '', 60),
      mkTopic('cs-ch5-t3', 'cs-ch5', 'JavaScript: Basics and DOM Manipulation', 3, '', 65),
      mkTopic('cs-ch5-t4', 'cs-ch5', 'JavaScript: ES6+ and Async Programming', 4, '', 70),
      mkTopic('cs-ch5-t5', 'cs-ch5', 'React.js: Components and State', 5, '', 75),
    ],
    10
  ),

  mkChapter('cs-ch6', 'cs', 'Databases & SQL', 6,
    'Relational databases, SQL queries, normalization, and NoSQL introduction.',
    [
      mkTopic('cs-ch6-t1', 'cs-ch6', 'Introduction to Databases and RDBMS', 1, '', 40),
      mkTopic('cs-ch6-t2', 'cs-ch6', 'SQL: DDL, DML, and DQL Basics', 2, '', 55),
      mkTopic('cs-ch6-t3', 'cs-ch6', 'Joins, Subqueries, and Aggregations', 3, '', 65),
      mkTopic('cs-ch6-t4', 'cs-ch6', 'Database Normalisation (1NF, 2NF, 3NF)', 4, '', 55),
      mkTopic('cs-ch6-t5', 'cs-ch6', 'Introduction to NoSQL (MongoDB)', 5, '', 50),
    ],
    8
  ),

  mkChapter('cs-ch7', 'cs', 'Computer Networks & Security', 7,
    'OSI model, TCP/IP, protocols, cryptography, and cybersecurity basics.',
    [
      mkTopic('cs-ch7-t1', 'cs-ch7', 'OSI and TCP/IP Models', 1, '', 50),
      mkTopic('cs-ch7-t2', 'cs-ch7', 'IP Addressing and Subnetting', 2, '', 55),
      mkTopic('cs-ch7-t3', 'cs-ch7', 'HTTP, DNS, and Application Layer Protocols', 3, '', 50),
      mkTopic('cs-ch7-t4', 'cs-ch7', 'Cryptography and Encryption Basics', 4, '', 55),
      mkTopic('cs-ch7-t5', 'cs-ch7', 'Cybersecurity: Threats and Defence', 5, '', 50),
    ],
    8
  ),
];

// ══════════════════════════════════════════════
//  6. ENGLISH
// ══════════════════════════════════════════════

const englishChapters = [
  mkChapter('eng-ch1', 'english', 'Reading Comprehension', 1,
    'Strategies for reading passages, identifying main ideas, and answering questions.',
    [
      mkTopic('eng-ch1-t1', 'eng-ch1', 'Identifying Main Idea and Theme', 1, '', 35),
      mkTopic('eng-ch1-t2', 'eng-ch1', 'Inference and Critical Reading', 2, '', 40),
      mkTopic('eng-ch1-t3', 'eng-ch1', 'Vocabulary in Context', 3, '', 35),
      mkTopic('eng-ch1-t4', 'eng-ch1', 'Skimming and Scanning Techniques', 4, '', 30),
    ],
    5
  ),

  mkChapter('eng-ch2', 'english', 'Grammar & Usage', 2,
    'Parts of speech, tenses, voice, narration, and sentence correction.',
    [
      mkTopic('eng-ch2-t1', 'eng-ch2', 'Parts of Speech', 1, '', 40),
      mkTopic('eng-ch2-t2', 'eng-ch2', 'Tenses and Aspect', 2, '', 50),
      mkTopic('eng-ch2-t3', 'eng-ch2', 'Active and Passive Voice', 3, '', 45),
      mkTopic('eng-ch2-t4', 'eng-ch2', 'Direct and Indirect Speech', 4, '', 45),
      mkTopic('eng-ch2-t5', 'eng-ch2', 'Sentence Transformation and Correction', 5, '', 50),
    ],
    7
  ),

  mkChapter('eng-ch3', 'english', 'Writing Skills', 3,
    'Essay, letter, report, notice, and article writing with structured approach.',
    [
      mkTopic('eng-ch3-t1', 'eng-ch3', 'Essay Writing (Formal & Informal)', 1, '', 55),
      mkTopic('eng-ch3-t2', 'eng-ch3', 'Letter Writing (Formal & Informal)', 2, '', 50),
      mkTopic('eng-ch3-t3', 'eng-ch3', 'Notice and Poster Writing', 3, '', 40),
      mkTopic('eng-ch3-t4', 'eng-ch3', 'Report and Article Writing', 4, '', 50),
      mkTopic('eng-ch3-t5', 'eng-ch3', 'Speech and Debate Writing', 5, '', 45),
    ],
    7
  ),

  mkChapter('eng-ch4', 'english', 'Literature: Prose', 4,
    'Analysis of NCERT prose chapters from Flamingo, Hornbill, and Vistas.',
    [
      mkTopic('eng-ch4-t1', 'eng-ch4', 'The Last Lesson (Alphonse Daudet)', 1, '', 45),
      mkTopic('eng-ch4-t2', 'eng-ch4', 'Lost Spring', 2, '', 45),
      mkTopic('eng-ch4-t3', 'eng-ch4', 'Deep Water', 3, '', 40),
      mkTopic('eng-ch4-t4', 'eng-ch4', 'Rattrap', 4, '', 40),
      mkTopic('eng-ch4-t5', 'eng-ch4', 'Indigo', 5, '', 45),
      mkTopic('eng-ch4-t6', 'eng-ch4', 'Poets and Pancakes', 6, '', 40),
    ],
    6
  ),

  mkChapter('eng-ch5', 'english', 'Literature: Poetry', 5,
    'Poem analysis, literary devices, and theme discussion from NCERT syllabi.',
    [
      mkTopic('eng-ch5-t1', 'eng-ch5', 'My Mother at Sixty-six (Kamala Das)', 1, '', 35),
      mkTopic('eng-ch5-t2', 'eng-ch5', 'An Elementary School Classroom in a Slum', 2, '', 40),
      mkTopic('eng-ch5-t3', 'eng-ch5', 'A Thing of Beauty (John Keats)', 3, '', 35),
      mkTopic('eng-ch5-t4', 'eng-ch5', 'A Roadside Stand', 4, '', 35),
      mkTopic('eng-ch5-t5', 'eng-ch5', 'Aunt Jennifer\'s Tigers', 5, '', 35),
    ],
    5
  ),

  mkChapter('eng-ch6', 'english', 'Vocabulary & Idioms', 6,
    'Word roots, synonyms, antonyms, idioms, phrases, and one-word substitution.',
    [
      mkTopic('eng-ch6-t1', 'eng-ch6', 'Synonyms and Antonyms', 1, '', 35),
      mkTopic('eng-ch6-t2', 'eng-ch6', 'Idioms and Phrases', 2, '', 45),
      mkTopic('eng-ch6-t3', 'eng-ch6', 'One-word Substitution', 3, '', 35),
      mkTopic('eng-ch6-t4', 'eng-ch6', 'Word Roots, Prefixes, and Suffixes', 4, '', 40),
    ],
    5
  ),
];

// ══════════════════════════════════════════════
//  SUBJECT DEFINITIONS
// ══════════════════════════════════════════════

export const SUBJECTS: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    code: 'MATH',
    icon: '📐',
    color: '#6366f1',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    description:
      'Master calculus, algebra, vectors, and probability — the language of science and JEE success.',
    chapters: mathChapters,
    difficulty: 'hard',
    marvelIntroTitle: 'Mathematics: The Infinity Stone of Intellect',
    marvelIntroQuote:
      '"Mathematics is not about numbers, equations, or algorithms — it is about understanding." — William Paul Thurston',
    totalTopics: mathChapters.reduce((acc, ch) => acc + ch.topics.length, 0),
    totalQuestions: 0,
    recommendedClass: ['11', '12', 'dropper'],
  },

  {
    id: 'physics',
    name: 'Physics',
    code: 'PHY',
    icon: '⚡',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    description:
      'From Newtonian mechanics to quantum physics — build intuition for the laws that govern the universe.',
    chapters: physicsChapters,
    difficulty: 'hard',
    marvelIntroTitle: 'Physics: The Arc Reactor of Science',
    marvelIntroQuote:
      '"Physics is the study of reality itself — and once you understand it, you can bend it." — Richard Feynman (paraphrased)',
    totalTopics: physicsChapters.reduce((acc, ch) => acc + ch.topics.length, 0),
    totalQuestions: 0,
    recommendedClass: ['11', '12', 'dropper'],
  },

  {
    id: 'chemistry',
    name: 'Chemistry',
    code: 'CHEM',
    icon: '🧪',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    description:
      'Unravel the mysteries of matter — from atomic structure to organic reactions and coordination compounds.',
    chapters: chemistryChapters,
    difficulty: 'medium',
    marvelIntroTitle: 'Chemistry: The Vibranium of Natural Science',
    marvelIntroQuote:
      '"Chemistry is the science of transformation. Every reaction is a new beginning."',
    totalTopics: chemistryChapters.reduce((acc, ch) => acc + ch.topics.length, 0),
    totalQuestions: 0,
    recommendedClass: ['11', '12', 'dropper'],
  },

  {
    id: 'biology',
    name: 'Biology',
    code: 'BIO',
    icon: '🧬',
    color: '#84cc16',
    gradient: 'linear-gradient(135deg, #84cc16 0%, #22c55e 100%)',
    description:
      'Explore the science of life — from DNA to ecosystems, from cells to human physiology.',
    chapters: biologyChapters,
    difficulty: 'medium',
    marvelIntroTitle: 'Biology: The Super-Serum of Natural Sciences',
    marvelIntroQuote:
      '"Nothing in biology makes sense except in the light of evolution." — Theodosius Dobzhansky',
    totalTopics: biologyChapters.reduce((acc, ch) => acc + ch.topics.length, 0),
    totalQuestions: 0,
    recommendedClass: ['11', '12', 'dropper'],
  },

  {
    id: 'cs',
    name: 'Computer Science',
    code: 'CS',
    icon: '💻',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    description:
      'Code, create, and solve — from Python basics to DSA, web development, and databases.',
    chapters: csChapters,
    difficulty: 'medium',
    marvelIntroTitle: 'Computer Science: The Jarvis of Your Career',
    marvelIntroQuote:
      '"The best programs are written so that computing machines can perform them quickly and so that human beings can understand them clearly." — Donald Knuth',
    totalTopics: csChapters.reduce((acc, ch) => acc + ch.topics.length, 0),
    totalQuestions: 0,
    recommendedClass: ['9', '10', '11', '12'],
  },

  {
    id: 'english',
    name: 'English',
    code: 'ENG',
    icon: '📚',
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
    description:
      'Master reading, writing, grammar, and literature — the language of global opportunity.',
    chapters: englishChapters,
    difficulty: 'easy',
    marvelIntroTitle: 'English: The Infinity Gauntlet of Communication',
    marvelIntroQuote:
      '"One language sets you in a corridor for life. Two languages open every door along the way." — Frank Smith',
    totalTopics: englishChapters.reduce((acc, ch) => acc + ch.topics.length, 0),
    totalQuestions: 0,
    recommendedClass: ['9', '10', '11', '12'],
  },
];

// ── Lookup Helpers ────────────────────────────

/** Returns a Subject by its ID, or undefined. */
export function getSubjectById(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}

/** Returns all chapters for a subject. */
export function getChaptersBySubject(subjectId: string) {
  return getSubjectById(subjectId)?.chapters ?? [];
}

/** Returns a specific chapter by its ID. */
export function getChapterById(subjectId: string, chapterId: string) {
  return getChaptersBySubject(subjectId).find((c) => c.id === chapterId);
}

/** Returns a topic by its ID within a chapter. */
export function getTopicById(subjectId: string, chapterId: string, topicId: string) {
  return getChapterById(subjectId, chapterId)?.topics.find((t) => t.id === topicId);
}

/** Returns all subjects as a map keyed by ID. */
export const SUBJECT_MAP: Record<string, Subject> = Object.fromEntries(
  SUBJECTS.map((s) => [s.id, s])
);

export default SUBJECTS;
