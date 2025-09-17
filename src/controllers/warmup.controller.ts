import { Request, Response } from 'express';
import { WarmupService } from '../services/warmup.service';
import { EvolutionApiService } from '../services/evolution-api';
import { logger } from '../utils/logger';

export class WarmupController {
  private warmupService: WarmupService;
  private evolutionService: EvolutionApiService;

  constructor() {
    this.warmupService = new WarmupService();
    this.evolutionService = new EvolutionApiService();
  }

  startWarmup = async (req: Request, res: Response) => {
    try {
      const { instanceName, contacts } = req.body;
      
      if (!instanceName || !contacts || !Array.isArray(contacts)) {
        res.status(400).json({ 
          error: 'instanceName and contacts array are required' 
        });
        return;
      }

      // Verificar se a instância existe e está conectada
      const instance = await this.evolutionService.getInstance(instanceName);
      if (instance.status !== 'open' || instance.connectionState !== 'CONNECTED') {
        res.status(400).json({ 
          error: 'Instance must be connected before starting warmup' 
        });
        return;
      }

      const config = this.warmupService.createWarmupConfig(instanceName, contacts);
      const currentStage = this.warmupService.getCurrentStage(instanceName);

      res.json({
        success: true,
        config: {
          instanceName: config.instanceName,
          currentStage: config.currentStage,
          totalContacts: config.contacts.length,
          internalContacts: config.internalContacts.length,
          externalContacts: config.externalContacts.length
        },
        stage: currentStage,
        dailyLimit: this.warmupService.getDailyLimit(instanceName)
      });
    } catch (error) {
      logger.error('Error starting warmup:', error);
      res.status(500).json({ error: 'Failed to start warmup' });
    }
  };

  getWarmupStatus = async (req: Request, res: Response) => {
    try {
      const { instanceName } = req.params;
      
      const config = this.warmupService.getConfig(instanceName);
      const currentStage = this.warmupService.getCurrentStage(instanceName);
      const metrics = this.warmupService.getMetrics(instanceName);
      
      if (!config || !currentStage) {
        res.status(404).json({ error: 'Warmup not found for instance' });
        return;
      }

      const todayMetrics = metrics.find(m => m.date === new Date().toISOString().split('T')[0]);
      const dailyLimit = this.warmupService.getDailyLimit(instanceName);
      const remainingMessages = dailyLimit - (todayMetrics?.messagesSent || 0);

      res.json({
        instanceName,
        currentStage: config.currentStage,
        stageName: currentStage.name,
        stageDescription: currentStage.description,
        dailyLimit,
        messagesSentToday: todayMetrics?.messagesSent || 0,
        remainingMessages,
        responseRate: todayMetrics?.responseRate || 0,
        metrics: {
          totalMessagesSent: metrics.reduce((sum, m) => sum + m.messagesSent, 0),
          totalMessagesReceived: metrics.reduce((sum, m) => sum + m.messagesReceived, 0),
          averageResponseRate: metrics.length > 0 
            ? metrics.reduce((sum, m) => sum + m.responseRate, 0) / metrics.length 
            : 0,
          totalErrors: metrics.reduce((sum, m) => sum + m.errors, 0),
          daysActive: metrics.length
        },
        canAdvanceToNextStage: await this.warmupService['canAdvanceToNextStage'](instanceName)
      });
    } catch (error) {
      logger.error('Error getting warmup status:', error);
      res.status(500).json({ error: 'Failed to get warmup status' });
    }
  };

