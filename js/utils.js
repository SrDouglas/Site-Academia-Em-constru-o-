// js/utils.js - VERSÃO SIMPLIFICADA
console.log('🔧 Utilitários SIMPLIFICADOS carregados');

// VALIDAÇÃO ULTRA SIMPLES - Aceita qualquer CPF com 11 dígitos
function validarCPFCompleto(cpf) {
    // Remove tudo que não é número
    cpf = cpf.replace(/\D/g, '');
    
    console.log('📝 CPF recebido (limpo):', cpf);
    
    // Apenas verifica se tem 11 dígitos
    if (cpf.length === 11) {
        console.log('✅ CPF ACEITO (tem 11 dígitos)');
        return { valido: true, cpf: cpf };
    }
    
    console.log('❌ CPF REJEITADO (não tem 11 dígitos)');
    return { valido: false, erro: 'CPF deve ter 11 dígitos' };
}

// Validação simples de data
function validarDataNascimento(data) {
    data = data.replace(/\D/g, '');
    
    console.log('📅 Data recebida (limpa):', data);
    
    // Apenas verifica se tem 8 dígitos
    if (data.length === 8) {
        console.log('✅ Data ACEITA (tem 8 dígitos)');
        return { valido: true, data: data };
    }
    
    console.log('❌ Data REJEITADA (não tem 8 dígitos)');
    return { valido: false, erro: 'Data deve ter 8 dígitos (DDMMAAAA)' };
}

// Formatação de CPF
function formatarCPFInput(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.substring(0, 11);
    
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    
    input.value = value;
    return value;
}

// Exportar
window.validarCPFCompleto = validarCPFCompleto;
window.validarDataNascimento = validarDataNascimento;
window.formatarCPFInput = formatarCPFInput;