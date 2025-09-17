import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { WarmupService } from '../services/warmup.service';
import { logger } from '../utils/logger';

export class AnalyticsController {
  private analyticsService: AnalyticsService;
  private warmupService: WarmupService;

  constructor() {
    this.analyticsService = new AnalyticsService();
    this.warmupService = new WarmupService();
  }

  getAnalytics = async (req: Request, res: Response) => {
    try {
      const { instanceName } = req.params;
      const { period = 'week' } = req.query;

      const analytics = this.analyticsService.generateAnalytics(instanceName, period as 'week' | 'month' | 'all');

      res.json({
        success: true,
        analytics
      });
    } catch (error) {
      logger.error('Error getting analytics:', error);
      res.status(500).json({ error: 'Failed to get analytics' });
    }
  };

  getHealthScore = async (req: Request, res: Response) => {
    try {
      const { instanceName } = req.params;
      
      const healthScore = this.analyticsService.getHealthScore(instanceName);
      
      res.json({
        success: true,
        instanceName,
        healthScore,
        status: this.getHealthStatus(healthScore)
      });
    } catch (error) {
      logger.error('Error getting health score:', error);
      res.status(500).json({ error: 'Failed to get health score' });
    }
  };

  getDashboard = async (req: Request, res: Response) => {
    try {
      const { instanceName } = req.params;
      
      const config = this.warmupService.getConfig(instanceName);
      const currentStage = this.warmupService.getCurrentStage(instanceName);
      const metrics = this.warmupService.getMetrics(instanceName);
      const healthScore = this.analyticsService.getHealthScore(instanceName);
      
      if (!config || !currentStage) {
        res.status(404).json({ error: 'Warmup not found for instance' });
        return;
      }

      const todayMetrics = metrics.find(m => m.date === new Date().toISOString().split('T')[0]);
      const weeklyMetrics = metrics.slice(-7);
      const dailyLimit = this.warmupService.getDailyLimit(instanceName);

      const dashboard = {
        instanceName,
        currentStage: config.currentStage,
        stageName: currentStage.name,
        healthScore,
        healthStatus: this.getHealthStatus(healthScore),
        today: {
          messagesSent: todayMetrics?.messagesSent || 0,
          messagesReceived: todayMetrics?.messagesReceived || 0,
          responseRate: todayMetrics?.responseRate || 0,
          errors: todayMetrics?.errors || 0,
          remainingMessages: dailyLimit - (todayMetrics?.messagesSent || 0)
        },
        week: {
          totalMessagesSent: weeklyMetrics.reduce((sum, m) => sum + m.messagesSent, 0),
          totalMessagesReceived: weeklyMetrics.reduce((sum, m) => sum + m.messagesReceived, 0),
          averageResponseRate: this.calculateAverageResponseRate(weeklyMetrics),
          totalErrors: weeklyMetrics.reduce((sum, m) => sum + m.errors, 0),
          averageDailyMessages: weeklyMetrics.length > 0 
            ? weeklyMetrics.reduce((sum, m) => sum + m.messagesSent, 0) / weeklyMetrics.length 
            : 0
        },
        overall: {
          totalMessagesSent: metrics.reduce((sum, m) => sum + m.messagesSent, 0),
          totalMessagesReceived: metrics.reduce((sum, m) => sum + m.messagesReceived, 0),
          averageResponseRate: this.calculateAverageResponseRate(metrics),
          totalErrors: metrics.reduce((sum, m) => sum + m.errors, 0),
          daysActive: metrics.length,
          canAdvanceToNextStage: await this.warmupService['canAdvanceToNextStage'](instanceName)
        },
        stageLimits: {
          dailyLimit,
          maxDailyMessages: currentStage.maxDailyMessages,
          allowedMedia: currentStage.allowedMedia,
          maxExternalContacts: currentStage.maxExternalContacts,
          requiredResponseRate: currentStage.requiredResponseRate
        }
      };

      res.json({
        success: true,
        dashboard
      });
    } catch (error) {
      logger.error('Error getting dashboard:', error);
      res.status(500).json({ error: 'Failed to get dashboard' });
    }
  };

  exportMetrics = async (req: Request, res: Response) => {
    try {
      const { instanceName } = req.params;
      const { format = 'csv' } = req.query;

      if (format === 'csv') {
        const csvData = this.analyticsService.exportToCsv(instanceName);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${instanceName}-metrics.csv"`);
        res.send(csvData);
      } else {
        const metrics = this.warmupService.getMetrics(instanceName);
        res.json({
          success: true,
          instanceName,
          metrics,
          exportedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      logger.error('Error exporting metrics:', error);
      res.status(500).json({ error: 'Failed to export metrics' });
    }
  };

  getComparison = async (req: Request, res: Response) => {
    try {
      const { instanceName } = req.params;
      const { compareInstance } = req.query;

      if (!compareInstance) {
        res.status(400).json({ error: 'compareInstance parameter is required' });
        return;
      }

      const metrics1 = this.warmupService.getMetrics(instanceName);
      const metrics2 = this.warmupService.getMetrics(compareInstance as string);

      const comparison = {
        instance1: {
          name: instanceName,
          totalMessagesSent: metrics1.reduce((sum, m) => sum + m.messagesSent, 0),
          totalMessagesReceived: metrics1.reduce((sum, m) => sum + m.messagesReceived, 0),
          averageResponseRate: this.calculateAverageResponseRate(metrics1),
          totalErrors: metrics1.reduce((sum, m) => sum + m.errors, 0),
          daysActive: metrics1.length,
          healthScore: this.analyticsService.getHealthScore(instanceName)
        },
        instance2: {
          name: compareInstance,
          totalMessagesSent: metrics2.reduce((sum, m) => sum + m.messagesSent, 0),
          totalMessagesReceived: metrics2.reduce((sum, m) => sum + m.messagesReceived, 0),
          averageResponseRate: this.calculateAverageResponseRate(metrics2),
          totalErrors: metrics2.reduce((sum, m) => sum + m.errors, 0),
          daysActive: metrics2.length,
          healthScore: this.analyticsService.getHealthScore(compareInstance as string)
        },
        differences: {
          messagesSentDiff: metrics1.reduce((sum, m) => sum + m.messagesSent, 0) - 
                           metrics2.reduce((sum, m) => sum + m.messagesSent, 0),
          responseRateDiff: this.calculateAverageResponseRate(metrics1) - 
                           this.calculateAverageResponseRate(metrics2),
          errorsDiff: metrics1.reduce((sum, m) => sum + m.errors, 0) - 
                      metrics2.reduce((sum, m) => sum + m.errors, 0),
          healthScoreDiff: this.analyticsService.getHealthScore(instanceName) - 
                          this.analyticsService.getHealthScore(compareInstance as string)
        }
      };

      res.json({
        success: true,
        comparison
      });
    } catch (error) {
      logger.error('Error getting comparison:', error);
      res.status(500).json({ error: 'Failed to get comparison' });
    }
  };

  private calculateAverageResponseRate(metrics: any[]): number {
    if (metrics.length === 0) return 0;
    const totalSent = metrics.reduce((sum, m) => sum + m.messagesSent, 0);
    const totalReceived = metrics.reduce((sum, m) => sum + m.messagesReceived, 0);
    return totalSent > 0 ? totalReceived / totalSent : 0;
  }

  private getHealthStatus(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  }
}