# 🚀 Avanço de Estágios - Warmup Avançado

## ✅ Recursos Implementados

### 📊 Gerenciamento de Estágios Inteligente
- **6 estágios progressivos** com limites e requisitos específicos
- **Avanço automático** baseado em métricas de desempenho
- **Validação de pré-requisitos** (taxa de resposta, erros, duração)

### 🔒 Controle de Limites Diários
- **Limites configuráveis** por estágio via variáveis de ambiente
- **Monitoramento em tempo real** de mensagens enviadas
- **Prevenção de exceder limites** com bloqueio automático

### ⏰ Sistema de Agendamento
- **Agendamento inteligente** baseado em distribuição de horários
- **Retentativas automáticas** com backoff exponencial
- **Processamento assíncrono** de mensagens agendadas

### 🎨 Diversificação de Conteúdo
- **Templates de mensagens** variados por categoria
- **Sistema de pesos** para evitar repetição
- **Suporte a múltiplos formatos** (texto, imagem, documento)

### 📈 Analytics e Monitoramento
- **Dashboard completo** com métricas em tempo real
- **Health score** (0-100) para avaliar saúde da instância
- **Análise de tendências** e recomendações automáticas
- **Exportação de dados** em CSV

## 🎯 Novos Endpoints da API

### Warmup Management
```bash
# Iniciar warm-up
POST /api/whatsapp/warmup/start
{
  "instanceName": "warmup-instance",
  "contacts": ["5511988887777", "5511977776666"]
}

# Status do warm-up
GET /api/whatsapp/warmup/warmup-instance/status

# Enviar mensagens de warm-up
POST /api/whatsapp/warmup/warmup-instance/send
{
  "count": 3
}

# Avançar estágio manualmente
POST /api/whatsapp/warmup/warmup-instance/advance-stage
```

### Analytics
```bash
# Dashboard completo
GET /api/whatsapp/analytics/warmup-instance/dashboard

# Health score
GET /api/whatsapp/analytics/warmup-instance/health

# Analytics detalhados
GET /api/whatsapp/analytics/warmup-instance?period=week

# Exportar métricas
GET /api/whatsapp/analytics/warmup-instance/export?format=csv
```

## 📋 Fluxo Avançado de Warm-up

### Estágio 1 → Estágio 6 (Progressão Automática)

1. **Estágio 1** (Dias 1-3)
   - 5 mensagens/dia
   - Apenas contatos internos
   - Taxa de resposta requerida: 100%

2. **Estágio 2** (Dias 4-7)  
   - 15 mensagens/dia
   - 20% mídia permitida
   - Até 3 contatos externos
   - Taxa de resposta requerida: 80%

3. **Estágio 3** (Dias 8-14)
   - 30 mensagens/dia
   - Distribuição em 7 horários
   - Até 5 contatos externos
   - Taxa de resposta requerida: 70%

4. **Estágio 4** (Dias 15-21)
   - 50 mensagens/dia
   - 9 horários diferentes
   - Até 10 contatos externos
   - Taxa de resposta requerida: 60%

5. **Estágio 5** (Dias 22-28)
   - 100 mensagens/dia
   - 12 horários diferentes
   - Até 20 contatos externos
   - Taxa de resposta requerida: 60%

6. **Estágio 6** (Dia 29+)
   - 200 mensagens/dia
   - Produção controlada
   - Até 50 contatos externos
   - Taxa de resposta requerida: 50%

## 🎛️ Recursos de Controle

### Validação de Avanço
- **Duração mínima** no estágio
- **Taxa de resposta** mínima
- **Taxa de erros** máxima (10%)
- **Consistência** de envios

### Monitoramento de Saúde
- **Health Score** 0-100
- **Recomendações** automáticas
- **Alertas** de problemas
- **Tendências** de desempenho

### Agendamento Inteligente
- **Distribuição natural** ao longo do dia
- **Respeito a limites** diários
- **Retentativas automáticas**
- **Cancelamento** de mensagens falhas

## 🔄 Exemplo de Uso Avançado

```bash
# 1. Iniciar warm-up avançado
curl -X POST http://localhost:3000/api/whatsapp/warmup/start \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "business-instance",
    "contacts": [
      "5511988887777", "5511977776666", "5511966665555",
      "5511955554444", "5511944443333", "5511933332222",
      "5511922221111", "5511911110000"
    ]
  }'

# 2. Enviar lote de mensagens
curl -X POST http://localhost:3000/api/whatsapp/warmup/business-instance/send \
  -H "Content-Type: application/json" \
  -d '{"count": 5}'

# 3. Verificar dashboard
curl http://localhost:3000/api/whatsapp/analytics/business-instance/dashboard

# 4. Verificar se pode avançar de estágio
curl http://localhost:3000/api/whatsapp/warmup/business-instance/status

# 5. Avançar estágio (se elegível)
curl -X POST http://localhost:3000/api/whatsapp/warmup/business-instance/advance-stage
```

## 📊 Métricas e Análises

### Dashboard Completo
- **Status atual** do warm-up
- **Métricas do dia** e da semana
- **Health score** e status
- **Limites e restrições** do estágio
- **Indicadores de avanço**

### Analytics Detalhados
- **Tendências** de resposta e volume
- **Melhores e piores dias**
- **Progressão por estágio**
- **Recomendações personalizadas**

### Exportação de Dados
- **CSV** com todas as métricas
- **Comparação** entre instâncias
- **Relatórios** de desempenho

## 🎯 Próximos Passos

O sistema agora suporta:
- ✅ **Gerenciamento completo** de estágios
- ✅ **Controle inteligente** de limites
- ✅ **Agendamento automatizado**
- ✅ **Analytics avançados**
- ✅ **Monitoramento de saúde**

**Pronto para uso em produção com estratégia de warm-up completa!** 🚀