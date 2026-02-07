# 🤝 Guia de Contribuição

Obrigado por considerar contribuir com o Fire Server! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Código de Conduta

- Seja respeitoso e construtivo
- Aceite feedback com graça
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## 🚀 Como Contribuir

### Reportando Bugs

1. Verifique se o bug já não foi reportado
2. Use o template de issue para bugs
3. Inclua:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicável)
   - Versão do navegador

### Sugerindo Melhorias

1. Verifique se a sugestão já não existe
2. Use o template de issue para features
3. Explique:
   - Qual problema resolve
   - Como deveria funcionar
   - Alternativas consideradas

### Pull Requests

#### Setup do Ambiente

```bash
# Clone o repositório
git clone https://github.com/catnap11sans/fireserver.git
cd fireserver

# Instale dependências (opcional, para servidor local)
npm install

# Rode localmente
npm run dev
```

#### Processo

1. **Fork** o projeto
2. **Crie uma branch** (`git checkout -b feature/MinhaFeature`)
3. **Desenvolva** seguindo nossos padrões
4. **Teste** completamente suas mudanças
5. **Commit** (`git commit -m 'feat: Adiciona MinhaFeature'`)
6. **Push** (`git push origin feature/MinhaFeature`)
7. **Abra um Pull Request**

#### Padrões de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças em documentação
- `style:` Formatação, ponto-e-vírgula, etc
- `refactor:` Refatoração de código
- `test:` Adição de testes
- `chore:` Tarefas de manutenção

Exemplos:
```
feat: adiciona suporte para fontes customizadas
fix: corrige erro no parser com aspas duplas
docs: atualiza README com novos exemplos
```

## 🎨 Padrões de Código

### JavaScript

- Use ES6+ features
- Declare variáveis com `const` ou `let` (nunca `var`)
- Use template literals em vez de concatenação
- Comente código complexo
- Nomeie variáveis de forma descritiva

```javascript
// ✅ Bom
const userName = document.getElementById('username').value;
const greeting = `Olá, ${userName}!`;

// ❌ Evite
var u = document.getElementById('username').value;
var g = 'Olá, ' + u + '!';
```

### CSS

- Use variáveis CSS (`:root`)
- Classes descritivas em kebab-case
- Organize por componente
- Mobile-first quando aplicável

```css
/* ✅ Bom */
.editor-panel {
    background: var(--dark-card);
    padding: 2rem;
}

/* ❌ Evite */
.ep {
    background: #151A35;
    padding: 32px;
}
```

### HTML

- Semântico e acessível
- Indentação consistente (2 espaços)
- Atributos em ordem lógica
- Use `alt` em imagens

## 🧪 Testes

Antes de submeter um PR:

1. **Teste em múltiplos navegadores**
   - Chrome/Edge
   - Firefox
   - Safari (se possível)

2. **Teste responsividade**
   - Desktop (1920px+)
   - Tablet (768px)
   - Mobile (375px)

3. **Teste funcionalidades**
   - Editor funciona?
   - Parser valida corretamente?
   - Renderer gera HTML correto?
   - Preview atualiza em tempo real?

## 📝 Documentação

Ao adicionar features:

1. Atualize o README.md
2. Adicione exemplos em `/assets/`
3. Atualize docs.html se necessário
4. Comente código complexo

## 🎯 Áreas para Contribuir

### Fácil (Good First Issue)

- Correção de typos
- Melhorias na documentação
- Novos exemplos de sites
- Melhorias de UX menores

### Intermediário

- Novas funções de estilo (loads)
- Melhorias no assistente IA
- Temas do editor
- Validações adicionais

### Avançado

- Backend API
- Sistema de autenticação
- Bot Discord
- Otimizações de performance

## 💬 Comunicação

- **Issues**: Para bugs e features
- **Discussions**: Para ideias e perguntas
- **Discord**: Para chat em tempo real (em breve)

## 🏆 Reconhecimento

Contribuidores são listados em:
- README.md (contribuidores principais)
- CONTRIBUTORS.md (todos os contribuidores)
- Releases notes

## ❓ Dúvidas?

Não hesite em perguntar! Abra uma issue com a tag `question` ou entre no nosso Discord.

---

**Obrigado por ajudar a fazer o Fire Server melhor! 🔥**
