import { WarmupService } from './warmup.service.js';
import { DailyMetrics } from '../types/warmup.js';
import { logger } from '../utils/logger.js';

export interface AnalyticsData {
  instanceName: string;
  period: string;
  metrics: {
    totalMessagesSent: number;
    totalMessagesReceived: number;
    averageResponseRate: number;
    totalErrors: number;
    averageMessagesPerDay: number;
    bestDay: { date: string; responseRate: number; messagesSent: number };
    worstDay: { date: string; responseRate: number; messagesSent: number };
    stageProgression: { stage: number; startDate: string; daysInStage: number }[];
  };
  trends: {
    responseRateTrend: number; // positive or negative percentage
    volumeTrend: number; // positive or negative percentage
    errorRateTrend: number; // positive or negative percentage
  };
  recommendations: string[];
}

export class AnalyticsService {
  private warmupService: WarmupService;

  constructor() {
    this.warmupService = new WarmupService();
  }

  generateAnalytics(instanceName: string, period: 'week' | 'month' | 'all' = 'week'): AnalyticsData {
    const metrics = this.warmupService.getMetrics(instanceName);
    const config = this.warmupService.getConfig(instanceName);
    
    if (!config) {
      throw new Error(`No config found for instance ${instanceName}`);
    }

    // Filter metrics by period
    const filteredMetrics = this.filterMetricsByPeriod(metrics, period);
    
    if (filteredMetrics.length === 0) {
      return this.getEmptyAnalytics(instanceName, period);
    }

    const totalMessagesSent = filteredMetrics.reduce((sum, m) => sum + m.messagesSent, 0);
    const totalMessagesReceived = filteredMetrics.reduce((sum, m) => sum + m.messagesReceived, 0);
    const totalErrors = filteredMetrics.reduce((sum, m) => sum + m.errors, 0);
    const averageResponseRate = totalMessagesSent > 0 ? totalMessagesReceived / totalMessagesSent : 0;
    const averageMessagesPerDay = filteredMetrics.length > 0 ? totalMessagesSent / filteredMetrics.length : 0;

    // Find best and worst days
    const bestDay = this.findBestDay(filteredMetrics);
    const worstDay = this.findWorstDay(filteredMetrics);

    // Calculate trends
    const trends = this.calculateTrends(filteredMetrics);

    // Generate stage progression
    const stageProgression = this.generateStageProgression(filteredMetrics);

    // Generate recommendations
    const recommendations = this.generateRecommendations(filteredMetrics, config.currentStage);

    return {
      instanceName,
      period,
      metrics: {
        totalMessagesSent,
        totalMessagesReceived,
        averageResponseRate,
        totalErrors,
        averageMessagesPerDay,
        bestDay,
        worstDay,
        stageProgression
      },
      trends,
      recommendations
    };
  }

