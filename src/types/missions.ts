export type MissionCategory = 
  | 'TRANSFERS'
  | 'SCOUTING'
  | 'REPUTATION'
  | 'FINANCE'
  | 'OFFICE'
  | 'PLAYER_DEVELOPMENT'
  | 'NETWORKING';

export type MissionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type MissionStatus = 'AVAILABLE' | 'ACTIVE' | 'COMPLETED' | 'FAILED';

export type RewardType = 'MONEY' | 'REPUTATION' | 'EXPERIENCE' | 'ITEM';

export interface MissionRequirement {
  type: 'LEVEL' | 'REPUTATION' | 'MONEY' | 'COMPLETED_MISSION' | 'SKILL_LEVEL';
  value: number;
  description: string;
}

export interface MissionReward {
  type: RewardType;
  amount: number;
  itemId?: string; // אם הפרס הוא פריט
}

export interface MissionObjective {
  id: string;
  description: string;
  isCompleted: boolean;
  requiredAmount?: number;
  currentAmount?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  status: MissionStatus;
  requirements: MissionRequirement[];
  objectives: MissionObjective[];
  rewards: MissionReward[];
  timeLimit?: number; // בשניות
  startTime?: number; // timestamp
  endTime?: number; // timestamp
  assignedAgentId?: string;
  isImportant: boolean;
}

export interface MissionProgress {
  missionId: string;
  objectiveProgress: {
    objectiveId: string;
    currentAmount: number;
  }[];
  lastUpdateTime: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  participantsCount: number;
  leaderboard: {
    agentId: string;
    agentName: string;
    score: number;
  }[];
  startTime: number;
  endTime: number;
  rewards: MissionReward[];
}

export interface MissionChain {
  id: string;
  name: string;
  description: string;
  missions: Mission[];
  currentMissionIndex: number;
  isCompleted: boolean;
  totalRewards: MissionReward[];
  chainBonusReward?: MissionReward;
}

export interface MissionsState {
  availableMissions: Mission[];
  activeMissions: Mission[];
  completedMissions: Mission[];
  missionProgress: MissionProgress[];
  dailyChallenges: DailyChallenge[];
  loading: boolean;
  error: string | null;
} 