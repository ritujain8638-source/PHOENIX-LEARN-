import { Question } from '@/types';

export const QUESTIONS_DATA: Question[] = [
  // ─── MATHEMATICS (RD Sharma 9-12 & JEE level) ───────────────────
  {
    id: 'math-q1',
    subjectId: 'mathematics',
    chapterId: 'math-ch1',
    topicId: 'math-t1',
    text: 'Let $A = \\{x \\in \\mathbb{R} : x^2 - 5x + 6 = 0\\}$ and $B = \\{2, 3\\}$. What is the relationship between set $A$ and set $B$?',
    options: [
      '$A \\subset B$ but $A \\neq B$',
      '$B \\subset A$ but $B \\neq A$',
      '$A = B$',
      '$A \\cap B = \\emptyset$'
    ],
    correctAnswer: 2,
    explanation: 'Factoring $x^2 - 5x + 6 = 0$ gives $(x - 2)(x - 3) = 0$, so $x = 2$ or $x = 3$. Hence $A = \\{2, 3\\}$, which is identical to set $B$.',
    difficulty: 'easy',
    tags: ['Sets', 'RD Sharma Class 11', 'Algebra'],
    source: 'RD Sharma Class 11 - Chapter 1',
    type: 'mcq'
  },
  {
    id: 'math-q2',
    subjectId: 'mathematics',
    chapterId: 'math-ch2',
    topicId: 'math-t6',
    text: 'If $z = \\frac{1 + i\\sqrt{3}}{1 - i\\sqrt{3}}$, what is the principal argument $\\text{Arg}(z)$ in radians?',
    options: [
      '$\\frac{\\pi}{3}$',
      '$\\frac{2\\pi}{3}$',
      '$-\\frac{2\\pi}{3}$',
      '$\\frac{5\\pi}{6}$'
    ],
    correctAnswer: 1,
    explanation: 'Multiplying numerator and denominator by $(1 + i\\sqrt{3})$ gives $z = \\frac{(1 + i\\sqrt{3})^2}{1 + 3} = \\frac{1 + 2\\sqrt{3}i - 3}{4} = \\frac{-2 + 2\\sqrt{3}i}{4} = -\\frac{1}{2} + i\\frac{\\sqrt{3}}{2}$. In the second quadrant, $\\theta = \\pi - \\frac{\\pi}{3} = \\frac{2\\pi}{3}$.',
    difficulty: 'medium',
    tags: ['Complex Numbers', 'RD Sharma Class 11', 'Trigonometric Form'],
    source: 'RD Sharma Class 11 - Chapter 13',
    type: 'mcq'
  },
  {
    id: 'math-q3',
    subjectId: 'mathematics',
    chapterId: 'math-ch3',
    topicId: 'math-t9',
    text: 'If $\\alpha$ and $\\beta$ are the roots of $ax^2 + bx + c = 0$, what is the exact value of $\\frac{1}{\\alpha^2} + \\frac{1}{\\beta^2}$?',
    options: [
      '$\\frac{b^2 - 2ac}{c^2}$',
      '$\\frac{b^2 + 2ac}{c^2}$',
      '$\\frac{b^2 - 4ac}{a^2}$',
      '$\\frac{2ac - b^2}{a^2}$'
    ],
    correctAnswer: 0,
    explanation: 'Sum of roots $\\alpha + \\beta = -b/a$, product $\\alpha\\beta = c/a$. Thus $\\frac{1}{\\alpha^2} + \\frac{1}{\\beta^2} = \\frac{\\alpha^2 + \\beta^2}{(\\alpha\\beta)^2} = \\frac{(\\alpha+\\beta)^2 - 2\\alpha\\beta}{(\\alpha\\beta)^2} = \\frac{(-b/a)^2 - 2(c/a)}{(c/a)^2} = \\frac{b^2 - 2ac}{c^2}$.',
    difficulty: 'medium',
    tags: ['Quadratic Equations', 'RD Sharma Class 10 & 11', 'Symmetric Functions'],
    source: 'RD Sharma Class 10 - Chapter 8',
    type: 'mcq'
  },
  {
    id: 'math-q4',
    subjectId: 'mathematics',
    chapterId: 'math-ch6',
    topicId: 'math-t16',
    text: 'Evaluate the limit: $\\lim_{x \\to 0} \\frac{\\tan(x) - \\sin(x)}{x^3}$.',
    options: [
      '$0$',
      '$\\frac{1}{2}$',
      '$1$',
      '$\\frac{1}{3}$'
    ],
    correctAnswer: 1,
    explanation: 'Rewrite numerator as $\\tan(x)(1 - \\cos(x)) = \\frac{\\sin(x)}{\\cos(x)} \\cdot 2\\sin^2(x/2)$. Then $\\lim_{x\\to 0} \\left(\\frac{\\sin(x)}{x}\\right) \\cdot \\frac{1}{\\cos(x)} \\cdot \\frac{2\\sin^2(x/2)}{4(x/2)^2} = 1 \\cdot 1 \\cdot \\frac{2}{4} = \\frac{1}{2}$.',
    difficulty: 'hard',
    tags: ['Limits', 'RD Sharma Class 11/12', 'Calculus', 'JEE Main'],
    source: 'RD Sharma Class 11 - Limits & Derivatives',
    type: 'mcq'
  },
  {
    id: 'math-q5',
    subjectId: 'mathematics',
    chapterId: 'math-ch7',
    topicId: 'math-t19',
    text: '[JEE Advanced Level] Evaluate the definite integral: $I = \\int_{0}^{\\pi/2} \\frac{\\sqrt{\\sin x}}{\\sqrt{\\sin x} + \\sqrt{\\cos x}} \\, dx$.',
    options: [
      '$\\frac{\\pi}{2}$',
      '$\\frac{\\pi}{4}$',
      '$\\pi$',
      '$1$'
    ],
    correctAnswer: 1,
    explanation: 'Using the King property $\\int_a^b f(x)dx = \\int_a^b f(a+b-x)dx$: replacing $x$ with $\\frac{\\pi}{2}-x$ yields $I = \\int_{0}^{\\pi/2} \\frac{\\sqrt{\\cos x}}{\\sqrt{\\cos x} + \\sqrt{\\sin x}} dx$. Adding both gives $2I = \\int_{0}^{\\pi/2} 1 \\, dx = \\frac{\\pi}{2} \\implies I = \\frac{\\pi}{4}$.',
    difficulty: 'jee',
    tags: ['Definite Integration', 'JEE Advanced PYQ', 'RD Sharma Class 12'],
    source: 'RD Sharma Class 12 - Chapter 20 / JEE PYQ',
    type: 'mcq'
  },
  {
    id: 'math-q6',
    subjectId: 'mathematics',
    chapterId: 'math-ch5',
    topicId: 'math-t14',
    text: 'What is the minimum value of $f(\\theta) = 9\\tan^2\\theta + 4\\cot^2\\theta$ for $\\theta \\in (0, \\pi/2)$?',
    options: [
      '$6$',
      '$12$',
      '$13$',
      '$24$'
    ],
    correctAnswer: 1,
    explanation: 'By the AM-GM inequality on positive terms: $\\frac{9\\tan^2\\theta + 4\\cot^2\\theta}{2} \\ge \\sqrt{9\\tan^2\\theta \\cdot 4\\cot^2\\theta} = \\sqrt{36} = 6$. Therefore, $9\\tan^2\\theta + 4\\cot^2\\theta \\ge 12$. Equality holds when $9\\tan^2\\theta = 4\\cot^2\\theta \\implies \\tan^4\\theta = 4/9$.',
    difficulty: 'hard',
    tags: ['Trigonometry', 'AM-GM Inequality', 'JEE Main'],
    source: 'RD Sharma Class 11 - Trigonometric Functions',
    type: 'mcq'
  },

  // ─── PHYSICS (HC Verma / NCERT / JEE Level) ─────────────────────
  {
    id: 'phy-q1',
    subjectId: 'physics',
    chapterId: 'phy-ch1',
    topicId: 'phy-t2',
    text: 'A projectile is launched from ground level with speed $u$ at an angle $\\theta$ to the horizontal. If its maximum height equals its horizontal range, what is $\\tan \\theta$?',
    options: [
      '$1$',
      '$2$',
      '$4$',
      '$\\frac{1}{4}$'
    ],
    correctAnswer: 2,
    explanation: 'Maximum height $H = \\frac{u^2 \\sin^2 \\theta}{2g}$. Range $R = \\frac{2 u^2 \\sin \\theta \\cos \\theta}{g}$. Setting $H = R$: $\\frac{u^2 \\sin^2 \\theta}{2g} = \\frac{2 u^2 \\sin \\theta \\cos \\theta}{g} \\implies \\frac{\\sin \\theta}{2} = 2 \\cos \\theta \\implies \\tan \\theta = 4$.',
    difficulty: 'medium',
    tags: ['Kinematics', 'Projectile Motion', 'HC Verma Vol 1'],
    source: 'HC Verma - Concepts of Physics Vol 1 Ch 3',
    type: 'mcq'
  },
  {
    id: 'phy-q2',
    subjectId: 'physics',
    chapterId: 'phy-ch4',
    topicId: 'phy-t6',
    text: 'A simple pendulum has time period $T$ on Earth. If the length of the pendulum is doubled and it is taken to a planet where gravity is half of Earth ($g\' = g/2$), what is the new time period?',
    options: [
      '$T$',
      '$2T$',
      '$\\sqrt{2}T$',
      '$4T$'
    ],
    correctAnswer: 1,
    explanation: 'Period $T = 2\\pi \\sqrt{\\frac{L}{g}}$. With $L\' = 2L$ and $g\' = g/2$, the ratio inside the square root becomes $\\frac{2L}{g/2} = \\frac{4L}{g}$. Therefore $T\' = 2\\pi \\sqrt{\\frac{4L}{g}} = 2 \\left(2\\pi \\sqrt{\\frac{L}{g}}\\right) = 2T$.',
    difficulty: 'easy',
    tags: ['SHM', 'Oscillations', 'NCERT Class 11'],
    source: 'NCERT Class 11 Physics - Chapter 14',
    type: 'mcq'
  },
  {
    id: 'phy-q3',
    subjectId: 'physics',
    chapterId: 'phy-ch2',
    topicId: 'phy-t4',
    text: '[JEE Main Level] A block of mass $m = 2\\text{ kg}$ rests on a rough horizontal surface with coefficient of static friction $\\mu_s = 0.5$. A force $F = 6\\text{ N}$ is applied horizontally. What is the frictional force exerted by the surface on the block? ($g = 9.8\\text{ m/s}^2$)',
    options: [
      '$9.8\\text{ N}$',
      '$6\\text{ N}$',
      '$0\\text{ N}$',
      '$4.9\\text{ N}$'
    ],
    correctAnswer: 1,
    explanation: 'Maximum static friction $f_{s,\\text{max}} = \\mu_s N = 0.5 \\times 2 \\times 9.8 = 9.8\\text{ N}$. Since the applied force $F = 6\\text{ N} < f_{s,\\text{max}}$, the block does not slip. Static friction adjusts itself to oppose applied force, so $f = 6\\text{ N}$.',
    difficulty: 'hard',
    tags: ['Laws of Motion', 'Friction', 'Conceptual Trap', 'JEE Main'],
    source: 'HC Verma - Chapter 6 Friction',
    type: 'mcq'
  },

  // ─── CHEMISTRY (NCERT / OP Tandon / JEE Level) ──────────────────
  {
    id: 'chem-q1',
    subjectId: 'chemistry',
    chapterId: 'chem-ch2',
    topicId: 'chem-t3',
    text: 'What are the possible values of the magnetic quantum number $m_l$ for an electron in a $3d$ subshell?',
    options: [
      '$-1, 0, +1$',
      '$-2, -1, 0, +1, +2$',
      '$0, 1, 2$',
      '$-3, -2, -1, 0, +1, +2, +3$'
    ],
    correctAnswer: 1,
    explanation: 'For a $d$ orbital, the azimuthal quantum number is $l = 2$. The magnetic quantum number $m_l$ ranges from $-l$ to $+l$, resulting in 5 values: $-2, -1, 0, +1, +2$.',
    difficulty: 'easy',
    tags: ['Structure of Atom', 'Quantum Numbers', 'NCERT Class 11'],
    source: 'NCERT Class 11 Chemistry - Chapter 2',
    type: 'mcq'
  },
  {
    id: 'chem-q2',
    subjectId: 'chemistry',
    chapterId: 'chem-ch1',
    topicId: 'chem-t1',
    text: 'How many molecules of water are present in $1.8\\text{ g}$ of water? ($N_A = 6.022 \\times 10^{23}$)',
    options: [
      '$6.022 \\times 10^{23}$',
      '$6.022 \\times 10^{22}$',
      '$3.011 \\times 10^{22}$',
      '$1.8 \\times 10^{23}$'
    ],
    correctAnswer: 1,
    explanation: 'Molar mass of $H_2O = 18\\text{ g/mol}$. Number of moles $n = 1.8 / 18 = 0.1\\text{ mol}$. Total molecules $= n \\times N_A = 0.1 \\times 6.022 \\times 10^{23} = 6.022 \\times 10^{22}$.',
    difficulty: 'easy',
    tags: ['Mole Concept', 'Basic Concepts', 'Class 11 Chemistry'],
    source: 'NCERT Class 11 Chemistry - Chapter 1',
    type: 'mcq'
  },

  // ─── COMPUTER SCIENCE / CODING ──────────────────────────────────
  {
    id: 'cs-q1',
    subjectId: 'computer-science',
    chapterId: 'cs-ch1',
    topicId: 'cs-t1',
    text: 'What will be the output of the following Python expression?\n```python\nprint(bool([]) == bool([0]))\n```',
    options: [
      '`True`',
      '`False`',
      '`TypeError`',
      '`None`'
    ],
    correctAnswer: 1,
    explanation: 'An empty list `[]` evaluates to falsy (`bool([])` is `False`). A list with one element `[0]` is non-empty, so it evaluates to truthy (`bool([0])` is `True`). Therefore, `False == True` evaluates to `False`.',
    difficulty: 'medium',
    tags: ['Python', 'Data Types', 'Truthiness', 'Class 11/12 CS'],
    source: 'CBSE Computer Science Class 11 / Python Spec',
    type: 'mcq'
  },
  {
    id: 'cs-q2',
    subjectId: 'computer-science',
    chapterId: 'cs-ch2',
    topicId: 'cs-t3',
    text: 'What is the worst-case time complexity of QuickSort when using the deterministic last element as the pivot?',
    options: [
      '$O(n \\log n)$',
      '$O(n)$',
      '$O(n^2)$',
      '$O(\\log n)$'
    ],
    correctAnswer: 2,
    explanation: 'In the worst case (e.g., when the input array is already sorted or reverse sorted), every partitioning step yields subarrays of size $0$ and $n-1$, resulting in the recurrence $T(n) = T(n-1) + O(n) = O(n^2)$. Randomized pivot selection mitigates this to expected $O(n \\log n)$.',
    difficulty: 'hard',
    tags: ['Algorithms', 'Sorting', 'Time Complexity', 'DSA'],
    source: 'Classic DSA / Class 12 CS',
    type: 'mcq'
  }
];

export function getQuestionsBySubject(subjectId: string): Question[] {
  return QUESTIONS_DATA.filter(q => q.subjectId === subjectId);
}

export function getQuestionsByDifficulty(difficulty: string): Question[] {
  return QUESTIONS_DATA.filter(q => q.difficulty === difficulty);
}

export function getQuestionsByTopic(topicId: string): Question[] {
  return QUESTIONS_DATA.filter(q => q.topicId === topicId);
}
