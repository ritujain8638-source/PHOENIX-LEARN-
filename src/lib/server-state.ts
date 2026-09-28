// Shared in-memory data store for Vercel serverless functions
// Allows full interactive demo and persistence across serverless invocations

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  class_level: number;
  phone?: string;
  target_exam: string;
  selected_subjects: string[];
  total_xp: number;
  streak: number;
  level: number;
  created_at?: string;
}

// Initial default seed profiles
export const defaultProfiles: UserProfile[] = [
  {
    id: "user-demo-1",
    name: "Aryan Sharma",
    email: "aryan.sharma@example.com",
    avatar: "🦅",
    class_level: 11,
    phone: "+91 98765 43210",
    target_exam: "JEE Advanced 2026",
    selected_subjects: ["mathematics", "physics", "chemistry"],
    total_xp: 3450,
    streak: 14,
    level: 7,
    created_at: new Date().toISOString()
  },
  {
    id: "user-demo-2",
    name: "Ananya Deshmukh",
    email: "ananya.d@example.com",
    avatar: "⚡",
    class_level: 12,
    phone: "+91 91234 56789",
    target_exam: "JEE Main & BITSAT",
    selected_subjects: ["mathematics", "physics", "chemistry"],
    total_xp: 5820,
    streak: 28,
    level: 11,
    created_at: new Date().toISOString()
  },
  {
    id: "user-demo-3",
    name: "Rohan Verma",
    email: "rohan.v@example.com",
    avatar: "🔥",
    class_level: 10,
    phone: "+91 99887 76655",
    target_exam: "CBSE Boards & NTSE",
    selected_subjects: ["mathematics", "science"],
    total_xp: 1890,
    streak: 7,
    level: 4,
    created_at: new Date().toISOString()
  }
];

// Persistent state reference across serverless lambdas in Node process
const globalStore = global as unknown as {
  _phoenixProfiles?: UserProfile[];
  _phoenixActiveId?: string;
};

if (!globalStore._phoenixProfiles) {
  globalStore._phoenixProfiles = [...defaultProfiles];
  globalStore._phoenixActiveId = "user-demo-1";
}

export function getProfiles(): UserProfile[] {
  return globalStore._phoenixProfiles || defaultProfiles;
}

export function getActiveUserId(): string {
  return globalStore._phoenixActiveId || "user-demo-1";
}

export function setActiveUserId(id: string) {
  globalStore._phoenixActiveId = id;
}

export function getUserById(id: string): UserProfile | undefined {
  return (globalStore._phoenixProfiles || defaultProfiles).find((u) => u.id === id);
}

export function getUserByEmail(email: string): UserProfile | undefined {
  return (globalStore._phoenixProfiles || defaultProfiles).find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
}

export function saveUser(user: UserProfile): UserProfile {
  if (!globalStore._phoenixProfiles) {
    globalStore._phoenixProfiles = [...defaultProfiles];
  }
  const idx = globalStore._phoenixProfiles.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    globalStore._phoenixProfiles[idx] = { ...globalStore._phoenixProfiles[idx], ...user };
  } else {
    globalStore._phoenixProfiles.push(user);
  }
  return user;
}
