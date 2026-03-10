# Plano de Implementação: Melhoria na Gestão de Tokens (Arquivado)

Este plano foi gerado em 12/02/2026 para lidar com a futura alteração da expiração do JWT de 7 dias para 1 hora.

## Objetivo
Adaptar o frontend para suportar tokens de vida curta sem impactar a experiência do usuário, garantindo renovação automática e segurança aprimorada.

## Resumo da Análise
- **Estado Atual**: Tokens em cookies (7 dias), sem refresh automático global.
- **Risco**: Se a validade cair para 1 hora, usuários serão deslogados ou encontrarão erros 401 constantemente.

## Ações Propostas

### 1. Interceptor no Axios (`axios.js`)
- Adicionar um interceptor de erro que, ao receber `401 Unauthorized`, tente chamar a rota de refresh automaticamente antes de falhar.

### 2. Melhoria na Rota de Refresh (`pages/api/user/refreshToken.js`)
- Sincronizar a renovação do cookie `token` com o tempo de vida real retornado pelo backend.

### 3. Segurança de Cookies
- Recomenda-se usar `httpOnly: true` para evitar acesso via Javascript a tokens sensíveis.

---
*Este arquivo serve como referência para a implementação planejada para daqui a ~2 semanas.*
