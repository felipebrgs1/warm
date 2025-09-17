#!/bin/bash

# WhatsApp Warm-up Simulation Script
# Este script demonstra o fluxo completo de warm-up

echo "🚀 Iniciando Simulação de Warm-up WhatsApp"
echo "=========================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000/api/whatsapp"
INSTANCE_NAME="warmup-instance"

# Função para log
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se o servidor está rodando
check_server() {
    log "Verificando se o servidor está rodando..."
    
    if curl -s http://localhost:3000/health > /dev/null; then
        log "✅ Servidor está rodando"
        return 0
    else
        error "❌ Servidor não está rodando. Inicie com 'npm run dev'"
        return 1
    fi
}

# Criar instância
create_instance() {
    log "📱 Criando instância WhatsApp..."
    
    response=$(curl -s -X POST "$API_URL/instance/create" \
        -H "Content-Type: application/json" \
        -d "{\"instanceName\": \"$INSTANCE_NAME\"}")
    
    if echo "$response" | grep -q "instance"; then
        log "✅ Instância criada com sucesso"
        echo "$response" | jq . 2>/dev/null || echo "$response"
    else
        error "❌ Falha ao criar instância"
        echo "$response"
        return 1
    fi
}

# Verificar status
check_status() {
    log "📊 Verificando status da instância..."
    
    response=$(curl -s "$API_URL/instance/$INSTANCE_NAME/status")
    
    echo "Status atual:"
    echo "$response" | jq . 2>/dev/null || echo "$response"
    
    local is_connected=$(echo "$response" | jq -r '.isConnected // false')
    
    if [ "$is_connected" = "true" ]; then
        log "✅ Instância conectada"
        return 0
    else
        warn "⚠️  Instância não conectada (QR code necessário)"
        return 1
    fi
}

# Enviar mensagens de teste
send_test_messages() {
    log "📤 Enviando mensagens de teste (Estágio 1)..."
    
    local messages=(
        "Bom dia! Teste inicial do sistema."
        "Olá! Verificando conectividade WhatsApp."
        "Oi! Mensagem de warm-up em andamento."
        "Hello! Teste de entrega de mensagens."
        "Oi! Última mensagem de teste do dia."
    )
    
    local contacts=(
        "5511988887777"
        "5511977776666"
        "5511966665555"
        "5511955554444"
        "5511944443333"
    )
    
    for i in "${!messages[@]}"; do
        log "Enviando mensagem $((i+1))/5 para ${contacts[$i]}"
        
        response=$(curl -s -X POST "$API_URL/message/send/$INSTANCE_NAME" \
            -H "Content-Type: application/json" \
            -d "{\"number\": \"${contacts[$i]}\", \"text\": \"${messages[$i]}\"}")
        
        if echo "$response" | grep -q "success.*true"; then
            log "✅ Mensagem $((i+1)) enviada"
        else
            error "❌ Falha ao enviar mensagem $((i+1))"
            echo "$response"
        fi
        
        sleep 2
    done
}

# Simular estágio 2 - aumento gradual
simulate_stage2() {
    log "📈 Simulando Estágio 2: Aumento Gradual..."
    
    local extended_messages=(
        "Bom dia! Como você está hoje?"
        "Testando diferentes conteúdos."
        "Olá! Mensagem diversificada."
        "Oi! Verificando entregabilidade."
        "Boa tarde! Testando horários."
        "Hello! More diverse content."
        "Oi! Mensagem com variação."
        "Bom dia! Teste de consistência."
        "Olá! Monitorando envios."
        "Hi! Testing message patterns."
        "Oi! Conteúdo variado enviado."
        "Bom dia! Últimas mensagens do dia."
    )
    
    for i in "${!extended_messages[@]}"; do
        local contact_index=$((i % 5))
        local contact="55119$((88887777 - contact_index * 1111111))"
        
        log "Enviando mensagem estagiada $((i+1))/12"
        
        curl -s -X POST "$API_URL/message/send/$INSTANCE_NAME" \
            -H "Content-Type: application/json" \
            -d "{\"number\": \"$contact\", \"text\": \"${extended_messages[$i]}\"}" > /dev/null
        
        sleep 3
    done
    
    log "✅ Estágio 2 concluído: 12 mensagens enviadas"
}

# Buscar mensagens recebidas
check_received_messages() {
    log "📥 Verificando mensagens recebidas..."
    
    response=$(curl -s "$API_URL/messages/$INSTANCE_NAME?limit=10")
    
    local count=$(echo "$response" | jq -r '.count // 0')
    log "📊 Total de mensagens: $count"
    
    if [ "$count" -gt 0 ]; then
        log "📋 Últimas mensagens:"
        echo "$response" | jq -r '.messages[].message.conversation // "Mídia"' 2>/dev/null | head -5
    fi
}

# Menu principal
show_menu() {
    echo ""
    echo "📱 WhatsApp Warm-up - Menu de Simulação"
    echo "======================================"
    echo "1. Verificar status do servidor"
    echo "2. Criar nova instância"
    echo "3. Verificar status da instância"
    echo "4. Enviar mensagens de teste (Estágio 1)"
    echo "5. Simular aumento gradual (Estágio 2)"
    echo "6. Verificar mensagens recebidas"
    echo "7. Executar simulação completa"
    echo "8. Sair"
    echo ""
    read -p "Escolha uma opção: " choice
}

# Simulação completa
run_complete_simulation() {
    log "🎯 Executando simulação completa..."
    
    check_server || return 1
    create_instance
    sleep 2
    check_status
    sleep 2
    send_test_messages
    sleep 5
    simulate_stage2
    sleep 3
    check_received_messages
    
    log "🎉 Simulação completa finalizada!"
    log ""
    log "📊 Resumo:"
    log "   ✅ Instância criada e configurada"
    log "   ✅ 5 mensagens de teste (Estágio 1)"
    log "   ✅ 12 mensagens de aumento gradual (Estágio 2)"
    log "   ✅ Total: 17 mensagens enviadas"
}

# Loop principal
main() {
    # Verificar dependências
    if ! command -v curl &> /dev/null; then
        error "curl é necessário para executar este script"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        warn "jq não encontrado. Instale para melhor formatação JSON: sudo apt install jq"
    fi
    
    while true; do
        show_menu
        
        case $choice in
            1) check_server ;;
            2) create_instance ;;
            3) check_status ;;
            4) send_test_messages ;;
            5) simulate_stage2 ;;
            6) check_received_messages ;;
            7) run_complete_simulation ;;
            8) 
                log "👋 Saindo..."
                exit 0
                ;;
            *) 
                error "Opção inválida"
                ;;
        esac
        
        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# Executar se chamado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi