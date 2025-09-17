import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger.js';

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

export class EvolutionApiService {
  private api: AxiosInstance;
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
    this.apiKey = process.env.EVOLUTION_API_KEY || '';
    
    this.api = axios.create({
      baseURL: `${this.baseUrl}/api`,
      headers: {
        'apikey': this.apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  async getInstance(instanceName: string): Promise<WhatsAppInstance> {
    try {
      const response = await this.api.get(`/instance/${instanceName}`);
      return response.data;
    } catch (error) {
      logger.error('Error getting instance:', error);
      throw new Error(`Failed to get instance: ${error}`);
    }
  }

  async createInstance(instanceName: string, token?: string): Promise<WhatsAppInstance> {
    try {
      const response = await this.api.post('/instance/create', {
        instanceName,
        qrcode: true,
        token
      });
      return response.data;
    } catch (error) {
      logger.error('Error creating instance:', error);
      throw new Error(`Failed to create instance: ${error}`);
    }
  }

  async getQrCode(instanceName: string): Promise<{ qrcode: string; paired: boolean }> {
    try {
      const response = await this.api.get(`/instance/qrcode/${instanceName}`);
      return response.data;
    } catch (error) {
      logger.error('Error getting QR code:', error);
      throw new Error(`Failed to get QR code: ${error}`);
    }
  }

  async getConnectionState(instanceName: string): Promise<{ state: string; status: string }> {
    try {
      const response = await this.api.get(`/instance/connectionState/${instanceName}`);
      return response.data;
    } catch (error) {
      logger.error('Error getting connection state:', error);
      throw new Error(`Failed to get connection state: ${error}`);
    }
  }

  async sendMessage(instanceName: string, messageData: MessageData): Promise<any> {
    try {
      const response = await this.api.post(`/message/sendText/${instanceName}`, messageData);
      return response.data;
    } catch (error) {
      logger.error('Error sending message:', error);
      throw new Error(`Failed to send message: ${error}`);
    }
  }

  async sendMedia(instanceName: string, data: {
    number: string;
    mediatype: 'image' | 'video' | 'audio' | 'document';
    media: string;
    caption?: string;
    fileName?: string;
  }): Promise<any> {
    try {
      const response = await this.api.post(`/message/sendMedia/${instanceName}`, data);
      return response.data;
    } catch (error) {
      logger.error('Error sending media:', error);
      throw new Error(`Failed to send media: ${error}`);
    }
  }

  async fetchMessages(instanceName: string, limit?: number): Promise<any[]> {
    try {
      const response = await this.api.get(`/message/fetch/${instanceName}`, {
        params: { limit: limit || 50 }
      });
      return response.data;
    } catch (error) {
      logger.error('Error fetching messages:', error);
      throw new Error(`Failed to fetch messages: ${error}`);
    }
  }

  async disconnect(instanceName: string): Promise<any> {
    try {
      const response = await this.api.delete(`/instance/logout/${instanceName}`);
      return response.data;
    } catch (error) {
      logger.error('Error disconnecting instance:', error);
      throw new Error(`Failed to disconnect instance: ${error}`);
    }
  }
}