import { Request, Response } from 'express';
import { logger } from '../utils/logger.js';

export interface WebhookMessage {
  instance: string;
  message: {
    key: {
      remoteJid: string;
      fromMe: boolean;
      id: string;
    };
    message: {
      conversation?: string;
      extendedTextMessage?: {
        text: string;
      };
      imageMessage?: {
        caption?: string;
        url: string;
      };
      videoMessage?: {
        caption?: string;
        url: string;
      };
      audioMessage?: {
        url: string;
      };
      documentMessage?: {
        caption?: string;
        url: string;
        fileName?: string;
      };
    };
    messageTimestamp: number;
    messageType: string;
  };
}

export class WebhookController {
  async handleIncomingMessage(req: Request, res: Response) {
    try {
      const webhookData: WebhookMessage = req.body;
      
      logger.info('Received webhook message:', {
        instance: webhookData.instance,
        from: webhookData.message.key.remoteJid,
        fromMe: webhookData.message.key.fromMe,
        messageType: webhookData.message.messageType,
        timestamp: new Date(webhookData.message.messageTimestamp * 1000).toISOString()
      });
      
      const messageContent = this.extractMessageContent(webhookData.message);
      
      logger.info('Message content:', messageContent);
      
      res.status(200).json({ 
        status: 'success',
        message: 'Webhook received and processed'
      });
    } catch (error) {
      logger.error('Error processing webhook:', error);
      res.status(500).json({ 
        status: 'error',
        message: 'Failed to process webhook'
      });
    }
  }

  async handleConnectionUpdate(req: Request, res: Response) {
    try {
      const { instance, status } = req.body;
      
      logger.info('Connection status update:', {
        instance,
        status,
        timestamp: new Date().toISOString()
      });
      
      res.status(200).json({ 
        status: 'success',
        message: 'Connection update received'
      });
    } catch (error) {
      logger.error('Error processing connection update:', error);
      res.status(500).json({ 
        status: 'error',
        message: 'Failed to process connection update'
      });
    }
  }

  private extractMessageContent(message: WebhookMessage['message']) {
    const messageType = message.messageType;
    const messageContent = message.message;
    
    switch (messageType) {
      case 'conversation':
        return {
          type: 'text',
          content: messageContent.conversation,
          fromMe: message.key.fromMe,
          remoteJid: message.key.remoteJid
        };
      
      case 'extendedTextMessage':
        return {
          type: 'text',
          content: messageContent.extendedTextMessage?.text,
          fromMe: message.key.fromMe,
          remoteJid: message.key.remoteJid
        };
      
      case 'imageMessage':
        return {
          type: 'image',
          content: messageContent.imageMessage?.caption || '',
          url: messageContent.imageMessage?.url,
          fromMe: message.key.fromMe,
          remoteJid: message.key.remoteJid
        };
      
      case 'videoMessage':
        return {
          type: 'video',
          content: messageContent.videoMessage?.caption || '',
          url: messageContent.videoMessage?.url,
          fromMe: message.key.fromMe,
          remoteJid: message.key.remoteJid
        };
      
      case 'audioMessage':
        return {
          type: 'audio',
          content: '',
          url: messageContent.audioMessage?.url,
          fromMe: message.key.fromMe,
          remoteJid: message.key.remoteJid
        };
      
      case 'documentMessage':
        return {
          type: 'document',
          content: messageContent.documentMessage?.caption || '',
          url: messageContent.documentMessage?.url,
          fileName: messageContent.documentMessage?.fileName,
          fromMe: message.key.fromMe,
          remoteJid: message.key.remoteJid
        };
      
      default:
        return {
          type: messageType,
          content: 'Unsupported message type',
          fromMe: message.key.fromMe,
          remoteJid: message.key.remoteJid
        };
    }
  }
}