  sendWarmupMessage = async (req: Request, res: Response) => {
    try {
      const { instanceName } = req.params;
      const { count = 1, force = false } = req.body;

      const config = this.warmupService.getConfig(instanceName);
      if (!config) {
        res.status(404).json({ error: 'Warmup not found for instance' });
        return;
      }

      const dailyLimit = this.warmupService.getDailyLimit(instanceName);
      const todayMetrics = this.warmupService.getMetrics(instanceName)
        .find(m => m.date === new Date().toISOString().split('T')[0]);
      const messagesSentToday = todayMetrics?.messagesSent || 0;

      if (!force && messagesSentToday >= dailyLimit) {
        res.status(429).json({ 
          error: 'Daily limit reached',
          dailyLimit,
          messagesSentToday
        });
        return;
      }

      const messagesToSend = Math.min(count, dailyLimit - messagesSentToday);
      const contacts = this.warmupService.getAvailableContacts(instanceName, messagesToSend);
      
      const results = [];
      let successCount = 0;
      let mediaCount = 0;

      for (let i = 0; i < contacts.length; i++) {
        try {
          const currentStage = this.warmupService.getCurrentStage(instanceName);
          const template = this.warmupService.getRandomTemplate(
            instanceName, 
            currentStage?.allowedMedia || false
          );

          let result;
          if (template.type === 'text') {
            result = await this.evolutionService.sendMessage(instanceName, {
              number: contacts[i],
              text: template.content,
              delay: Math.random() * 2000 + 1000 // 1-3 seconds delay
            });
          } else {
            result = await this.evolutionService.sendMedia(instanceName, {
              number: contacts[i],
              mediatype: template.type,
              media: template.mediaUrl || '',
              caption: template.content
            });
            mediaCount++;
          }

          this.warmupService.recordMessageUsage(template.id);
          this.warmupService.updateDailyMetrics(instanceName, {
            messagesSent: (todayMetrics?.messagesSent || 0) + 1,
            mediaCount: (todayMetrics?.mediaCount || 0) + (template.type !== 'text' ? 1 : 0),
            uniqueContacts: (todayMetrics?.uniqueContacts || 0) + 1
          });

          results.push({
            contact: contacts[i],
            success: true,
            messageId: result.key?.id,
            templateId: template.id,
            messageType: template.type
          });
          successCount++;

        } catch (error) {
          logger.error(`Error sending message to ${contacts[i]}:`, error);
          this.warmupService.updateDailyMetrics(instanceName, {
            errors: (todayMetrics?.errors || 0) + 1
          });
          
          results.push({
            contact: contacts[i],
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      res.json({
        success: true,
        messagesSent: successCount,
        mediaCount,
        totalMessagesToday: messagesSentToday + successCount,
        remainingMessages: dailyLimit - (messagesSentToday + successCount),
        results
      });
    } catch (error) {
      logger.error('Error sending warmup messages:', error);
      res.status(500).json({ error: 'Failed to send warmup messages' });
    }
  };

  advanceStage = async (req: Request, res: Response) => {
    try {
      const { instanceName } = req.params;

      const success = await this.warmupService.advanceStage(instanceName);
      
      if (success) {
        const config = this.warmupService.getConfig(instanceName);
        const currentStage = this.warmupService.getCurrentStage(instanceName);
        
        res.json({
          success: true,
          message: `Advanced to stage ${config?.currentStage}`,
          newStage: currentStage
        });
      } else {
        res.status(400).json({ 
          error: 'Cannot advance stage - requirements not met or already at maximum stage' 
        });
      }
    } catch (error) {
      logger.error('Error advancing stage:', error);
      res.status(500).json({ error: 'Failed to advance stage' });
    }
  };

  getStages = async (req: Request, res: Response) => {
    try {
      const stages = this.warmupService.getAllStages();
      res.json({ stages });
    } catch (error) {
      logger.error('Error getting stages:', error);
      res.status(500).json({ error: 'Failed to get stages' });
    }
  };

  getMetrics = async (req: Request, res: Response) => {
    try {
      const { instanceName } = req.params;
      const { days = 7 } = req.query;
      
      const metrics = this.warmupService.getMetrics(instanceName);
      const filteredMetrics = metrics.slice(-Number(days));
      
      res.json({
        instanceName,
        metrics: filteredMetrics,
        summary: {
          totalMessagesSent: filteredMetrics.reduce((sum, m) => sum + m.messagesSent, 0),
          totalMessagesReceived: filteredMetrics.reduce((sum, m) => sum + m.messagesReceived, 0),
          averageResponseRate: filteredMetrics.length > 0 
            ? filteredMetrics.reduce((sum, m) => sum + m.responseRate, 0) / filteredMetrics.length 
            : 0,
          totalErrors: filteredMetrics.reduce((sum, m) => sum + m.errors, 0)
        }
      });
    } catch (error) {
      logger.error('Error getting metrics:', error);
      res.status(500).json({ error: 'Failed to get metrics' });
    }
  };

  scheduleMessages = async (req: Request, res: Response) => {
    try {
      const { instanceName } = req.params;
      const { messages } = req.body;

      const config = this.warmupService.getConfig(instanceName);
      if (!config) {
        res.status(404).json({ error: 'Warmup not found for instance' });
        return;
      }

      const scheduled = [];
      const dailyLimit = this.warmupService.getDailyLimit(instanceName);
      const todayMetrics = this.warmupService.getMetrics(instanceName)
        .find(m => m.date === new Date().toISOString().split('T')[0]);
      const messagesScheduledToday = todayMetrics?.messagesSent || 0;

      for (const msg of messages) {
        if (msg.contact && msg.templateId && msg.scheduledAt) {
          const scheduledAt = new Date(msg.scheduledAt);
          const isToday = scheduledAt.toDateString() === new Date().toDateString();
          
          if (isToday && messagesScheduledToday >= dailyLimit) {
            continue; // Skip if daily limit reached
          }

          const scheduledMessage = this.warmupService.scheduleMessage(
            instanceName,
            msg.contact,
            msg.templateId,
            scheduledAt
          );
          scheduled.push(scheduledMessage);
        }
      }

      res.json({
        success: true,
        scheduled: scheduled.length,
        messages: scheduled
      });
    } catch (error) {
      logger.error('Error scheduling messages:', error);
      res.status(500).json({ error: 'Failed to schedule messages' });
    }
  };

  getScheduledMessages = async (req: Request, res: Response) => {
    try {
      const { instanceName } = req.params;
      const scheduled = this.warmupService.getScheduledMessages(instanceName);
      
      res.json({
        instanceName,
        scheduled
      });
    } catch (error) {
      logger.error('Error getting scheduled messages:', error);
      res.status(500).json({ error: 'Failed to get scheduled messages' });
    }
  };
}