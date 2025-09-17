import { WarmupStage, WarmupConfig, DailyMetrics, MessageTemplate, ScheduledMessage } from '../types/warmup';
import { logger } from '../utils/logger';

export class WarmupService {
  private readonly STAGES: WarmupStage[] = [
    {
      id: 1,
      name: 'Setup e Validações Iniciais',
      description: 'Configuração básica e testes iniciais',
      maxDailyMessages: 5,
      durationDays: 3,
      allowedMedia: false,
      maxExternalContacts: 0,
      requiredResponseRate: 1.0,
      timeDistribution: ['09:00', '14:00', '18:00']
    },
    {
      id: 2,
      name: 'Envio Muito Limitado',
      description: 'Envio muito limitado para contatos internos',
      maxDailyMessages: 15,
      durationDays: 4,
      allowedMedia: true,
      maxExternalContacts: 3,
      requiredResponseRate: 0.8,
      timeDistribution: ['09:00', '11:00', '14:00', '16:00', '18:00']
    },
    {
      id: 3,
      name: 'Aumento Gradual e Diversificação',
      description: 'Aumento gradual com diversificação de conteúdo',
      maxDailyMessages: 30,
      durationDays: 7,
      allowedMedia: true,
      maxExternalContacts: 5,
      requiredResponseRate: 0.7,
      timeDistribution: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
    },
    {
      id: 4,
      name: 'Simulação de Conversas Naturais',
      description: 'Conversas naturais distribuídas no dia',
      maxDailyMessages: 50,
      durationDays: 7,
      allowedMedia: true,
      maxExternalContacts: 10,
      requiredResponseRate: 0.6,
      timeDistribution: ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30']
    },
    {
      id: 5,
      name: 'Pré-produção (Ramp-up Final)',
      description: 'Volume moderado com múltiplos formatos',
      maxDailyMessages: 100,
      durationDays: 7,
      allowedMedia: true,
      maxExternalContacts: 20,
      requiredResponseRate: 0.6,
      timeDistribution: ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']
    },
    {
      id: 6,
      name: 'Produção Controlada',
      description: 'Produção real com monitoramento constante',
      maxDailyMessages: 200,
      durationDays: 30,
      allowedMedia: true,
      maxExternalContacts: 50,
      requiredResponseRate: 0.5,
      timeDistribution: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
    }
  ];

  private configs: Map<string, WarmupConfig> = new Map();
  private metrics: Map<string, DailyMetrics[]> = new Map();
  private scheduledMessages: Map<string, ScheduledMessage[]> = new Map();
  private messageTemplates: MessageTemplate[] = [];

  constructor() {
    this.initializeMessageTemplates();
  }

  initializeMessageTemplates() {
    this.messageTemplates = [
      // Estágio 1 - Mensagens simples
      {
        id: 'greeting_1',
        content: 'Bom dia! Este é um teste inicial do nosso sistema.',
        type: 'text',
        category: 'greeting',
        timesUsed: 0
      },
      {
        id: 'greeting_2',
        content: 'Olá! Verificando a conectividade do WhatsApp.',
        type: 'text',
        category: 'greeting',
        timesUsed: 0
      },
      {
        id: 'test_1',
        content: 'Oi! Mensagem de teste do warm-up em andamento.',
        type: 'text',
        category: 'test',
        timesUsed: 0
      },
      {
        id: 'followup_1',
        content: 'Tudo bem? Confirmando o recebimento das mensagens.',
        type: 'text',
        category: 'followup',
        timesUsed: 0
      },
      {
        id: 'reminder_1',
        content: 'Lembrete: sistema de comunicação está funcionando.',
        type: 'text',
        category: 'reminder',
        timesUsed: 0
      },
      
      // Estágio 2+ - Mensagens diversificadas
      {
        id: 'greeting_varied_1',
        content: 'Bom dia! Como você está hoje?',
        type: 'text',
        category: 'greeting',
        timesUsed: 0
      },
      {
        id: 'greeting_varied_2',
        content: 'Olá! Espero que esteja tendo um ótimo dia.',
        type: 'text',
        category: 'greeting',
        timesUsed: 0
      },
      {
        id: 'followup_varied_1',
        content: 'Oi! Só verificando se tudo está correto por aí.',
        type: 'text',
        category: 'followup',
        timesUsed: 0
      },
      {
        id: 'followup_varied_2',
        content: 'Tudo bem? Alguma novidade para compartilhar?',
        type: 'text',
        category: 'followup',
        timesUsed: 0
      },
      {
        id: 'reminder_varied_1',
        content: 'Lembrete amigável: nossa comunicação está ativa.',
        type: 'text',
        category: 'reminder',
        timesUsed: 0
      },
      {
        id: 'promotion_1',
        content: 'Novidade! Estamos melhorando nosso sistema de comunicação.',
        type: 'text',
        category: 'promotion',
        timesUsed: 0
      },
      {
        id: 'image_test_1',
        content: 'Imagem de teste do sistema',
        type: 'image',
        mediaUrl: 'https://via.placeholder.com/400x300.png?text=Test+Image',
        category: 'test',
        timesUsed: 0
      },
      {
        id: 'document_test_1',
        content: 'Documento informativo para teste',
        type: 'document',
        mediaUrl: 'https://via.placeholder.com/400x300.png?text=Test+Document',
        category: 'test',
        timesUsed: 0
      }
    ];
  }

