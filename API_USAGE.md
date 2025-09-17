# API WhatsApp Warm-up - Guia de Uso

## 🚀 Inicialização

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar servidor
npm run dev
```

## 📱 Fluxo Completo de Warm-up

### 1. Criar Instância WhatsApp
```bash
curl -X POST http://localhost:3000/api/whatsapp/instance/create \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "warmup-instance",
    "token": "seu-token-secreto"
  }'
```

**Resposta:**
```json
{
  "instance": "warmup-instance",
  "status": "connecting",
  "qrcode": "base64-qr-code"
}
```

### 2. Obter QR Code para Conexão
```bash
curl http://localhost:3000/api/whatsapp/instance/warmup-instance/qrcode
```

### 3. Verificar Status de Conexão
```bash
curl http://localhost:3000/api/whatsapp/instance/warmup-instance/status
```

**Resposta quando conectado:**
```json
{
  "status": "open",
  "connectionState": "CONNECTED",
  "owner": "5511999999999@s.whatsapp.net",
  "isConnected": true
}
```

### 4. Enviar Mensagem de Teste (Estágio 1)
```bash
curl -X POST http://localhost:3000/api/whatsapp/message/send/warmup-instance \
  -H "Content-Type: application/json" \
  -d '{
    "number": "5511988887777",
    "text": "Olá, este é um teste inicial do warm-up",
    "delay": 1000
  }'
```

### 5. Enviar Mensagem com Mídia (Estágio 3)
```bash
curl -X POST http://localhost:3000/api/whatsapp/message/send-media/warmup-instance \
  -H "Content-Type: application/json" \
  -d '{
    "number": "5511988887777",
    "mediatype": "image",
    "media": "https://exemplo.com/imagem.jpg",
    "caption": "Imagem de teste"
  }'
```

### 6. Buscar Mensagens Recebidas
```bash
curl "http://localhost:3000/api/whatsapp/messages/warmup-instance?limit=10"
```

## 📊 Monitoramento e Webhooks

### Webhook para Receber Mensagens
Configure na Evolution API para enviar para:
```
http://localhost:3000/api/whatsapp/webhook/message
```

### Exemplo de Payload Recebido:
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

## 🔧 Endpoints Disponíveis

### Instância Management
- `POST /api/whatsapp/instance/create` - Criar nova instância
- `GET /api/whatsapp/instance/:name/status` - Verificar status
- `GET /api/whatsapp/instance/:name/qrcode` - Obter QR code
- `GET /api/whatsapp/instance/:name/connection` - Estado da conexão
- `DELETE /api/whatsapp/instance/:name/disconnect` - Desconectar

### Mensagens
- `POST /api/whatsapp/message/send/:instanceName` - Enviar texto
- `POST /api/whatsapp/message/send-media/:instanceName` - Enviar mídia
- `GET /api/whatsapp/messages/:instanceName` - Listar mensagens

### Webhooks
- `POST /api/whatsapp/webhook/message` - Receber mensagens
- `POST /api/whatsapp/webhook/connection` - Atualizações de conexão

## 📈 Estratégia de Warm-up por Estágios

### Estágio 1 (Dia 1-3)
- Máximo 5 mensagens/dia
- Apenas contatos internos
- Mensagens simples e variadas
- 100% conversa bilateral

### Estágio 2 (Dia 4-7)
- Máximo 15 mensagens/dia
- 20% mídia leve
- 2-3 contatos externos
- 80% taxa de resposta

### Estágio 3 (Dia 8-14)
- Máximo 30 mensagens/dia
- Distribuídos em horários diferentes
- Conteúdo diversificado
- Monitoramento constante

### Estágio 4 (Dia 15-21)
- Máximo 50-100 mensagens/dia
- Vários formatos
- Testes de broadcast pequenos
- 60% taxa de resposta

## ⚠️ Boas Práticas

1. **Nunca enviar mensagens em massa no início**
2. **Sempre variar o conteúdo das mensagens**
3. **Garantir conversas bilaterais**
4. **Monitorar taxas de resposta**
5. **Respeitar limites diários**
6. **Usar múltiplos números para volumes altos**