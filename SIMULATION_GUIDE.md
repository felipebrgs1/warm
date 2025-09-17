# 🚀 Simulação de Funcionamento da Aplicação

## Como Funciona a Aplicação WhatsApp Warm-up

### 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend/CLI  │    │   API Warm-up    │    │ Evolution API   │
│                 │◄──►│                 │◄──►│                 │
│  • Web Interface│    │  • Node.js/TS   │    │  • WhatsApp     │
│  • CLI Scripts  │    │  • Express      │    │  • Instances    │
│  • curl exemplos│    │  • Webhooks      │    │  • Messages     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 📋 Fluxo Completo de Operação

#### 1. Inicialização
```bash
# Iniciar servidor
npm run dev

# Servidor escutando em:
# • http://localhost:3000 (API)
# • Webhooks: /api/whatsapp/webhook/*
```

#### 2. Ciclo de Vida de uma Instância

**Criação:**
```bash
POST /api/whatsapp/instance/create
{
  "instanceName": "warmup-instance",
  "token": "secret-token"
}
```

**Conexão:**
1. Usuário escaneia QR code via `/api/whatsapp/instance/:name/qrcode`
2. Sistema monitora status via `/api/whatsapp/instance/:name/status`
3. Quando `isConnected: true`, instância está pronta

**Uso:**
- Enviar mensagens via API endpoints
- Receber webhooks para mensagens entrantes
- Monitorar métricas e status

#### 3. Estratégia de Warm-up Implementada

**Estágio 1 (Dias 1-3):**
- Máximo 5 mensagens/dia
- Contatos internos apenas
- Mensagens simples e variadas
- 100% conversa bilateral

**Estágio 2 (Dias 4-7):**
- Máximo 15 mensagens/dia  
- 20% mídia leve (imagens, PDFs)
- 2-3 contatos externos
- 80% taxa de resposta

**Estágio 3 (Dias 8-14):**
- Máximo 30 mensagens/dia
- Distribuídos em diferentes horários
- Conteúdo diversificado
- Monitoramento constante

**Estágio 4 (Dias 15-21):**
- Máximo 50-100 mensagens/dia
- Vários formatos (texto, áudio, mídia)
- Testes de broadcast pequenos
- 60% taxa de resposta mínima

### 🔄 Exemplo Prático de Uso

#### Via Script Interativo:
```bash
./scripts/simulate-warmup.sh
```

Este script oferece:
1. Menu interativo para operações
2. Simulação passo a passo
3. Monitoramento em tempo real
4. Logs detalhados

#### Via API Direta:
```bash
# 1. Criar instância
curl -X POST http://localhost:3000/api/whatsapp/instance/create \
  -H "Content-Type: application/json" \
  -d '{"instanceName": "warmup-instance"}'

# 2. Verificar status (aguardar conexão via QR code)
curl http://localhost:3000/api/whatsapp/instance/warmup-instance/status

# 3. Enviar mensagens de warm-up
curl -X POST http://localhost:3000/api/whatsapp/message/send/warmup-instance \
  -H "Content-Type: application/json" \
  -d '{"number": "5511988887777", "text": "Bom dia! Teste de warm-up"}'

# 4. Verificar mensagens recebidas
curl http://localhost:3000/api/whatsapp/messages/warmup-instance
```

### 📊 Monitoramento e Métricas

#### Webhooks Recebidos:
```json
{
  "instance": "warmup-instance",
  "message": {
    "key": {
      "remoteJid": "5511988887777@s.whatsapp.net",
      "fromMe": false,
      "id": "ABC123"
    },
    "message": {
      "conversation": "Obrigado pela mensagem!"
    },
    "messageTimestamp": 1634567890,
    "messageType": "conversation"
  }
}
```

#### Status da Instância:
```json
{
  "status": "open",
  "connectionState": "CONNECTED",
  "owner": "5511999999999@s.whatsapp.net",
  "isConnected": true
}
```

### 🛡️ Segurança e Boas Práticas

1. **Variáveis de Ambiente:**
   - `EVOLUTION_API_URL` e `EVOLUTION_API_KEY` em `.env`
   - Nunca commitar credenciais no repositório

2. **Limites de Rate:**
   - Respeitar limites diários por estágio
   - Monitorar respostas e ajustar volumes

3. **Monitoramento:**
   - Logs detalhados de todas as operações
   - Webhooks para mensagens recebidas
   - Status checking periódico

### 🚀 Como Executar

#### Desenvolvimento:
```bash
npm install
cp .env.example .env
npm run dev
```

#### Simulação:
```bash
# Via script
./scripts/simulate-warmup.sh

# Via código
npm run build
node -e "require('./dist/simulators/warmup-simulator').runWarmupSimulation()"
```

#### Testes:
```bash
npm test          # Testes unitários
npm run typecheck # Verificação de tipos
npm run lint      # Análise de código
```

### 📈 Resultados Esperados

Após 21 dias seguindo o protocolo:

- ✅ Número aquecido e com boa reputação
- ✅ Capacidade de enviar 200+ mensagens/dia
- ✅ Alta taxa de entrega (90%+)
- ✅ Baixo risco de bloqueio
- ✅ Pronto para produção controlada

A aplicação implementa uma estratégia conservadora e segura para warm-up de números WhatsApp, seguindo as melhores práticas da Evolution API e garantindo a saúde e reputação dos números utilizados.