  createWarmupConfig(instanceName: string, contacts: string[]): WarmupConfig {
    const internalContacts = contacts.slice(0, 5); // Primeiros 5 contatos são internos
    const externalContacts = contacts.slice(5); // Resto são externos

    const config: WarmupConfig = {
      instanceName,
      currentStage: 1,
      startDate: new Date().toISOString(),
      contacts,
      internalContacts,
      externalContacts,
      dailyLimits: {
        stage1: parseInt(process.env.MAX_DAILY_MESSAGES_STAGE_1 || '5'),
        stage2: parseInt(process.env.MAX_DAILY_MESSAGES_STAGE_2 || '15'),
        stage3: parseInt(process.env.MAX_DAILY_MESSAGES_STAGE_3 || '30'),
        stage4: parseInt(process.env.MAX_DAILY_MESSAGES_STAGE_4 || '50'),
        stage5: parseInt(process.env.MAX_DAILY_MESSAGES_STAGE_5 || '100'),
        stage6: parseInt(process.env.MAX_DAILY_MESSAGES_STAGE_6 || '200')
      }
    };

    this.configs.set(instanceName, config);
    this.metrics.set(instanceName, []);
    this.scheduledMessages.set(instanceName, []);

    logger.info(`Warmup config created for instance ${instanceName}`, {
      stage: config.currentStage,
      contacts: config.contacts.length,
      internalContacts: config.internalContacts.length,
      externalContacts: config.externalContacts.length
    });

    return config;
  }

  getCurrentStage(instanceName: string): WarmupStage | null {
    const config = this.configs.get(instanceName);
    if (!config) return null;

    return this.STAGES.find(stage => stage.id === config.currentStage) || null;
  }

  async advanceStage(instanceName: string): Promise<boolean> {
    const config = this.configs.get(instanceName);
    if (!config) {
      logger.error(`Config not found for instance ${instanceName}`);
      return false;
    }

    if (config.currentStage >= this.STAGES.length) {
      logger.warn(`Instance ${instanceName} already at maximum stage`);
      return false;
    }

    const canAdvance = await this.canAdvanceToNextStage(instanceName);
    if (!canAdvance) {
      logger.warn(`Cannot advance stage for instance ${instanceName} - requirements not met`);
      return false;
    }

    config.currentStage++;
    this.configs.set(instanceName, config);

    logger.info(`Advanced to stage ${config.currentStage} for instance ${instanceName}`);

    return true;
  }

  private async canAdvanceToNextStage(instanceName: string): Promise<boolean> {
    const config = this.configs.get(instanceName);
    if (!config) return false;

    const currentStage = this.STAGES.find(s => s.id === config.currentStage);
    if (!currentStage) return false;

    // Verificar métricas dos últimos dias
    const instanceMetrics = this.metrics.get(instanceName) || [];
    const recentMetrics = instanceMetrics.slice(-currentStage.durationDays);

    if (recentMetrics.length < currentStage.durationDays) {
      return false;
    }

    // Verificar taxa de resposta média
    const avgResponseRate = recentMetrics.reduce((sum, m) => sum + m.responseRate, 0) / recentMetrics.length;
    if (avgResponseRate < currentStage.requiredResponseRate) {
      logger.warn(`Response rate ${avgResponseRate} below required ${currentStage.requiredResponseRate}`);
      return false;
    }

    // Verificar se não houve muitos erros
    const totalErrors = recentMetrics.reduce((sum, m) => sum + m.errors, 0);
    const errorRate = totalErrors / recentMetrics.reduce((sum, m) => sum + m.messagesSent, 0);
    if (errorRate > 0.1) { // 10% error rate threshold
      logger.warn(`Error rate ${errorRate} too high`);
      return false;
    }

    return true;
  }

