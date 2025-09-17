import { EvolutionApiService } from '../services/evolution-api.js';
import { logger } from '../utils/logger.js';

class WhatsAppWarmupSimulator {
  private evolutionService: EvolutionApiService;
  private instanceName: string;

  constructor(instanceName: string) {
    this.evolutionService = new EvolutionApiService();
    this.instanceName = instanceName;
  }

  async simulateCompleteWarmup() {
    logger.info('🚀 Iniciando simulação completa do warm-up WhatsApp');

    try {
      // Etapa 1: Setup e Validação
      await this.setupAndValidate();
      
      // Etapa 2: Envio Limitado
      await this.stage1LimitedSending();
      
      // Etapa 3: Aumento Gradual
      await this.stage2GradualIncrease();
      
      // Etapa 4: Conversas Naturais
      await this.stage3NaturalConversations();
      
      logger.info('✅ Simulação de warm-up concluída com sucesso!');
      
    } catch (error) {
      logger.error('❌ Erro na simulação:', error);
    }
  }

  private async setupAndValidate() {
    logger.info('📱 Etapa 1: Setup e Validações Iniciais');
    
    // Criar instância
    logger.info('Criando instância WhatsApp...');
    const instance = await this.evolutionService.createInstance(this.instanceName);
    logger.info('Instância criada:', { instance: instance.instance, status: instance.status });

    // Simular conexão (na prática, usuário precisaria escanear QR code)
    logger.info('Simulando conexão com QR code...');
    await this.delay(3000);
    
    // Verificar status
    logger.info('Verificando status de conexão...');
    const status = await this.evolutionService.getInstance(this.instanceName);
    logger.info('Status:', { status: status.status, connectionState: status.connectionState });
  }

  private async stage1LimitedSending() {
    logger.info('📊 Etapa 2: Envio Muito Limitado (5 mensagens/dia)');
    
    const contacts = [
      '5511988887777',
      '5511977776666', 
      '5511966665555',
      '5511955554444',
      '5511944443333'
    ];

    const messages = [
      'Bom dia! Testando o nosso sistema de comunicação.',
      'Olá, tudo bem? Verificando o envio de mensagens.',
      'Oi, este é um teste de warm-up do nosso número.',
      'Hello! Testando a conectividade do WhatsApp.',
      'Oi pessoal, mensagem de teste da equipe.'
    ];

    for (let i = 0; i < contacts.length; i++) {
      logger.info(`Enviando mensagem ${i + 1}/5 para ${contacts[i]}`);
      
      try {
        await this.evolutionService.sendMessage(this.instanceName, {
          number: contacts[i],
          text: messages[i],
          delay: 2000
        });
        
        logger.info(`✅ Mensagem ${i + 1} enviada com sucesso`);
        
        // Simular resposta (no mundo real, viria via webhook)
        await this.simulateResponse(contacts[i]);
        
        // Delay entre mensagens
        await this.delay(5000);
        
      } catch (error) {
        logger.error(`❌ Erro ao enviar mensagem ${i + 1}:`, error);
      }
    }
    
    logger.info('📈 Estágio 1 concluído: 5 mensagens enviadas');
  }

