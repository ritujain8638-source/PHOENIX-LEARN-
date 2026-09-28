import { PhoenixLevel } from '@/types';

export const PHOENIX_LEVELS: PhoenixLevel[] = [
  {
    level: 1,
    title: 'Ash & Spark',
    subtitle: 'Every master begins as an ember',
    xpRequired: 0,
    reward: 'Access to AI Copilot & Daily Quests',
    rewardXP: 50,
    phoenixAnimation: 'idle',
    icon: '🔥',
    color: '#ff6b35'
  },
  {
    level: 2,
    title: 'Kindling Flame',
    subtitle: 'Concepts begin to click into place',
    xpRequired: 150,
    reward: 'Interactive 3D Simulations unlocked',
    rewardXP: 100,
    phoenixAnimation: 'flame',
    icon: '✨',
    color: '#ff9500'
  },
  {
    level: 3,
    title: 'Rising Ember',
    subtitle: 'Speed and retention surge',
    xpRequired: 400,
    reward: 'Weekly Arena Contests & Leaderboards',
    rewardXP: 150,
    phoenixAnimation: 'wings',
    icon: '⚡',
    color: '#ffb347'
  },
  {
    level: 4,
    title: 'Solar Blaze',
    subtitle: 'High precision on tricky problems',
    xpRequired: 800,
    reward: '3D Spatial Formula Notes unlocked',
    rewardXP: 200,
    phoenixAnimation: 'soar',
    icon: '🌟',
    color: '#ffd60a'
  },
  {
    level: 5,
    title: 'Crimson Wing',
    subtitle: 'Tackling multi-concept JEE questions',
    xpRequired: 1400,
    reward: 'Personalized Knowledge Gap Radar AI',
    rewardXP: 300,
    phoenixAnimation: 'inferno',
    icon: '🦅',
    color: '#ff2d55'
  },
  {
    level: 6,
    title: 'Phoenix Sovereign',
    subtitle: 'True academic enlightenment and mastery',
    xpRequired: 2200,
    reward: 'Mythic Hall of Fame & Custom Phoenix Aura',
    rewardXP: 500,
    phoenixAnimation: 'legendary',
    icon: '👑',
    color: '#bf5af2'
  }
];
