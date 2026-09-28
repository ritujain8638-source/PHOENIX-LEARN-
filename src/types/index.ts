// ─────────────────────────────────────────────
//  PhoenixLearn – Comprehensive TypeScript Types
// ─────────────────────────────────────────────

// ── User & Auth ───────────────────────────────

export type PhoenixPath =
  | 'warrior'
  | 'scholar'
  | 'explorer'
  | 'speedster'
  | 'perfectionist';

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'hi';
  dailyGoalMinutes: number;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  autoPlayVideos: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  highContrast: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'streak' | 'quiz' | 'subject' | 'social' | 'milestone';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  class: '9' | '10' | '11' | '12' | 'dropper' | 'other';
  subjects: string[];           // Array of subject IDs
  avatar: string;               // URL or emoji string
  streak: number;               // Current consecutive days
  totalXP: number;
  level: number;
  phoenixPath: PhoenixPath;
  badges: Badge[];
  joinedAt: Date;
  preferences: UserPreferences;
  referralCode?: string;
  referredBy?: string;
  isPremium: boolean;
  premiumExpiresAt?: Date;
}

// ── Subject & Curriculum ──────────────────────

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'jee';

export interface Simulation {
  id: string;
  topicId: string;
  title: string;
  description: string;
  type: 'interactive' | 'animation' | '3d' | 'graph';
  componentName: string;        // React component to render
  params?: Record<string, unknown>;
}

export interface FlashCard {
  id: string;
  topicId: string;
  front: string;                // Question / term
  back: string;                 // Answer / definition
  mastered: boolean;
  lastReviewed?: Date;
  reviewCount: number;
  nextReviewAt?: Date;          // Spaced-repetition date
  tags?: string[];
  imageUrl?: string;
}

export interface Question {
  id: string;
  topicId: string;
  subjectId: string;
  chapterId: string;
  text: string;
  options: string[];            // Always 4 options for MCQ
  correctAnswer: number;        // Index 0-3
  explanation: string;
  difficulty: DifficultyLevel;
  tags: string[];
  source: string;               // e.g. 'NCERT', 'JEE 2022', 'RD Sharma Ex 5.3'
  type: 'mcq' | 'numerical' | 'assertion-reason' | 'multi-correct';
  numericalAnswer?: number;
  tolerance?: number;           // ±tolerance for numerical
  imageUrl?: string;
  solutionSteps?: string[];
  timeEstimatedSeconds?: number;
}

export interface Topic {
  id: string;
  chapterId: string;
  name: string;
  order: number;
  theory: string;               // Markdown / MDX content
  questions: Question[];
  flashcards: FlashCard[];
  simulations: Simulation[];
  videoId?: string;             // YouTube video ID
  videoTitle?: string;
  estimatedMinutes: number;
  prerequisites?: string[];     // Topic IDs
  keyFormulas?: string[];
  keyPoints?: string[];
  isUnlocked: boolean;
  completionPercent: number;    // 0–100
}

export interface Chapter {
  id: string;
  subjectId: string;
  name: string;
  order: number;
  topics: Topic[];
  isUnlocked: boolean;
  completionPercent: number;    // 0–100
  description: string;
  icon?: string;
  estimatedHours: number;
  prerequisites?: string[];     // Chapter IDs
  learningOutcomes: string[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;                 // e.g. 'MATH', 'PHY'
  icon: string;                 // Emoji
  color: string;                // Primary hex color
  gradient: string;             // CSS gradient string
  description: string;
  chapters: Chapter[];
  difficulty: DifficultyLevel;
  marvelIntroTitle: string;
  marvelIntroQuote: string;
  totalTopics: number;
  totalQuestions: number;
  recommendedClass: string[];
}

// ── Quiz & Contests ───────────────────────────

export type QuizType =
  | 'practice'
  | 'timed'
  | 'adaptive'
  | 'daily-challenge'
  | 'chapter-test'
  | 'mock-jee'
  | 'rapid-fire';

export interface QuizResult {
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skipped: number;
  timeTaken: number;            // seconds
  xpEarned: number;
  answers: { questionId: string; selectedOption: number; isCorrect: boolean }[];
  completedAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  timeLimit: number;            // seconds
  type: QuizType;
  subject: string;              // Subject ID
  chapterId?: string;
  topicId?: string;
  difficulty?: DifficultyLevel;
  xpReward: number;
  passingScore: number;         // percentage
  createdAt: Date;
  isLive?: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar: string;
  score: number;
  rank: number;
  timeTaken: number;
  xpEarned: number;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startAt: Date;
  endAt: Date;
  prize: string;                // Prize description
  prizeXP: number;
  participants: string[];       // User IDs
  questions: Question[];
  leaderboard: LeaderboardEntry[];
  subject?: string;
  difficulty?: DifficultyLevel;
  maxParticipants?: number;
  isRegistrationOpen: boolean;
  registrationDeadline: Date;
  type: 'open' | 'invite-only' | 'school';
  sponsor?: string;
}

// ── Notes & Resources ─────────────────────────

export type NoteType = 'handwritten' | 'typed' | 'pdf' | 'ai-generated' | 'video-note';

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;              // Markdown content
  subject: string;              // Subject ID
  chapter: string;              // Chapter ID
  topicId?: string;
  type: NoteType;
  pdfUrl?: string;
  imageUrls?: string[];
  tags: string[];
  isPublic: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  summary?: string;             // AI-generated summary
  keyTerms?: string[];
}

