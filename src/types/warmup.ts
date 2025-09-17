export interface WarmupStage {
  id: number;
  name: string;
  description: string;
  maxDailyMessages: number;
  durationDays: number;
  allowedMedia: boolean;
  maxExternalContacts: number;
  requiredResponseRate: number;
  timeDistribution: string[];
}

export interface DailyMetrics {
  date: string;
  stage: number;
  messagesSent: number;
  messagesReceived: number;
  responseRate: number;
  mediaCount: number;
  uniqueContacts: number;
  errors: number;
}

export interface WarmupConfig {
  instanceName: string;
  currentStage: number;
  startDate: string;
  contacts: string[];
  internalContacts: string[];
  externalContacts: string[];
  dailyLimits: {
    stage1: number;
    stage2: number;
    stage3: number;
    stage4: number;
    stage5: number;
    stage6: number;
  };
}

export interface MessageTemplate {
  id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'document';
  mediaUrl?: string;
  category: 'greeting' | 'followup' | 'reminder' | 'test' | 'promotion';
  timesUsed: number;
  lastUsed?: string;
}

export interface ScheduledMessage {
  id: string;
  instanceName: string;
  contact: string;
  templateId: string;
  scheduledAt: Date;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  retryCount: number;
  maxRetries: number;
}