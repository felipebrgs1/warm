/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { WhatsAppApiController } from './controllers/api.controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "InstanceStatus": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "instance": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateInstanceResponse": {
        "dataType": "refObject",
        "properties": {
            "instance": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "qrcode": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "QrCodeResponse": {
        "dataType": "refObject",
        "properties": {
            "qrcode": {"dataType":"string"},
            "base64": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ConnectionState": {
        "dataType": "refObject",
        "properties": {
            "state": {"dataType":"string","required":true},
            "isConnected": {"dataType":"boolean","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SendMessageResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "messageId": {"dataType":"string","required":true},
            "timestamp": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SendMediaResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "messageId": {"dataType":"string","required":true},
            "timestamp": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetMessagesResponse": {
        "dataType": "refObject",
        "properties": {
            "messages": {"dataType":"array","array":{"dataType":"any"},"required":true},
            "count": {"dataType":"double","required":true},
            "timestamp": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WarmupStatus": {
        "dataType": "refObject",
        "properties": {
            "isRunning": {"dataType":"boolean","required":true},
            "currentStage": {"dataType":"double","required":true},
            "contacts": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AnalyticsResponse": {
        "dataType": "refObject",
        "properties": {
            "metrics": {"dataType":"any","required":true},
            "health": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DashboardResponse": {
        "dataType": "refObject",
        "properties": {
            "stats": {"dataType":"any","required":true},
            "charts": {"dataType":"any","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsWhatsAppApiController_getInstanceStatus: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
        };
        app.get('/api/whatsapp/instance/:instanceName/status',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.getInstanceStatus)),

            async function WhatsAppApiController_getInstanceStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_getInstanceStatus, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'getInstanceStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_createInstance: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"token":{"dataType":"string"},"instanceName":{"dataType":"string","required":true}}},
        };
        app.post('/api/whatsapp/instance/create',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.createInstance)),

            async function WhatsAppApiController_createInstance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_createInstance, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'createInstance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_getQrCode: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
        };
        app.get('/api/whatsapp/instance/:instanceName/qrcode',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.getQrCode)),

            async function WhatsAppApiController_getQrCode(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_getQrCode, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'getQrCode',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_getConnectionState: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
        };
        app.get('/api/whatsapp/instance/:instanceName/connection',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.getConnectionState)),

            async function WhatsAppApiController_getConnectionState(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_getConnectionState, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'getConnectionState',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_disconnectInstance: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
        };
        app.delete('/api/whatsapp/instance/:instanceName/disconnect',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.disconnectInstance)),

            async function WhatsAppApiController_disconnectInstance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_disconnectInstance, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'disconnectInstance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_sendMessage: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"linkPreview":{"dataType":"boolean"},"quoted":{"dataType":"string"},"delay":{"dataType":"double"},"text":{"dataType":"string","required":true},"number":{"dataType":"string","required":true}}},
        };
        app.post('/api/whatsapp/message/send/:instanceName',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.sendMessage)),

            async function WhatsAppApiController_sendMessage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_sendMessage, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'sendMessage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_sendMedia: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"fileName":{"dataType":"string"},"caption":{"dataType":"string"},"media":{"dataType":"string","required":true},"mediatype":{"dataType":"string","required":true},"number":{"dataType":"string","required":true}}},
        };
        app.post('/api/whatsapp/message/send-media/:instanceName',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.sendMedia)),

            async function WhatsAppApiController_sendMedia(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_sendMedia, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'sendMedia',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_getMessages: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
                limit: {"default":50,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/api/whatsapp/messages/:instanceName',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.getMessages)),

            async function WhatsAppApiController_getMessages(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_getMessages, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'getMessages',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_startWarmup: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"contacts":{"dataType":"array","array":{"dataType":"string"},"required":true},"instanceName":{"dataType":"string","required":true}}},
        };
        app.post('/api/whatsapp/warmup/start',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.startWarmup)),

            async function WhatsAppApiController_startWarmup(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_startWarmup, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'startWarmup',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_getWarmupStatus: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
        };
        app.get('/api/whatsapp/warmup/:instanceName/status',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.getWarmupStatus)),

            async function WhatsAppApiController_getWarmupStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_getWarmupStatus, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'getWarmupStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_sendWarmupMessage: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"force":{"dataType":"boolean"},"count":{"dataType":"double"}}},
        };
        app.post('/api/whatsapp/warmup/:instanceName/send',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.sendWarmupMessage)),

            async function WhatsAppApiController_sendWarmupMessage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_sendWarmupMessage, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'sendWarmupMessage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_advanceStage: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
        };
        app.post('/api/whatsapp/warmup/:instanceName/advance-stage',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.advanceStage)),

            async function WhatsAppApiController_advanceStage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_advanceStage, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'advanceStage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_getStages: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/whatsapp/warmup/stages',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.getStages)),

            async function WhatsAppApiController_getStages(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_getStages, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'getStages',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_getMetrics: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
                days: {"default":7,"in":"query","name":"days","dataType":"double"},
        };
        app.get('/api/whatsapp/warmup/:instanceName/metrics',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.getMetrics)),

            async function WhatsAppApiController_getMetrics(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_getMetrics, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'getMetrics',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_getAnalytics: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
        };
        app.get('/api/whatsapp/analytics/:instanceName',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.getAnalytics)),

            async function WhatsAppApiController_getAnalytics(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_getAnalytics, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'getAnalytics',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_getHealthScore: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
        };
        app.get('/api/whatsapp/analytics/:instanceName/health',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.getHealthScore)),

            async function WhatsAppApiController_getHealthScore(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_getHealthScore, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'getHealthScore',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_getDashboard: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
        };
        app.get('/api/whatsapp/analytics/:instanceName/dashboard',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.getDashboard)),

            async function WhatsAppApiController_getDashboard(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_getDashboard, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'getDashboard',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsWhatsAppApiController_exportMetrics: Record<string, TsoaRoute.ParameterSchema> = {
                instanceName: {"in":"path","name":"instanceName","required":true,"dataType":"string"},
        };
        app.get('/api/whatsapp/analytics/:instanceName/export',
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController)),
            ...(fetchMiddlewares<RequestHandler>(WhatsAppApiController.prototype.exportMetrics)),

            async function WhatsAppApiController_exportMetrics(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsWhatsAppApiController_exportMetrics, request, response });

                const controller = new WhatsAppApiController();

              await templateService.apiHandler({
                methodName: 'exportMetrics',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