  private filterMetricsByPeriod(metrics: DailyMetrics[], period: string): DailyMetrics[] {
    const now = new Date();
    let cutoffDate: Date;

    switch (period) {
      case 'week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
        return metrics;
      default:
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    return metrics.filter(m => new Date(m.date) >= cutoffDate);
  }

  private findBestDay(metrics: DailyMetrics[]): { date: string; responseRate: number; messagesSent: number } {
    if (metrics.length === 0) {
      return { date: '', responseRate: 0, messagesSent: 0 };
    }

    return metrics.reduce((best, current) => {
      return current.responseRate > best.responseRate ? current : best;
    });
  }

  private findWorstDay(metrics: DailyMetrics[]): { date: string; responseRate: number; messagesSent: number } {
    if (metrics.length === 0) {
      return { date: '', responseRate: 0, messagesSent: 0 };
    }

    return metrics.reduce((worst, current) => {
      return current.responseRate < worst.responseRate ? current : worst;
    });
  }

  private calculateTrends(metrics: DailyMetrics[]): { responseRateTrend: number; volumeTrend: number; errorRateTrend: number } {
    if (metrics.length < 2) {
      return { responseRateTrend: 0, volumeTrend: 0, errorRateTrend: 0 };
    }

    const firstHalf = metrics.slice(0, Math.floor(metrics.length / 2));
    const secondHalf = metrics.slice(Math.floor(metrics.length / 2));

    const firstHalfResponseRate = this.calculateAverageResponseRate(firstHalf);
    const secondHalfResponseRate = this.calculateAverageResponseRate(secondHalf);
    const responseRateTrend = ((secondHalfResponseRate - firstHalfResponseRate) / firstHalfResponseRate) * 100;

    const firstHalfVolume = this.calculateAverageVolume(firstHalf);
    const secondHalfVolume = this.calculateAverageVolume(secondHalf);
    const volumeTrend = ((secondHalfVolume - firstHalfVolume) / firstHalfVolume) * 100;

    const firstHalfErrorRate = this.calculateAverageErrorRate(firstHalf);
    const secondHalfErrorRate = this.calculateAverageErrorRate(secondHalf);
    const errorRateTrend = ((secondHalfErrorRate - firstHalfErrorRate) / firstHalfErrorRate) * 100;

    return {
      responseRateTrend: isNaN(responseRateTrend) ? 0 : responseRateTrend,
      volumeTrend: isNaN(volumeTrend) ? 0 : volumeTrend,
      errorRateTrend: isNaN(errorRateTrend) ? 0 : errorRateTrend
    };
  }

  private calculateAverageResponseRate(metrics: DailyMetrics[]): number {
    if (metrics.length === 0) return 0;
    const totalSent = metrics.reduce((sum, m) => sum + m.messagesSent, 0);
    const totalReceived = metrics.reduce((sum, m) => sum + m.messagesReceived, 0);
    return totalSent > 0 ? totalReceived / totalSent : 0;
  }

  private calculateAverageVolume(metrics: DailyMetrics[]): number {
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.messagesSent, 0) / metrics.length;
  }

  private calculateAverageErrorRate(metrics: DailyMetrics[]): number {
    if (metrics.length === 0) return 0;
    const totalSent = metrics.reduce((sum, m) => sum + m.messagesSent, 0);
    const totalErrors = metrics.reduce((sum, m) => sum + m.errors, 0);
    return totalSent > 0 ? totalErrors / totalSent : 0;
  }

  private generateStageProgression(metrics: DailyMetrics[]): { stage: number; startDate: string; daysInStage: number }[] {
    const stages: { [key: number]: { startDate: string; days: DailyMetrics[] } } = {};
    
    metrics.forEach(metric => {
      if (!stages[metric.stage]) {
        stages[metric.stage] = {
          startDate: metric.date,
          days: []
        };
      }
      stages[metric.stage].days.push(metric);
    });

    return Object.entries(stages).map(([stage, data]) => ({
      stage: parseInt(stage),
      startDate: data.startDate,
      daysInStage: data.days.length
    }));
  }

