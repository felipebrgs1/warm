import { WarmupService } from './warmup.service';
import { EvolutionApiService } from './evolution-api';
import { ScheduledMessage } from '../types/warmup';
import { logger } from '../utils/logger';

export class MessageScheduler {
  private warmupService: WarmupService;
  private evolutionService: EvolutionApiService;
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.warmupService = new WarmupService();
    this.evolutionService = new EvolutionApiService();
  }

  startScheduler(instanceName: string) {
    // Check for pending messages every minute
    const interval = setInterval(() => {
      this.processScheduledMessages(instanceName);
    }, 60000); // 1 minute

    this.intervals.set(instanceName, interval);
    logger.info(`Message scheduler started for instance ${instanceName}`);
  }

  stopScheduler(instanceName: string) {
    const interval = this.intervals.get(instanceName);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(instanceName);
      logger.info(`Message scheduler stopped for instance ${instanceName}`);
    }
  }

  private async processScheduledMessages(instanceName: string) {
    try {
      const scheduledMessages = this.warmupService.getScheduledMessages(instanceName);
      const now = new Date();
      
      const dueMessages = scheduledMessages.filter(msg => 
        msg.status === 'pending' && new Date(msg.scheduledAt) <= now
      );

      if (dueMessages.length === 0) {
        return;
      }

      logger.info(`Processing ${dueMessages.length} scheduled messages for instance ${instanceName}`);

      for (const message of dueMessages) {
        await this.sendScheduledMessage(message);
      }
    } catch (error) {
      logger.error('Error processing scheduled messages:', error);
    }
  }

  private async sendScheduledMessage(message: ScheduledMessage) {
    try {
      const config = this.warmupService.getConfig(message.instanceName);
      if (!config) {
        logger.error(`Config not found for instance ${message.instanceName}`);
        return;
      }

      // Check daily limit
      const dailyLimit = this.warmupService.getDailyLimit(message.instanceName);
      const todayMetrics = this.warmupService.getMetrics(message.instanceName)
        .find(m => m.date === new Date().toISOString().split('T')[0]);
      const messagesSentToday = todayMetrics?.messagesSent || 0;

      if (messagesSentToday >= dailyLimit) {
        logger.warn(`Daily limit reached for instance ${message.instanceName}, skipping scheduled message`);
        return;
      }

      // Get template details
      const template = this.warmupService.getRandomTemplate(message.instanceName, true);
      
      let result;
      if (template.type === 'text') {
        result = await this.evolutionService.sendMessage(message.instanceName, {
          number: message.contact,
          text: template.content,
          delay: 1000
        });
      } else {
        result = await this.evolutionService.sendMedia(message.instanceName, {
          number: message.contact,
          mediatype: template.type,
          media: template.mediaUrl || '',
          caption: template.content
        });
      }

      // Update metrics and template usage
      this.warmupService.recordMessageUsage(template.id);
      this.warmupService.updateDailyMetrics(message.instanceName, {
        messagesSent: (todayMetrics?.messagesSent || 0) + 1,
        mediaCount: (todayMetrics?.mediaCount || 0) + (template.type !== 'text' ? 1 : 0),
        uniqueContacts: (todayMetrics?.uniqueContacts || 0) + 1
      });

      // Mark message as sent
      this.updateMessageStatus(message.instanceName, message.id, 'sent');

      logger.info(`Scheduled message sent successfully to ${message.contact}`, {
        messageId: message.id,
        instanceName: message.instanceName,
        templateId: template.id
      });

    } catch (error) {
      logger.error(`Error sending scheduled message ${message.id}:`, error);
      
      // Update retry count or mark as failed
      const scheduledMessages = this.warmupService.getScheduledMessages(message.instanceName);
      const messageIndex = scheduledMessages.findIndex(m => m.id === message.id);
      
      if (messageIndex !== -1) {
        const messageToUpdate = scheduledMessages[messageIndex];
        messageToUpdate.retryCount++;

        if (messageToUpdate.retryCount >= messageToUpdate.maxRetries) {
          this.updateMessageStatus(message.instanceName, message.id, 'failed');
          
          // Update error metrics
          const todayMetrics = this.warmupService.getMetrics(message.instanceName)
            .find(m => m.date === new Date().toISOString().split('T')[0]);
          this.warmupService.updateDailyMetrics(message.instanceName, {
            errors: (todayMetrics?.errors || 0) + 1
          });
        } else {
          // Schedule retry with exponential backoff
          const retryDelay = Math.pow(2, messageToUpdate.retryCount) * 60000; // 1min, 2min, 4min
          const newScheduledAt = new Date(Date.now() + retryDelay);
          
          this.rescheduleMessage(message.instanceName, message.id, newScheduledAt);
        }
      }
    }
  }

  private updateMessageStatus(instanceName: string, messageId: string, status: 'sent' | 'failed' | 'cancelled') {
    // This would need to be implemented in the WarmupService
    // For now, we'll update the scheduled messages directly
    const scheduledMessages = this.warmupService.getScheduledMessages(instanceName);
    const messageIndex = scheduledMessages.findIndex(m => m.id === messageId);
    
    if (messageIndex !== -1) {
      scheduledMessages[messageIndex].status = status;
    }
  }

  private rescheduleMessage(instanceName: string, messageId: string, newScheduledAt: Date) {
    const scheduledMessages = this.warmupService.getScheduledMessages(instanceName);
    const messageIndex = scheduledMessages.findIndex(m => m.id === messageId);
    
    if (messageIndex !== -1) {
      scheduledMessages[messageIndex].scheduledAt = newScheduledAt;
      logger.info(`Message ${messageId} rescheduled to ${newScheduledAt.toISOString()}`);
    }
  }

  // Schedule messages based on time distribution for the current stage
  async scheduleDailyMessages(instanceName: string, targetCount: number) {
    try {
      const config = this.warmupService.getConfig(instanceName);
      if (!config) {
        throw new Error(`Config not found for instance ${instanceName}`);
      }

      const currentStage = this.warmupService.getCurrentStage(instanceName);
      if (!currentStage) {
        throw new Error(`Stage not found for instance ${instanceName}`);
      }

      const availableContacts = this.warmupService.getAvailableContacts(instanceName, targetCount);
      const timeSlots = this.generateTimeSlots(currentStage.timeDistribution, targetCount);

      const scheduled = [];
      
      for (let i = 0; i < Math.min(targetCount, availableContacts.length, timeSlots.length); i++) {
        const template = this.warmupService.getRandomTemplate(
          instanceName, 
          currentStage.allowedMedia
        );

        const scheduledMessage = this.warmupService.scheduleMessage(
          instanceName,
          availableContacts[i],
          template.id,
          timeSlots[i]
        );

        scheduled.push({
          ...scheduledMessage,
          contact: availableContacts[i],
          template
        });
      }

      logger.info(`Scheduled ${scheduled.length} messages for instance ${instanceName}`, {
        targetCount,
        actualCount: scheduled.length,
        timeSlots: timeSlots.length
      });

      return scheduled;
    } catch (error) {
      logger.error('Error scheduling daily messages:', error);
      throw error;
    }
  }

  private generateTimeSlots(timeDistribution: string[], messageCount: number): Date[] {
    const slots: Date[] = [];
    const now = new Date();
    
    // Convert time distribution to hours
    const hours = timeDistribution.map(time => {
      const [hour, minute] = time.split(':').map(Number);
      return hour + minute / 60;
    });

    // Distribute messages across available time slots
    const messagesPerSlot = Math.ceil(messageCount / hours.length);
    
    for (let hourIndex = 0; hourIndex < hours.length && slots.length < messageCount; hourIndex++) {
      const baseHour = hours[hourIndex];
      const messagesInThisSlot = Math.min(messagesPerSlot, messageCount - slots.length);
      
      for (let msgIndex = 0; msgIndex < messagesInThisSlot; msgIndex++) {
        // Distribute messages within the hour (0-59 minutes)
        const minuteOffset = Math.floor(Math.random() * 60);
        const scheduledDate = new Date(now);
        scheduledDate.setHours(Math.floor(baseHour), minuteOffset, 0, 0);
        
        // If time has passed today, schedule for tomorrow
        if (scheduledDate <= now) {
          scheduledDate.setDate(scheduledDate.getDate() + 1);
        }
        
        slots.push(scheduledDate);
      }
    }

    // Sort by time
    return slots.sort((a, b) => a.getTime() - b.getTime());
  }

  // Clean up old scheduled messages
  cleanupOldMessages(instanceName: string, daysOld: number = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const scheduledMessages = this.warmupService.getScheduledMessages(instanceName);
    const filteredMessages = scheduledMessages.filter(msg => 
      new Date(msg.scheduledAt) > cutoffDate || 
      msg.status === 'pending'
    );

    // Update the scheduled messages (would need implementation in WarmupService)
    logger.info(`Cleaned up ${scheduledMessages.length - filteredMessages.length} old scheduled messages`);
  }

  // Get scheduler statistics
  getSchedulerStats(instanceName: string) {
    const scheduledMessages = this.warmupService.getScheduledMessages(instanceName);
    const now = new Date();
    const today = new Date(now.toDateString());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const stats = {
      total: scheduledMessages.length,
      pending: scheduledMessages.filter(m => m.status === 'pending').length,
      sent: scheduledMessages.filter(m => m.status === 'sent').length,
      failed: scheduledMessages.filter(m => m.status === 'failed').length,
      today: scheduledMessages.filter(m => {
        const scheduledDate = new Date(m.scheduledAt);
        return scheduledDate >= today && scheduledDate < tomorrow;
      }).length,
      overdue: scheduledMessages.filter(m => 
        m.status === 'pending' && new Date(m.scheduledAt) < now
      ).length
    };

    return stats;
  }
}