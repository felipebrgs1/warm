# Roadmap de Warm-up para Números WhatsApp (via Evolution API)

Este documento descreve uma sequência de estágios para realizar o warm-up (aquecimento gradual) de números de WhatsApp por meio da **Evolution API**.  
A estratégia é conservadora, privilegiando entregabilidade, reputação do número e redução de riscos de bloqueio.
Projeto deve ser em TS/Node.js, utilizando boas práticas, mvc, e testes unitários em vitest.
DockerFile e docker-compose para facilitar deploy local e em servidores.
---

## Estágio 1 - Setup e Validações Iniciais
- Obter credenciais de acesso à Evolution API e configurar ambiente seguro (env vars, autenticação).
- Conectar o(s) número(s) de WhatsApp no painel e validar status ativo (`CONNECTED`).
- Testar envio de mensagens manuais simples (ex: "Olá, este é um teste").
- Confirmar que o recebimento de mensagens está funcionando.

**Entrega concreta:**  
Um número de WhatsApp funcional, autenticado e capaz de enviar/receber mensagens via API.

---

## Estágio 2 - Envio Muito Limitado
- Enviar até 5 mensagens/dia para contatos **de confiança** (equipe interna).
- Mensagens devem ser simples, curtas e diferentes umas das outras para simular uso natural.
- Garantir que **todas** tenham resposta do destinatário (conversa bilateral).
- Monitorar métricas de entrega no painel da Evolution.

**Entrega concreta:**  
Histórico com pelo menos 20 mensagens trocadas (ida e volta) sem bloqueio.

---

## Estágio 3 - Aumento Gradual e Diversificação
- Aumentar gradualmente para 10-15 mensagens/dia.
- Incluir mensagens de mídia leve (ex: imagem ou PDF pequeno) em até 20% dos envios.
- Garantir variedade de conteúdos para não parecer automatizado.
- Iniciar contatos com até 2-3 números externos, sempre pedindo resposta.

**Entrega concreta:**  
Log de pelo menos 50-100 mensagens trocadas com diferentes tipos de conteúdo.

---

## Estágio 4 - Simulação de Conversas Naturais
- Ampliar até 30 mensagens/dia, já distribuídas em **blocos diferentes do dia** (manhã, tarde, noite).
- Intensificar respostas rápidas (receber → responder).
- Enviar conteúdos de uso comum: lembretes, avisos curtos, mensagens de teste simulando cases reais.
- Continuar monitoramento de métricas e checar alertas da Evolution API.

**Entrega concreta:**  
Número estável com conversas distribuídas em horários distintos, sem flags no painel.

---

## Estágio 5 - Pré-produção (Ramp-up Final)
- Elevar gradualmente a faixa de 50-100 mensagens/dia, sempre dentro de limites conservadores.
- Incluir variedade de formatos: texto, áudio, mídia, links (usando com cuidado).
- Garantir que pelo menos 60% dos envios resultem em resposta.
- Criar testes controlados de broadcast pequeno (exemplo: 5 contatos ao mesmo tempo).

**Entrega concreta:**  
Número testado em volume moderado, validado como estável, pronto para testes de produção.

---

## Estágio 6 - Produção Controlada
- Ativar uso real com usuários finais, ainda mantendo volume máximo de **200 mensagens/dia por número**.
- Segmentar listas pequenas e validar taxas de resposta.
- Continuar enviando mensagens personalizadas, evitando spam.
- Revisar frequentemente métricas de entrega, bloqueios e feedback.

**Entrega concreta:**  
Número em produção, entregando consistentemente, mantendo boa reputação.

---

## Observações Importantes
- Nunca iniciar envios em massa logo no começo.
- Sempre variar o conteúdo e evitar mensagens repetitivas.
- Garantir que a cada aumento de volume haja logs de boas entregas anteriores.
- Usar múltiplos números de forma gradual caso o volume total esperado seja alto.