  private generateRecommendations(metrics: DailyMetrics[], currentStage: number): string[] {
    const recommendations: string[] = [];
    
    if (metrics.length === 0) {
      recommendations.push('Comece a enviar mensagens para coletar dados e análises.');
      return recommendations;
    }

    const recentMetrics = metrics.slice(-7); // Last 7 days
    const avgResponseRate = this.calculateAverageResponseRate(recentMetrics);
    const avgErrorRate = this.calculateAverageErrorRate(recentMetrics);
    const avgVolume = this.calculateAverageVolume(recentMetrics);

    // Response rate recommendations
    if (avgResponseRate < 0.5) {
      recommendations.push('Taxa de resposta baixa. Considere revisar o conteúdo das mensagens e a segmentação de contatos.');
    } else if (avgResponseRate > 0.8) {
      recommendations.push('Excelente taxa de resposta! Considere avançar para o próximo estágio.');
    }

    // Error rate recommendations
    if (avgErrorRate > 0.1) {
      recommendations.push('Alta taxa de erros. Verifique a conexão com a Evolution API e a validade dos contatos.');
    }

    // Volume recommendations
    const stages = this.warmupService.getAllStages();
    const currentStageConfig = stages.find(s => s.id === currentStage);
    
    if (currentStageConfig && avgVolume < currentStageConfig.maxDailyMessages * 0.5) {
      recommendations.push(`Volume abaixo do esperado para o estágio ${currentStage}. Considere aumentar gradualmente o número de mensagens.`);
    }

    // Stage advancement recommendations
    const canAdvance = this.checkStageAdvancement(metrics, currentStage);
    if (canAdvance) {
      recommendations.push('Os indicadores sugerem que você está pronto para avançar para o próximo estágio do warm-up.');
    }

    // Content diversity recommendations
    const mediaRate = recentMetrics.reduce((sum, m) => sum + m.mediaCount, 0) / 
                     recentMetrics.reduce((sum, m) => sum + m.messagesSent, 0);
    
    if (mediaRate < 0.1 && currentStage > 2) {
      recommendations.push('Considere adicionar mais conteúdo diversificado (imagens, documentos) para melhorar o engajamento.');
    }

    return recommendations;
  }

  private checkStageAdvancement(metrics: DailyMetrics[], currentStage: number): boolean {
    const stages = this.warmupService.getAllStages();
    const currentStageConfig = stages.find(s => s.id === currentStage);
    
    if (!currentStageConfig) return false;

    const recentMetrics = metrics.slice(-currentStageConfig.durationDays);
    if (recentMetrics.length < currentStageConfig.durationDays) return false;

    const avgResponseRate = this.calculateAverageResponseRate(recentMetrics);
    const avgErrorRate = this.calculateAverageErrorRate(recentMetrics);

    return avgResponseRate >= currentStageConfig.requiredResponseRate && avgErrorRate < 0.1;
  }

  private getEmptyAnalytics(instanceName: string, period: string): AnalyticsData {
    return {
      instanceName,
      period,
      metrics: {
        totalMessagesSent: 0,
        totalMessagesReceived: 0,
        averageResponseRate: 0,
        totalErrors: 0,
        averageMessagesPerDay: 0,
        bestDay: { date: '', responseRate: 0, messagesSent: 0 },
        worstDay: { date: '', responseRate: 0, messagesSent: 0 },
        stageProgression: []
      },
      trends: {
        responseRateTrend: 0,
        volumeTrend: 0,
        errorRateTrend: 0
      },
      recommendations: ['Comece a enviar mensagens para coletar dados e análises.']
    };
  }

  // Get health score (0-100)
  getHealthScore(instanceName: string): number {
    const metrics = this.warmupService.getMetrics(instanceName);
    
    if (metrics.length === 0) return 50; // Neutral score

    const recentMetrics = metrics.slice(-7);
    const avgResponseRate = this.calculateAverageResponseRate(recentMetrics);
    const avgErrorRate = this.calculateAverageErrorRate(recentMetrics);
    
    // Score components
    const responseScore = avgResponseRate * 50; // Max 50 points for response rate
    const errorScore = Math.max(0, 50 - (avgErrorRate * 500)); // Max 50 points, penalize errors
    
    return Math.min(100, Math.round(responseScore + errorScore));
  }

  // Export analytics data as CSV
  exportToCsv(instanceName: string): string {
    const metrics = this.warmupService.getMetrics(instanceName);
    
    const headers = [
      'Date',
      'Stage',
      'Messages Sent',
      'Messages Received',
      'Response Rate',
      'Media Count',
      'Unique Contacts',
      'Errors'
    ];

    const rows = metrics.map(m => [
      m.date,
      m.stage,
      m.messagesSent,
      m.messagesReceived,
      m.responseRate.toFixed(3),
      m.mediaCount,
      m.uniqueContacts,
      m.errors
    ]);

    return [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
  }
}