  getDailyLimit(instanceName: string): number {
    const config = this.configs.get(instanceName);
    if (!config) return 0;

    const stageKey = `stage${config.currentStage}` as keyof typeof config.dailyLimits;
    return config.dailyLimits[stageKey];
  }

  getAvailableContacts(instanceName: string, count: number): string[] {
    const config = this.configs.get(instanceName);
    if (!config) return [];

    const currentStage = this.STAGES.find(s => s.id === config.currentStage);
    if (!currentStage) return [];

    // Priorizar contatos internos nos estágios iniciais
    const availableContacts = [];
    
    if (currentStage.id <= 2) {
      // Estágios iniciais: apenas contatos internos
      availableContacts.push(...config.internalContacts);
    } else {
      // Estágios avançados: mistura de internos e externos
      availableContacts.push(...config.internalContacts);
      availableContacts.push(...config.externalContacts.slice(0, currentStage.maxExternalContacts));
    }

    // Retornar contatos aleatórios para evitar padrões
    const shuffled = availableContacts.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, availableContacts.length));
  }

  getRandomTemplate(instanceName: string, allowMedia: boolean = false): MessageTemplate {
    const config = this.configs.get(instanceName);
    if (!config) {
      return this.messageTemplates[0];
    }

    const currentStage = this.STAGES.find(s => s.id === config.currentStage);
    if (!currentStage) {
      return this.messageTemplates[0];
    }

    // Filtrar templates disponíveis
    let availableTemplates = this.messageTemplates;

    if (!allowMedia || !currentStage.allowedMedia) {
      availableTemplates = availableTemplates.filter(t => t.type === 'text');
    }

    // Nos estágios iniciais, apenas templates básicos
    if (currentStage.id <= 2) {
      availableTemplates = availableTemplates.filter(t => 
        t.id.includes('greeting') || t.id.includes('test') || t.id.includes('reminder')
      );
    }

    // Escolher template aleatório com base em uso (evitar repetição)
    const weightedTemplates = availableTemplates.map(template => ({
      ...template,
      weight: 1 / (template.timesUsed + 1)
    }));

    const totalWeight = weightedTemplates.reduce((sum, t) => sum + t.weight, 0);
    let random = Math.random() * totalWeight;

    for (const template of weightedTemplates) {
      random -= template.weight;
      if (random <= 0) {
        return template;
      }
    }

    return weightedTemplates[0];
  }

  recordMessageUsage(templateId: string) {
    const template = this.messageTemplates.find(t => t.id === templateId);
    if (template) {
      template.timesUsed++;
      template.lastUsed = new Date().toISOString();
    }
  }

  updateDailyMetrics(instanceName: string, metrics: Partial<DailyMetrics>) {
    const today = new Date().toISOString().split('T')[0];
    const instanceMetrics = this.metrics.get(instanceName) || [];
    
    let todayMetrics = instanceMetrics.find(m => m.date === today);
    
    if (!todayMetrics) {
      const config = this.configs.get(instanceName);
      todayMetrics = {
        date: today,
        stage: config?.currentStage || 1,
        messagesSent: 0,
        messagesReceived: 0,
        responseRate: 0,
        mediaCount: 0,
        uniqueContacts: 0,
        errors: 0
      };
      instanceMetrics.push(todayMetrics);
    }

    Object.assign(todayMetrics, metrics);
    
    // Calcular taxa de resposta
    if (todayMetrics.messagesSent > 0) {
      todayMetrics.responseRate = todayMetrics.messagesReceived / todayMetrics.messagesSent;
    }

    this.metrics.set(instanceName, instanceMetrics);
  }

  getMetrics(instanceName: string): DailyMetrics[] {
    return this.metrics.get(instanceName) || [];
  }

  getConfig(instanceName: string): WarmupConfig | undefined {
    return this.configs.get(instanceName);
  }

  getAllStages(): WarmupStage[] {
    return this.STAGES;
  }

  scheduleMessage(instanceName: string, contact: string, templateId: string, scheduledAt: Date): ScheduledMessage {
    const scheduledMessage: ScheduledMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      instanceName,
      contact,
      templateId,
      scheduledAt,
      status: 'pending',
      retryCount: 0,
      maxRetries: 3
    };

    const instanceScheduled = this.scheduledMessages.get(instanceName) || [];
    instanceScheduled.push(scheduledMessage);
    this.scheduledMessages.set(instanceName, instanceScheduled);

    return scheduledMessage;
  }

  getScheduledMessages(instanceName: string): ScheduledMessage[] {
    return this.scheduledMessages.get(instanceName) || [];
  }
}