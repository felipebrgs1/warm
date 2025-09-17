import { Request, Response } from 'express';
import { EvolutionApiService } from '../services/evolution-api.js';
import { logger } from '../utils/logger.js';

export class WhatsAppController {
  private evolutionService: EvolutionApiService;

  constructor() {
    this.evolutionService = new EvolutionApiService();
  }

  getStatus = async (req: Request, res: Response) => {
    try {
      const { instanceName } = req.params;
      const instance = await this.evolutionService.getInstance(instanceName);
      res.json({ 
        status: instance.status,
        connectionState: instance.connectionState,
        isConnected: instance.status === 'open' && instance.connectionState === 'CONNECTED'
      });
    } catch (error) {
      logger.error('Error getting status:', error);
      res.status(500).json({ error: 'Failed to get status' });
    }
  };

  sendMessage = async (req: Request, res: Response) => {
    try {
      const { instanceName, phoneNumber, message } = req.body;
      const result = await this.evolutionService.sendMessage(instanceName, {
        number: phoneNumber,
        text: message
      });
      res.json({ success: true, result });
    } catch (error) {
      logger.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  };

  validateConnection = async (req: Request, res: Response) => {
    try {
      const { instanceName } = req.body;
      const instance = await this.evolutionService.getInstance(instanceName);
      const isConnected = instance.status === 'open' && instance.connectionState === 'CONNECTED';
      res.json({ connected: isConnected });
    } catch (error) {
      logger.error('Error validating connection:', error);
      res.status(500).json({ error: 'Failed to validate connection' });
    }
  };
}