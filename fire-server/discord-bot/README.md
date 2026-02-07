# 🔥 Fire Server Discord Bot

Bot oficial do Fire Server para Discord.

## ✨ Funcionalidades

- `/login` - Gera link de login único
- `/perfil [@usuario]` - Mostra perfil de usuário
- `/ajuda [comando]` - Ajuda e comandos
- `/dsl [comando]` - Ajuda sobre comandos DSL
- `/exemplos [tipo]` - Exemplos de código
- `/validar <código>` - Valida código DSL
- `/docs` - Links para documentação
- `/stats` - Estatísticas do bot

## 🚀 Instalação

### 1. Instalar dependências

```bash
cd discord-bot
npm install
```

### 2. Configurar o bot

1. Crie um bot no [Discord Developer Portal](https://discord.com/developers/applications)
2. Copie o token do bot
3. Crie o arquivo `.env`:

```bash
cp .env.example .env
```

4. Edite `.env` e adicione seu token:

```env
DISCORD_TOKEN=seu_token_aqui
```

### 3. Configurar permissões

No Discord Developer Portal, vá em "Bot" e ative:
- ✅ Message Content Intent
- ✅ Server Members Intent (opcional)
- ✅ Presence Intent (opcional)

### 4. Adicionar bot ao servidor

Use este link (substitua CLIENT_ID):
```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=274878024768&scope=bot
```

Permissões necessárias:
- Send Messages
- Embed Links
- Read Message History
- Add Reactions

### 5. Iniciar o bot

```bash
npm start
```

Ou para desenvolvimento com auto-reload:
```bash
npm run dev
```

## 📖 Guia de Uso

### Comandos Básicos

```
/login          → Gera link de login
/perfil         → Mostra seu perfil
/ajuda          → Lista todos os comandos
```

### Ajuda com DSL

```
/dsl page       → Ajuda sobre comando 'page'
/dsl button     → Ajuda sobre botões
/exemplos       → Ver exemplos de código
```

### Validar Código

Envie código em um bloco:

```
/validar ```
page inicial
text msg ("Olá")
end
```\`\`\`
```

## 🔧 Desenvolvimento

### Estrutura de arquivos

```
discord-bot/
├── bot.js              # Código principal do bot
├── package.json        # Dependências
├── .env               # Configuração (não commitar!)
├── .env.example       # Template de configuração
├── fire_bot_db.json   # Banco de dados local (criado automaticamente)
└── README.md          # Este arquivo
```

### Adicionar novos comandos

1. Abra `bot.js`
2. Adicione no objeto `commands`:

```javascript
commands = {
  // ... outros comandos
  
  meucomando: {
    name: 'meucomando',
    description: 'Descrição do comando',
    execute: async (message, args) => {
      // Seu código aqui
      await message.reply('Resposta!');
    }
  }
};
```

## 🐛 Troubleshooting

### Bot não inicia

- Verifique se o token está correto no `.env`
- Certifique-se de que instalou as dependências: `npm install`
- Verifique se Node.js ≥16 está instalado

### Bot não responde

- Verifique se o bot tem permissões no servidor
- Verifique se "Message Content Intent" está ativado
- Veja os logs no console

### Erro de autenticação

- Token inválido ou expirado
- Regenere o token no Discord Developer Portal

## 📊 Status e Logs

O bot salva estatísticas em `fire_bot_db.json`:
- Total de comandos executados
- Usuários registrados
- Tempo de atividade

## 🤝 Contribuindo

Para reportar bugs ou sugerir features:
1. Abra uma issue no GitHub
2. Use o comando `/feedback` no Discord

## 📝 Licença

MIT License - veja LICENSE para detalhes

## 🔗 Links Úteis

- [Documentação Fire Server](https://github.com/catnap11sans/fireserver)
- [Discord.js Docs](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)