  private async stage2GradualIncrease() {
    logger.info('📈 Etapa 3: Aumento Gradual e Diversificação (10-15 mensagens/dia)');
    
    const extendedContacts = [
      '5511988887777', '5511977776666', '5511966665555',
      '5511955554444', '5511944443333', '5511933332222',
      '5511922221111', '5511911110000'
    ];

    const diverseMessages = [
      'Bom dia! Como você está?',
      'Testando nosso sistema com diferentes tipos de conteúdo.',
      'Olá! Mensagem de teste número 2 do dia.',
      'Oi, tudo bem? Verificando a entrega.',
      'Boa tarde! Testando horários diferentes.',
      'Hello! Another test message.',
      'Oi, mensagem de diversificação de conteúdo.',
      'Bom dia! Testando variações de texto.',
      'Olá! Verificando consistência de envio.',
      'Hi! Testing message delivery.',
      'Oi, mensagem teste para monitoramento.',
      'Bom dia! Mais um teste de warm-up.',
      'Olá! Ajustando parâmetros de envio.',
      'Hi! Final test messages for today.'
    ];

    for (let i = 0; i < 12; i++) {
      const contactIndex = i % extendedContacts.length;
      logger.info(`Enviando mensagem ${i + 1}/12 para ${extendedContacts[contactIndex]}`);
      
      try {
        await this.evolutionService.sendMessage(this.instanceName, {
          number: extendedContacts[contactIndex],
          text: diverseMessages[i],
          delay: 1500
        });
        
        logger.info(`✅ Mensagem ${i + 1} enviada`);
        
        // 20% chance de enviar mídia
        if (Math.random() < 0.2) {
          logger.info('📎 Enviando mídia adicional...');
          await this.evolutionService.sendMedia(this.instanceName, {
            number: extendedContacts[contactIndex],
            mediatype: 'image',
            media: 'https://via.placeholder.com/400x300.png?text=Test+Image',
            caption: 'Imagem de teste'
          });
        }
        
        await this.delay(4000);
        
      } catch (error) {
        logger.error(`❌ Erro no envio ${i + 1}:`, error);
      }
    }
    
    logger.info('📊 Estágio 2 concluído: 12 mensagens enviadas');
  }

  private async stage3NaturalConversations() {
    logger.info('🔄 Etapa 4: Simulação de Conversas Naturais (30 mensagens/dia)');
    
    const contacts = [
      '5511988887777', '5511977776666', '5511966665555'
    ];

    const conversationFlows = [
      // Manhã
      [
        'Bom dia! Como foi sua noite?',
        'Tudo bem para hoje?',
        'Lembrete: reunião às 10h'
      ],
      // Tarde  
      [
        'Boa tarde! Alguma atualização?',
        'Oi, verificando o andamento',
        'Tudo certo por aí?'
      ],
      // Noite
      [
        'Boa noite! Finalizando o dia',
        'Como foram as atividades?',
        'Até amanhã!'
      ]
    ];

    const timesOfDay = ['manhã', 'tarde', 'noite'];
    
    for (let day = 0; day < 3; day++) {
      logger.info(`📅 Dia ${day + 1} do Estágio 4`);
      
      for (let timeIndex = 0; timeIndex < timesOfDay.length; timeIndex++) {
        logger.info(`🕐 Enviando mensagens da ${timesOfDay[timeIndex]}`);
        
        for (let contactIndex = 0; contactIndex < contacts.length; contactIndex++) {
          const flow = conversationFlows[timeIndex];
          
          for (let msgIndex = 0; msgIndex < flow.length; msgIndex++) {
            logger.info(`Enviando para ${contacts[contactIndex]}: ${flow[msgIndex]}`);
            
            try {
              await this.evolutionService.sendMessage(this.instanceName, {
                number: contacts[contactIndex],
                text: flow[msgIndex],
                delay: 1000
              });
              
              // Simular resposta rápida
              await this.delay(2000);
              await this.simulateQuickResponse(contacts[contactIndex]);
              
              await this.delay(3000);
              
            } catch (error) {
              logger.error('❌ Erro no envio:', error);
            }
          }
        }
        
        // Intervalo entre períodos do dia
        await this.delay(10000);
      }
      
      logger.info(`✅ Dia ${day + 1} concluído`);
    }
    
    logger.info('🎯 Estágio 4 concluído: Conversas naturais simuladas');
  }

  private async simulateResponse(phone: string) {
    logger.info(`📨 Simulando resposta de ${phone}...`);
    // Na prática, esta resposta viria via webhook
    await this.delay(1000);
  }

  private async simulateQuickResponse(phone: string) {
    logger.info(`⚡ Simulando resposta rápida de ${phone}...`);
    // Simular resposta rápida para conversas naturais
    await this.delay(500);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Função para executar a simulação
export async function runWarmupSimulation() {
  const simulator = new WhatsAppWarmupSimulator('warmup-instance');
  await simulator.simulateCompleteWarmup();
}

// Executar se chamado diretamente
if (require.main === module) {
  runWarmupSimulation().catch(console.error);
}