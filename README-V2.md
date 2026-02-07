# 🔥 Fire Server v2.0 - Melhorias

## 🎨 O que mudou?

### 1. **Syntax Highlighting Customizado**

Agora o editor tem cores específicas para cada comando da DSL:

- **page / end / title** → 🔴 Vermelho (#FF4444)
- **load** → 🔵 Azul (#4444FF)
- **text** → 🟡 Amarelo (#FFFF44)
- **image** → 🌸 Rosa (#FF69B4)
- **button** → 🟣 Roxo (#9B4DCA)
- **divider / jump** → 🟢 Verde (#44FF44)
- **"textos"** → 🟤 Marrom (#8B4513)
- **funções** → 🟣 Magenta (#FF00FF)

### 2. **Color Picker Visual**

Quando você digita `color("#2596be")` ou `backcolor("#FF0000")`, aparece um **quadrado colorido** ao lado! 🎨

Clique nele para abrir um seletor de cores visual com:
- ✨ Seletor nativo do navegador
- 🎨 24 cores predefinidas
- #️⃣ Input hexadecimal
- ✅ Aplicação instantânea no código

### 3. **IA Inteligente (sem API)**

A IA agora **aprende com seus erros**! 🤖

**Como funciona:**
- Registra todos os erros que você comete
- Aprende quais correções funcionaram
- Sugere soluções baseadas no seu histórico
- Detecta padrões e melhora com o tempo

**Recursos da IA:**
- ✅ Sugestões contextuais
- ✅ Correções automáticas (um clique)
- ✅ Análise de código
- ✅ Dicas personalizadas
- ✅ Detecção de padrões ruins
- ✅ Sugestões de otimização

### 4. **Navegação Corrigida**

Os botões com `page nome` agora funcionam perfeitamente! 🎯

Antes (bugado):
```dsl
button voltar ("Voltar" page inicial)  # ❌ Não funcionava
```

Agora (funciona!):
```dsl
button voltar ("Voltar" page inicial)  # ✅ Funciona!
```

### 5. **Bot Discord Completo**

Um bot totalmente funcional com vários comandos! 🤖

**Comandos disponíveis:**
- `/login` - Gerar link de login
- `/perfil [@usuario]` - Ver perfil
- `/ajuda [comando]` - Ajuda completa
- `/dsl [comando]` - Ajuda sobre DSL
- `/exemplos [tipo]` - Ver exemplos
- `/validar <código>` - Validar código
- `/docs` - Links úteis
- `/stats` - Estatísticas do bot

## 📁 Estrutura de Arquivos

```
fire-server/
├── js/
│   ├── syntax-highlighter.js   # ✨ NOVO: Syntax highlighting
│   ├── color-picker.js          # ✨ NOVO: Color picker visual
│   ├── smart-ai.js              # ✨ NOVO: IA inteligente
│   ├── editor-v2.js             # ✨ NOVO: Editor atualizado
│   ├── dsl-parser.js            # Atualizado
│   ├── dsl-renderer.js          # ✨ Corrigido: navegação
│   └── ...
├── pages/
│   ├── editor-v2.html           # ✨ NOVO: Página do editor
│   └── ...
├── discord-bot/                 # ✨ NOVO: Bot Discord
│   ├── bot.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
└── ...
```

## 🚀 Como Usar

### 1. Editor com Syntax Highlighting

Abra `pages/editor-v2.html` e veja as cores! 🎨

### 2. Color Picker

Digite qualquer função de cor:
```dsl
text titulo ("Olá", color("#2596be"))
```

Um quadrado azul 🟦 aparecerá! Clique para editar.

### 3. IA Inteligente

Quando você cometer um erro, a IA vai:

1. **Analisar** o erro
2. **Buscar** em correções anteriores
3. **Sugerir** a melhor solução
4. **Aprender** com sua escolha

**Exemplo:**

❌ Erro: `text titulo "Olá"`

🤖 IA sugere: `text titulo ("Olá")`

✅ Clique em "Aplicar" e pronto!

### 4. Bot Discord

#### Instalar:

```bash
cd discord-bot
npm install
cp .env.example .env
# Edite .env e adicione seu token
npm start
```

#### Usar no Discord:

```
/login              → Gerar link de login
/perfil             → Ver seu perfil
/dsl button         → Ajuda sobre botões
/exemplos           → Ver exemplos
/validar <código>   → Validar código
```

## 🎯 Exemplos Práticos

### Usando Color Picker

**Antes (digitava manualmente):**
```dsl
text titulo ("Olá", color("#2596be"))
```

**Agora (clica e escolhe):**
1. Digite `color("` 
2. Clique no quadrado 🎨
3. Escolha a cor visualmente
4. Clique em "Aplicar"

### Usando a IA

**Cenário:** Você esqueceu as aspas

```dsl
text titulo (Olá)  # ❌ Erro!
```

**IA detecta e sugere:**
```
🤖 Correção Sugerida (alta confiança)
💡 Textos precisam estar entre aspas

text titulo ("Olá")

[Aplicar]
```

**Você clica:** → Código corrigido! ✨

### Bot Discord

**No Discord:**
```
Você: /dsl button

Bot: 🔘 Comando: button
Adiciona um botão

Sintaxe: button nome ("texto" [link "url" ou page nome], loads)

Exemplos:
- Link: button site ("Visitar" link "https://google.com")
- Página: button sobre ("Sobre" page sobre)
```

## 🛠️ Desenvolvimento

### Adicionar nova cor ao Syntax Highlighter

Edite `js/syntax-highlighter.js`:

```javascript
this.colors = {
    page: '#FF4444',
    // ... outras cores
    novoComando: '#ABCDEF'  // ✨ Nova cor
};
```

### Ensinar algo novo à IA

Edite `js/smart-ai.js`:

```javascript
this.knowledgeBase = {
    commands: {
        // ... outros comandos
        novoComando: {  // ✨ Novo comando
            syntax: 'novocomando args',
            description: 'Faz algo incrível',
            examples: ['exemplo1', 'exemplo2']
        }
    }
};
```

### Adicionar comando ao Bot

Edite `discord-bot/bot.js`:

```javascript
const commands = {
    // ... outros comandos
    
    novocomando: {  // ✨ Novo comando
        name: 'novocomando',
        description: 'Faz algo legal',
        execute: async (message, args) => {
            await message.reply('Resposta!');
        }
    }
};
```

## 🐛 Troubleshooting

### Color Picker não aparece

- Certifique-se de usar `color("#HEXCODE")` com aspas
- Recarregue a página
- Verifique o console do navegador

### IA não sugere nada

- A IA aprende com o tempo
- Faça alguns erros primeiro para ela aprender
- Verifique se `autoSuggest` está ativado nas preferências

### Navegação não funciona

- Certifique-se de que o nome da página está correto
- Verifique se a página foi fechada com `end`
- Exemplo correto:
  ```dsl
  page sobre
  text msg ("Sobre mim")
  end
  
  page inicial
  button ir ("Ir para Sobre" page sobre)  # ✅ Nome correto
  end
  ```

### Bot não responde

- Verifique se o token está correto
- Certifique-se de que "Message Content Intent" está ativado
- Veja os logs do console

## 📊 Estatísticas da IA

A IA salva estatísticas em `localStorage`:

- Total de erros encontrados
- Erros resolvidos
- Padrões aprendidos
- Tempo médio de resolução

Use `fireEditor.smartAI.exportLearning()` no console para ver!

## 🎓 Tutorial Completo

### 1. Abra o Editor v2

```
pages/editor-v2.html
```

### 2. Digite um código com erro

```dsl
page inicial
text msg Olá     # ❌ Falta aspas e parênteses
end
```

### 3. Veja a IA sugerir

🤖 A IA vai detectar e sugerir:
```dsl
text msg ("Olá")  # ✅ Correção
```

### 4. Adicione cores

```dsl
text msg ("Olá", color("#"))  # 🎨 Clique no quadrado que aparece
```

### 5. Publique

Clique em "Publicar" e pronto! 🎉

## 📝 Notas Finais

### Diferenças da versão antiga

| Recurso | Antes | Agora |
|---------|-------|-------|
| **Syntax Highlighting** | ❌ Nenhum | ✅ Cores customizadas |
| **Color Picker** | ❌ Manual | ✅ Visual |
| **IA** | ❌ Básica | ✅ Aprende com erros |
| **Navegação** | ❌ Bugada | ✅ Funcionando |
| **Bot Discord** | ❌ Inexistente | ✅ Completo |

### Próximos passos

- [ ] Integração com backend
- [ ] Sistema de autenticação
- [ ] Preview em tempo real melhorado
- [ ] Mais templates
- [ ] Exportação para HTML

## 🤝 Contribuindo

Encontrou um bug? Tem uma sugestão?

1. Abra uma issue no GitHub
2. Ou use o bot: `/feedback sua mensagem`

## 📜 Licença

MIT License

---

Feito com 🔥 por Fire Server Team
