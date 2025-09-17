import { Route, Controller, Get, Post, Body, Path, Query, Delete, Response } from 'tsoa';
import { WhatsAppController } from './whatsapp.controller';
import { WarmupController } from './warmup.controller';
import { AnalyticsController } from './analytics.controller';

// Response type interfaces
interface InstanceStatus {
    status: string;
    instance: string;
}

interface CreateInstanceResponse {
    instance: string;
    status: string;
    qrcode: string;
}

interface QrCodeResponse {
    qrcode?: string;
    base64?: string;
}

interface ConnectionState {
    state: string;
    isConnected: boolean;
}

interface SendMessageResponse {
    success: boolean;
    messageId: string;
    timestamp: string;
}

interface SendMediaResponse {
    success: boolean;
    messageId: string;
    timestamp: string;
}

interface GetMessagesResponse {
    messages: any[];
    count: number;
    timestamp: string;
}

interface WarmupStatus {
    isRunning: boolean;
    currentStage: number;
    contacts: string[];
}

interface AnalyticsResponse {
    metrics: any;
    health: number;
}

interface DashboardResponse {
    stats: any;
    charts: any;
}

@Route('api/whatsapp')
export class WhatsAppApiController extends Controller {
    private whatsAppController: WhatsAppController;
    private warmupController: WarmupController;
    private analyticsController: AnalyticsController;

    constructor() {
        super();
        this.whatsAppController = new WhatsAppController();
        this.warmupController = new WarmupController();
        this.analyticsController = new AnalyticsController();
    }

    @Get('instance/{instanceName}/status')
    @Response<InstanceStatus>(200, 'Instance status retrieved successfully')
    async getInstanceStatus(@Path() instanceName: string): Promise<InstanceStatus> {
        const req = { params: { instanceName } } as any;
        const res = {
            json: (data: any) => data,
            status: () => res,
        } as any;

        return this.whatsAppController.getStatus(req, res);
    }

    @Post('instance/create')
    @Response<CreateInstanceResponse>(200, 'Instance created successfully')
    async createInstance(
        @Body() body: { instanceName: string; token?: string },
    ): Promise<CreateInstanceResponse> {
        const req = { body } as any;
        const res = {
            json: (data: any) => data,
            status: () => res,
        } as any;

        const evolutionService =
            require('../services/evolution-api').EvolutionApiService;
        const service = new evolutionService();
        const instance = await service.createInstance(
            body.instanceName,
            body.token,
        );

        return {
            instance: instance.instance,
            status: instance.status,
            qrcode: instance.qrcode || 'QR code not available',
        };
    }

    @Get('instance/{instanceName}/qrcode')
    @Response<QrCodeResponse>(200, 'QR code retrieved successfully')
    async getQrCode(@Path() instanceName: string): Promise<QrCodeResponse> {
        const evolutionService =
            require('../services/evolution-api').EvolutionApiService;
        const service = new evolutionService();
        return service.getQrCode(instanceName);
    }

    @Get('instance/{instanceName}/connection')
    @Response<ConnectionState>(200, 'Connection state retrieved successfully')
    async getConnectionState(@Path() instanceName: string): Promise<ConnectionState> {
        const evolutionService =
            require('../services/evolution-api').EvolutionApiService;
        const service = new evolutionService();
        return service.getConnectionState(instanceName);
    }

    @Delete('instance/{instanceName}/disconnect')
    @Response<{ success: boolean }>(200, 'Instance disconnected successfully')
    async disconnectInstance(@Path() instanceName: string): Promise<{ success: boolean }> {
        const evolutionService =
            require('../services/evolution-api').EvolutionApiService;
        const service = new evolutionService();
        return service.disconnect(instanceName);
    }

    @Post('message/send/{instanceName}')
    @Response<SendMessageResponse>(200, 'Message sent successfully')
    async sendMessage(
        @Path() instanceName: string,
        @Body()
        body: {
            number: string;
            text: string;
            delay?: number;
            quoted?: string;
            linkPreview?: boolean;
        },
    ): Promise<SendMessageResponse> {
        const evolutionService =
            require('../services/evolution-api').EvolutionApiService;
        const service = new evolutionService();
        const messageData = {
            number: body.number.replace(/\D/g, ''),
            text: body.text,
            delay: body.delay || 0,
            quoted: body.quoted,
            linkPreview: body.linkPreview ?? true,
        };

        const result = await service.sendMessage(instanceName, messageData);

        return {
            success: true,
            messageId: result.key.id,
            timestamp: new Date().toISOString(),
        };
    }

    @Post('message/send-media/{instanceName}')
    @Response<SendMediaResponse>(200, 'Media sent successfully')
    async sendMedia(
        @Path() instanceName: string,
        @Body()
        body: {
            number: string;
            mediatype: string;
            media: string;
            caption?: string;
            fileName?: string;
        },
    ): Promise<SendMediaResponse> {
        const evolutionService =
            require('../services/evolution-api').EvolutionApiService;
        const service = new evolutionService();
        const mediaData = {
            number: body.number.replace(/\D/g, ''),
            mediatype: body.mediatype,
            media: body.media,
            caption: body.caption,
            fileName: body.fileName,
        };

        const result = await service.sendMedia(instanceName, mediaData);

        return {
            success: true,
            messageId: result.key.id,
            timestamp: new Date().toISOString(),
        };
    }

