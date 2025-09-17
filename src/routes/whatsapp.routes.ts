import { Router } from 'express';
import { EvolutionApiService } from '../services/evolution-api';
import { WebhookController } from '../controllers/webhook.controller';
import { logger } from '../utils/logger';

const whatsappRoutes = Router();
const evolutionService = new EvolutionApiService();
const webhookController = new WebhookController();

whatsappRoutes.get('/instance/:instanceName/status', async (req, res) => {
  try {
    const { instanceName } = req.params;
    const instance = await evolutionService.getInstance(instanceName);
    
    res.json({
      status: instance.status,
      connectionState: instance.connectionState,
      owner: instance.owner,
      isConnected: instance.status === 'open' && instance.connectionState === 'CONNECTED'
    });
  } catch (error) {
    logger.error('Error getting instance status:', error);
    res.status(500).json({ error: 'Failed to get instance status' });
  }
});

whatsappRoutes.post('/instance/create', async (req, res) => {
  try {
    const { instanceName, token } = req.body;
    
    if (!instanceName) {
      res.status(400).json({ error: 'instanceName is required' });
      return;
    }
    
    const instance = await evolutionService.createInstance(instanceName, token);
    
    res.json({
      instance: instance.instance,
      status: instance.status,
      qrcode: instance.qrcode || 'QR code not available'
    });
  } catch (error) {
    logger.error('Error creating instance:', error);
    res.status(500).json({ error: 'Failed to create instance' });
  }
});

whatsappRoutes.get('/instance/:instanceName/qrcode', async (req, res) => {
  try {
    const { instanceName } = req.params;
    const qrData = await evolutionService.getQrCode(instanceName);
    
    res.json(qrData);
  } catch (error) {
    logger.error('Error getting QR code:', error);
    res.status(500).json({ error: 'Failed to get QR code' });
  }
});

whatsappRoutes.get('/instance/:instanceName/connection', async (req, res) => {
  try {
    const { instanceName } = req.params;
    const connectionState = await evolutionService.getConnectionState(instanceName);
    
    res.json(connectionState);
  } catch (error) {
    logger.error('Error getting connection state:', error);
    res.status(500).json({ error: 'Failed to get connection state' });
  }
});

whatsappRoutes.delete('/instance/:instanceName/disconnect', async (req, res) => {
  try {
    const { instanceName } = req.params;
    const result = await evolutionService.disconnect(instanceName);
    
    res.json(result);
  } catch (error) {
    logger.error('Error disconnecting instance:', error);
    res.status(500).json({ error: 'Failed to disconnect instance' });
  }
});

whatsappRoutes.post('/message/send/:instanceName', async (req, res) => {
  try {
    const { instanceName } = req.params;
    const { number, text, delay = 0, quoted, linkPreview = true } = req.body;
    
    if (!number || !text) {
      res.status(400).json({ 
        error: 'number and text are required' 
      });
      return;
    }
    
    const messageData = {
      number: number.replace(/\D/g, ''),
      text,
      delay,
      quoted,
      linkPreview
    };
    
    const result = await evolutionService.sendMessage(instanceName, messageData);
    
    res.json({
      success: true,
      messageId: result.key.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

whatsappRoutes.post('/message/send-media/:instanceName', async (req, res) => {
  try {
    const { instanceName } = req.params;
    const { number, mediatype, media, caption, fileName } = req.body;
    
    if (!number || !mediatype || !media) {
      res.status(400).json({ 
        error: 'number, mediatype, and media are required' 
      });
      return;
    }
    
    const mediaData = {
      number: number.replace(/\D/g, ''),
      mediatype,
      media,
      caption,
      fileName
    };
    
    const result = await evolutionService.sendMedia(instanceName, mediaData);
    
    res.json({
      success: true,
      messageId: result.key.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error sending media:', error);
    res.status(500).json({ error: 'Failed to send media' });
  }
});

whatsappRoutes.get('/messages/:instanceName', async (req, res) => {
  try {
    const { instanceName } = req.params;
    const { limit = 50 } = req.query;
    
    const messages = await evolutionService.fetchMessages(
      instanceName, 
      Number(limit)
    );
    
    res.json({
      messages,
      count: messages.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

whatsappRoutes.post('/webhook/message', webhookController.handleIncomingMessage);
whatsappRoutes.post('/webhook/connection', webhookController.handleConnectionUpdate);

export { whatsappRoutes };