// ── Progress & Analytics ──────────────────────

export interface DailyActivity {
  date: string;                 // ISO date string 'YYYY-MM-DD'
  minutesStudied: number;
  topicsCompleted: number;
  questionsAttempted: number;
  xpEarned: number;
  accuracy: number;             // 0-100
}

export interface SubjectProgress {
  subjectId: string;
  completedTopics: string[];    // Topic IDs
  totalTopics: number;
  accuracy: number;             // 0-100
  averageQuizScore: number;
  timeSpentMinutes: number;
  lastActive: Date;
  weakTopics: string[];
  strongTopics: string[];
}

export interface UserProgress {
  userId: string;
  subjectId: string;
  completedTopics: string[];
  streak: number;
  lastActive: Date;
  weeklyGoal: number;           // minutes per week
  weeklyProgress: number;       // minutes completed this week
  dailyActivity: DailyActivity[];
  subjectProgress: SubjectProgress[];
  totalStudyMinutes: number;
  currentChapterId?: string;
  currentTopicId?: string;
}

// ── Notifications ─────────────────────────────

export type NotificationType =
  | 'streak-reminder'
  | 'quiz-result'
  | 'contest-start'
  | 'contest-end'
  | 'level-up'
  | 'badge-earned'
  | 'new-content'
  | 'friend-challenge'
  | 'daily-goal-achieved'
  | 'weekly-report';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionLabel?: string;
  imageUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

// ── Phoenix Leveling System ───────────────────

export interface PhoenixLevel {
  level: number;
  title: string;
  xpRequired: number;           // Total XP to reach this level
  reward: string;               // Description of reward
  phoenixAnimation: string;     // CSS class or animation identifier
  color: string;
  description: string;
  perks: string[];
  badge?: Badge;
}

// ── AI Copilot / Messaging ─────────────────────

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  imageUrl?: string;            // For vision queries
  isLoading?: boolean;
  metadata?: {
    model?: string;
    tokensUsed?: number;
    topicId?: string;
    subjectId?: string;
    sources?: string[];
    suggestedQuestions?: string[];
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  context?: {
    subjectId?: string;
    chapterId?: string;
    topicId?: string;
    questionId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  title?: string;
}

// ── Knowledge Graph ───────────────────────────

export interface KnowledgeNode {
  id: string;
  topicId: string;
  mastery: number;              // 0–100 mastery percentage
  connections: string[];        // IDs of connected KnowledgeNodes
  position: { x: number; y: number };
  label: string;
  color?: string;
  size?: number;                // Visual node size based on importance
  lastVisited?: Date;
  visitCount: number;
  isCurrentFocus?: boolean;
}

export interface KnowledgeEdge {
  id: string;
  source: string;               // KnowledgeNode ID
  target: string;               // KnowledgeNode ID
  strength: number;             // 0–1 connection strength
  type: 'prerequisite' | 'related' | 'builds-on' | 'contrasts';
}

export interface KnowledgeGraph {
  userId: string;
  subjectId: string;
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  updatedAt: Date;
}

// ── Miscellaneous ─────────────────────────────

export interface YouTubeVideo {
  id: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  duration: string;
  viewCount: string;
  publishedAt: string;
  topicId?: string;
  subjectId?: string;
  isRecommended: boolean;
  rating?: number;
}

export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  targetExam?: string;
  targetDate: Date;
  subjects: string[];
  dailyGoalMinutes: number;
  schedule: {
    dayOfWeek: number;
    subjectId: string;
    topicIds: string[];
    durationMinutes: number;
  }[];
  createdAt: Date;
  isActive: boolean;
}

export interface AchievementStat {
  label: string;
  value: number | string;
  unit?: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
}

// ── API Response Wrappers ─────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