    @Get('messages/{instanceName}')
    @Response<GetMessagesResponse>(200, 'Messages retrieved successfully')
    async getMessages(
        @Path() instanceName: string,
        @Query() limit: number = 50,
    ): Promise<GetMessagesResponse> {
        const evolutionService =
            require('../services/evolution-api').EvolutionApiService;
        const service = new evolutionService();
        const messages = await service.fetchMessages(instanceName, limit);

        return {
            messages,
            count: messages.length,
            timestamp: new Date().toISOString(),
        };
    }

    @Post('warmup/start')
    @Response<{ success: boolean; message: string }>(200, 'Warmup started successfully')
    async startWarmup(
        @Body() body: { instanceName: string; contacts: string[] },
    ): Promise<{ success: boolean; message: string }> {
        const req = { body } as any;
        const res = {
            json: (data: any) => data,
            status: () => res,
        } as any;

        return this.warmupController.startWarmup(req, res);
    }

    @Get('warmup/{instanceName}/status')
    @Response<WarmupStatus>(200, 'Warmup status retrieved successfully')
    async getWarmupStatus(@Path() instanceName: string): Promise<WarmupStatus> {
        const req = { params: { instanceName } } as any;
        const res = {
            json: (data: any) => data,
            status: () => res,
        } as any;

        return this.warmupController.getWarmupStatus(req, res);
    }

    @Post('warmup/{instanceName}/send')
    @Response<{ success: boolean; sent: number }>(200, 'Warmup messages sent successfully')
    async sendWarmupMessage(
        @Path() instanceName: string,
        @Body() body: { count?: number; force?: boolean },
    ): Promise<{ success: boolean; sent: number }> {
        const req = { params: { instanceName }, body } as any;
        const res = {
            json: (data: any) => data,
            status: () => res,
        } as any;

        return this.warmupController.sendWarmupMessage(req, res);
    }

    @Post('warmup/{instanceName}/advance-stage')
    @Response<{ success: boolean; newStage: number }>(200, 'Stage advanced successfully')
    async advanceStage(@Path() instanceName: string): Promise<{ success: boolean; newStage: number }> {
        const req = { params: { instanceName } } as any;
        const res = {
            json: (data: any) => data,
            status: () => res,
        } as any;

        return this.warmupController.advanceStage(req, res);
    }

    @Get('warmup/stages')
    @Response<{ stages: string[] }>(200, 'Stages retrieved successfully')
    async getStages(): Promise<{ stages: string[] }> {
        const req = {} as any;
        const res = {
            json: (data: any) => data,
            status: () => res,
        } as any;

        return this.warmupController.getStages(req, res);
    }

    @Get('warmup/{instanceName}/metrics')
    @Response<{ metrics: any; period: string }>(200, 'Metrics retrieved successfully')
    async getMetrics(@Path() instanceName: string, @Query() days: number = 7): Promise<{ metrics: any; period: string }> {
        const req = { params: { instanceName }, query: { days } } as any;
        const res = {
            json: (data: any) => data,
            status: () => res,
        } as any;

        return this.warmupController.getMetrics(req, res);
    }

    @Get('analytics/{instanceName}')
    @Response<AnalyticsResponse>(200, 'Analytics retrieved successfully')
    async getAnalytics(@Path() instanceName: string): Promise<AnalyticsResponse> {
        const req = { params: { instanceName } } as any;
        const res = {
            json: (data: any) => data,
            status: () => res,
        } as any;

        return this.analyticsController.getAnalytics(req, res);
    }

    @Get('analytics/{instanceName}/health')
    @Response<{ score: number; status: string }>(200, 'Health score retrieved successfully')
    async getHealthScore(@Path() instanceName: string): Promise<{ score: number; status: string }> {
        const req = { params: { instanceName } } as any;
        const res = {
            json: (data: any) => data,
            status: () => res,
        } as any;

        return this.analyticsController.getHealthScore(req, res);
    }

    @Get('analytics/{instanceName}/dashboard')
    @Response<DashboardResponse>(200, 'Dashboard data retrieved successfully')
    async getDashboard(@Path() instanceName: string): Promise<DashboardResponse> {
        const req = { params: { instanceName } } as any;
        const res = {
            json: (data: any) => data,
            status: () => res,
        } as any;

        return this.analyticsController.getDashboard(req, res);
    }

    @Get('analytics/{instanceName}/export')
    @Response<{ data: any; format: string }>(200, 'Metrics exported successfully')
    async exportMetrics(@Path() instanceName: string): Promise<{ data: any; format: string }> {
        const req = { params: { instanceName } } as any;
        const res = {
            json: (data: any) => data,
            status: () => res,
        } as any;

        return this.analyticsController.exportMetrics(req, res);
    }
}
