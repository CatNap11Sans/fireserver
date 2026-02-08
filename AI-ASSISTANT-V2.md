# 🤖 AI Assistant v2.0 - Fire Server

## 🎯 O que mudou?

### ❌ Versão Antiga (Keywords Secas)
```javascript
// Sistema burro baseado em palavras-chave
if (msg.includes("python")) {
    return "Use nossa DSL!";
}
```

### ✅ Versão Nova (Sistema de Intenções)
```javascript
// Sistema inteligente baseado em INTENÇÕES
function classifyIntent(msg) {
    // Pergunta: O que o usuário está TENTANDO fazer?
    
    if (matchesPattern(msg, ['me ensina', 'como aprender'])) {
        return { type: 'learn_language', language: detectLanguage(msg) };
    }
    
    // Detecta intenção, não palavra específica
}
```

---

## 🧩 CAMADA 1 — Contexto Fixo do Projeto

A IA sempre sabe o contexto antes de responder:

```javascript
const CONTEXT = {
    project: "Fire Server DSL",
    languageUsed: "DSL própria",
    forbidden: ["javascript do usuário", "html cru"],
    allowedHelp: ["conceitos", "exemplos", "código educacional"]
};
```

Isso permite respostas contextuais como:
> "Aqui não usamos Python, mas posso te ensinar sim!"

---

## 🧠 CAMADA 2 — Classificação de Intenções

### Intenções Suportadas

1. **`learn_language`** - Aprender uma linguagem de programação
   - Triggers: "me ensina python", "como aprender javascript"
   - Resposta: Ensina com empatia + contexto + exemplo copiável

2. **`request_code`** - Pedir código pronto
   - Triggers: "cria um codigo pra mim", "faz um site"
   - Resposta: Dá exemplo + explica que deve adaptar

3. **`dsl_help`** - Ajuda com DSL do Fire Server
   - Triggers: "como usar page", "o que é text"
   - Resposta: Sintaxe + exemplo + explicação

4. **`confusion`** - Confusão ou não entendeu
   - Triggers: "não entendi", "o que é isso"
   - Resposta: Simplifica + exemplo básico

5. **`error_help`** - Erro ou problema
   - Triggers: "erro", "não funciona", "bug"
   - Resposta: Lista erros comuns + soluções

6. **`greeting`** - Cumprimento
   - Triggers: "oi", "olá", "bom dia"
   - Resposta: Cumprimento + lista de ajudas

7. **`off_topic`** - Fora do tópico
   - Triggers: qualquer coisa não reconhecida
   - Resposta: Redireciona para temas relevantes

---

## 📊 Exemplos Práticos

### 🟢 Exemplo 1: Ensinar Python

**Usuário:**
```
me ensina python
```

**IA Responde:**
```
Olha, aqui no Fire Server a gente não usa Python — usamos uma DSL própria 🙂

Mas posso te ensinar Python sim! Python é uma linguagem simples e muito usada 
pra automação, bots e jogos.

Exemplo básico:
```python
# Exemplo básico de Python
print("Olá, mundo!")

# Variáveis
nome = "João"
idade = 15
print(f"Meu nome é {nome} e tenho {idade} anos")
```

**O que esse código faz:**
• `print()` exibe texto na tela
• Variáveis guardam informações
• `f"..."` permite inserir variáveis no texto

Quer aprender mais? Posso te explicar loops, condicionais, arrays e muito mais! 🚀
```

**Com botão "📋 Copiar" no código!**

---

### 🟢 Exemplo 2: Código Pronto

**Usuário:**
```
cria um codigo de site pra mim
```

**IA Responde:**
```
Entendo que você quer um código pronto! 💻

**Como funciona aqui:**
Eu não crio o código *por você*, mas posso te **ensinar** e dar **exemplos** 
que você adapta.

**Exemplo: Site pessoal básico**
```dsl
page inicial
title "Meu Site"

text bemvindo ("Olá! Bem-vindo ao meu site 👋")
jump

text sobre ("Sou desenvolvedor e adoro programar!")

button contato ("Entre em Contato" link "mailto:seu@email.com")

divider

text rodape ("Feito com 🔥 Fire Server")
end
```

**Copie esse código** e personalize:
• Mude os textos
• Adicione mais páginas
• Coloque suas informações

Quer que eu explique alguma parte específica? 🎯
```

---

### 🟢 Exemplo 3: Ajuda com DSL

**Usuário:**
```
como usar button
```

**IA Responde:**
```
🔘 Comando: button

**Sintaxe:**
`button id ("texto" link "url")`

**Exemplo:**
```dsl
button email ("Email" link "mailto:seu@email.com")
button github ("GitHub" link "https://github.com")
button proxima ("Próxima" page outraPagina)
```

**Explicação:**
Cria botões clicáveis. Use `link` para URLs ou `page` para navegar entre páginas

Quer ver mais exemplos ou aprender outro comando? 🚀
```

---

