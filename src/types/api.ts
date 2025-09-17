export interface WhatsAppInstance {
  instance: string;
  status: 'open' | 'connecting' | 'close' | 'error';
  connectionState: string;
  owner: string;
  qrcode?: string;
}

export interface MessageData {
  number: string;
  text: string;
  delay?: number;
  quoted?: string;
  linkPreview?: boolean;
}

export interface MediaData {
  number: string;
  mediatype: 'image' | 'video' | 'audio' | 'document';
  media: string;
  caption?: string;
  fileName?: string;
}

export interface WarmupConfig {
  instanceName: string;
  contacts: string[];
}

export interface WarmupStatus {
  instanceName: string;
  currentStage: number;
  stageName: string;
  stageDescription: string;
  dailyLimit: number;
  messagesSentToday: number;
  remainingMessages: number;
  responseRate: number;
  metrics: {
    totalMessagesSent: number;
    totalMessagesReceived: number;
    averageResponseRate: number;
    totalErrors: number;
    daysActive: number;
  };
  canAdvanceToNextStage: boolean;
}

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

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface WebhookMessage {
  instance: string;
  message: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    message: any;
    messageTimestamp: number;
    messageType: string;
  };
}

export interface Dashboard {
  instanceName: string;
  currentStage: number;
  stageName: string;
  healthScore: number;
  healthStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  today: {
    messagesSent: number;
    messagesReceived: number;
    responseRate: number;
    errors: number;
    remainingMessages: number;
  };
  week: {
    totalMessagesSent: number;
    totalMessagesReceived: number;
    averageResponseRate: number;
    totalErrors: number;
    averageDailyMessages: number;
  };
  overall: {
    totalMessagesSent: number;
    totalMessagesReceived: number;
    averageResponseRate: number;
    totalErrors: number;
    daysActive: number;
    canAdvanceToNextStage: boolean;
  };
  stageLimits: {
    dailyLimit: number;
    maxDailyMessages: number;
    allowedMedia: boolean;
    maxExternalContacts: number;
    requiredResponseRate: number;
  };
}