## 🎨 Features Visuais

### Blocos de Código com Botão Copiar

```html
<div class="code-block">
    <div class="code-lang">python</div>
    <pre><code id="code-123">print("Olá!")</code></pre>
    <button class="copy-code-btn" onclick="aiAssistant.copyCode('code-123')">
        📋 Copiar
    </button>
</div>
```

**Ao clicar:**
1. Código é copiado para clipboard
2. Botão muda para "✅ Copiado!"
3. Volta ao normal após 2 segundos

### Código Inline

```
Use o comando `page` para criar uma página
```

Renderiza como:
> Use o comando <code>page</code> para criar uma página

### Formatação Markdown

- **Negrito:** `**texto**` → **texto**
- `Código inline:` `` `código` `` → `código`
- Quebras de linha: `\n` → `<br>`

---

## 🔧 Como Funciona Internamente

### Fluxo de Processamento

```
Usuário digita: "me ensina python"
        ↓
classifyIntent() → detecta: { type: 'learn_language', language: 'Python' }
        ↓
generateResponse() → chama: responseLearnLanguage('Python')
        ↓
responseLearnLanguage() → retorna: mensagem formatada
        ↓
processMessage() → adiciona: blocos de código, markdown
        ↓
addMessage() → renderiza: HTML final no chat
```

### Detecção de Linguagem

```javascript
detectLanguage(msg) {
    if (msg.includes('python')) return 'Python';
    if (msg.includes('javascript')) return 'JavaScript';
    if (msg.includes('java')) return 'Java';
    // ...
}
```

### Detecção de Comando DSL

```javascript
detectDSLCommand(msg) {
    const commands = ['page', 'text', 'button', 'image', ...];
    return commands.find(cmd => msg.includes(cmd));
}
```

### Pattern Matching

```javascript
matchesPattern(msg, patterns) {
    return patterns.some(pattern => msg.includes(pattern));
}
```

---

## 📝 Como Adicionar Nova Intenção

### 1. Adicione no classifyIntent()

```javascript
// No classifyIntent()
if (this.matchesPattern(msgLower, [
    'nova intenção', 'trigger'
])) {
    return { type: 'nova_intencao', data: extrairDados(msg) };
}
```

### 2. Adicione no generateResponse()

```javascript
// No generateResponse()
case 'nova_intencao':
    return this.responseNovaIntencao(intent.data);
```

### 3. Crie a função de resposta

```javascript
responseNovaIntencao(data) {
    return `Resposta para a nova intenção!
    
**Exemplo:**
\`\`\`dsl
codigo exemplo
\`\`\`

Explicação aqui.`;
}
```

---

## 🎯 Vantagens do Sistema

### ✅ Empatia
```
"Olha, aqui não usamos Python, mas posso te ensinar sim!"
```
Em vez de:
```
"Não suportado. Use DSL."
```

### ✅ Contexto
A IA sempre sabe que:
- Fire Server usa DSL própria
- Pode ensinar outras linguagens
- Deve dar exemplos copiáveis

### ✅ Exemplos Práticos
Todo código vem com:
- Sintaxe
- Exemplo completo
- Explicação linha por linha
- Botão copiar

### ✅ Flexibilidade
Detecta variações:
- "me ensina python"
- "como aprender python"
- "tutorial python"
- "quero aprender python"

Todas levam à mesma intenção!

---

## 🧪 Como Testar

### Teste 1: Ensinar Linguagem
```
me ensina javascript
```
**Esperado:** Ensina JS + dá exemplo + explica

### Teste 2: Código Pronto
```
cria um codigo de site
```
**Esperado:** Dá exemplo adaptável + explica conceito

### Teste 3: Ajuda DSL
```
como usar text
```
**Esperado:** Sintaxe + exemplo + explicação

### Teste 4: Erro
```
ajuda erro
```
**Esperado:** Lista erros comuns + soluções

### Teste 5: Confusão
```
não entendi
```
**Esperado:** Simplifica + exemplo básico

---

## 📊 Estatísticas

### Antes (Keywords)
- 🔴 Respostas robóticas
- 🔴 Sem contexto
- 🔴 Sem exemplos copiáveis
- 🔴 Não entendia variações

### Depois (Intenções)
- 🟢 Respostas empáticas
- 🟢 Sempre contextual
- 🟢 Exemplos com botão copiar
- 🟢 Entende variações naturais

---

## 🚀 Próximos Passos

### Fase 1: Atual ✅
- [x] Sistema de intenções
- [x] Detecção de linguagens
- [x] Blocos de código copiáveis
- [x] Respostas contextuais

### Fase 2: Futuro
- [ ] Histórico de conversas
- [ ] Sugestões inteligentes baseadas em erros
- [ ] Integração com parser (detectar erros em tempo real)
- [ ] Exemplos interativos (editar no chat)

---

**Versão:** AI Assistant v2.0  
**Data:** 07/02/2026  
**Status:** ✅ Pronto para uso
