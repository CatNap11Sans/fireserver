/**
 * Fire Server Discord Bot
 * Bot para ajudar usuários do Fire Server via Discord
 * 
 * Instalação:
 * npm install discord.js dotenv
 * 
 * Configuração (.env):
 * DISCORD_TOKEN=seu_token_aqui
 * FIREBASE_URL=sua_url_firebase
 */

const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Configuração
const BOT_PREFIX = '/';
const SITE_BASE_URL = 'https://catnap11sans.github.io/fireserver/';

// Cliente Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Base de dados simples (em produção, use Firebase/MongoDB)
class SimpleDB {
    constructor() {
        this.dbPath = path.join(__dirname, 'fire_bot_db.json');
        this.data = this.load();
    }

    load() {
        try {
            if (fs.existsSync(this.dbPath)) {
                return JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
            }
        } catch (error) {
            console.error('Erro ao carregar DB:', error);
        }
        return { users: {}, stats: { totalCommands: 0, totalUsers: 0 } };
    }

    save() {
        try {
            fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
        } catch (error) {
            console.error('Erro ao salvar DB:', error);
        }
    }

    getUser(discordId) {
        return this.data.users[discordId] || null;
    }

    setUser(discordId, userData) {
        this.data.users[discordId] = userData;
        this.save();
    }

    incrementStat(stat) {
        if (this.data.stats[stat] !== undefined) {
            this.data.stats[stat]++;
            this.save();
        }
    }

    getStats() {
        return this.data.stats;
    }
}

const db = new SimpleDB();

// Comandos do bot
const commands = {
    // Comando: /login
    login: {
        name: 'login',
        description: 'Gera link de login para o Fire Server',
        execute: async (message, args) => {
            const loginToken = generateToken(message.author.id);
            const loginUrl = `${SITE_BASE_URL}login?token=${loginToken}&discord=${message.author.id}`;

            const embed = new EmbedBuilder()
                .setColor('#2596be')
                .setTitle('🔥 Login Fire Server')
                .setDescription('Clique no botão abaixo para fazer login!')
                .addFields(
                    { name: '⚠️ Atenção', value: 'Este link é único e expira em 10 minutos.' }
                )
                .setFooter({ text: 'Fire Server Bot' })
                .setTimestamp();

            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Fazer Login')
                        .setURL(loginUrl)
                        .setStyle(ButtonStyle.Link)
                        .setEmoji('🔐')
                );

            await message.reply({ embeds: [embed], components: [row] });
            
            db.incrementStat('totalCommands');
        }
    },

    // Comando: /perfil
    perfil: {
        name: 'perfil',
        description: 'Mostra o perfil de um usuário',
        execute: async (message, args) => {
            const targetUser = message.mentions.users.first() || message.author;
            const userData = db.getUser(targetUser.id);

            const embed = new EmbedBuilder()
                .setColor('#2596be')
                .setTitle(`🔥 Perfil de ${targetUser.username}`)
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }));

            if (userData && userData.fireUsername) {
                const siteUrl = `${SITE_BASE_URL}${userData.fireUsername}`;
                
                embed.addFields(
                    { name: '👤 Username Fire Server', value: userData.fireUsername, inline: true },
                    { name: '🗓️ Conta criada em', value: new Date(userData.createdAt).toLocaleDateString('pt-BR'), inline: true },
                    { name: '📊 Total de páginas', value: userData.totalPages?.toString() || '0', inline: true },
                    { name: '🔗 Link do site', value: `[Visitar Site](${siteUrl})` }
                );

                if (userData.lastPublished) {
                    embed.addFields(
                        { name: '📅 Última publicação', value: new Date(userData.lastPublished).toLocaleDateString('pt-BR') }
                    );
                }
            } else {
                embed.setDescription('❌ Este usuário ainda não tem uma conta no Fire Server.\n\nUse `/login` para criar uma!');
            }

            embed.setFooter({ text: 'Fire Server Bot' })
                .setTimestamp();

            await message.reply({ embeds: [embed] });
            
            db.incrementStat('totalCommands');
        }
    },

    // Comando: /ajuda
    ajuda: {
        name: 'ajuda',
        description: 'Mostra todos os comandos e ajuda',
        execute: async (message, args) => {
            if (args.length > 0) {
                // Ajuda sobre comando específico ou conceito
                return await showSpecificHelp(message, args[0]);
            }

            const embed = new EmbedBuilder()
                .setColor('#2596be')
                .setTitle('🔥 Fire Server - Comandos do Bot')
                .setDescription('Aqui estão todos os comandos disponíveis:')
                .addFields(
                    { name: '`/login`', value: 'Gera um link de login único para o Fire Server' },
                    { name: '`/perfil [@usuario]`', value: 'Mostra o perfil de um usuário (seu ou de outro)' },
                    { name: '`/ajuda [comando]`', value: 'Mostra esta mensagem ou ajuda sobre um comando específico' },
                    { name: '`/dsl [comando]`', value: 'Ajuda sobre comandos DSL (page, text, image, button, etc)' },
                    { name: '`/exemplos`', value: 'Mostra exemplos de código DSL' },
                    { name: '`/validar <código>`', value: 'Valida seu código DSL' },
                    { name: '`/docs`', value: 'Link para a documentação completa' },
                    { name: '`/stats`', value: 'Estatísticas do bot' }
                )
                .setFooter({ text: 'Fire Server Bot - Use /ajuda [comando] para mais detalhes' })
                .setTimestamp();

            await message.reply({ embeds: [embed] });
            
            db.incrementStat('totalCommands');
        }
    },

    // Comando: /dsl
    dsl: {
        name: 'dsl',
        description: 'Ajuda sobre comandos DSL',
        execute: async (message, args) => {
            const commandName = args[0]?.toLowerCase();
            const dslHelp = getDSLHelp(commandName);

            if (!dslHelp) {
                const embed = new EmbedBuilder()
                    .setColor('#2596be')
                    .setTitle('📚 Comandos DSL Disponíveis')
                    .setDescription('Use `/dsl [comando]` para ver detalhes')
                    .addFields(
                        { name: '🏗️ Estrutura', value: '`page`, `end`, `title`, `load`', inline: true },
                        { name: '📝 Elementos', value: '`text`, `image`, `button`', inline: true },
                        { name: '🎨 Layout', value: '`divider`, `jump`', inline: true },
                        { name: '🎨 Funções', value: '`color`, `backcolor`, `font`, `size`, `slep`, `animation`', inline: false }
                    )
                    .setFooter({ text: 'Exemplo: /dsl button' });

                await message.reply({ embeds: [embed] });
            } else {
                await message.reply({ embeds: [dslHelp] });
            }
            
            db.incrementStat('totalCommands');
        }
    },

    // Comando: /exemplos
    exemplos: {
        name: 'exemplos',
        description: 'Mostra exemplos de código',
        execute: async (message, args) => {
            const examples = {
                basico: {
                    title: '📄 Site Básico',
                    code: `page inicial
title "Meu Site"

text titulo ("Bem-vindo!", color("#2596be"); size("24"))
jump

text descricao ("Este é meu site criado com Fire Server")

button contato ("Entre em Contato" link "mailto:seu@email.com")

end`
                },
                multiplas_paginas: {
                    title: '📚 Múltiplas Páginas',
                    code: `page inicial
title "Home"
text msg ("Bem-vindo! Visite as outras páginas")
button sobre ("Sobre Mim" page sobre)
end

page sobre
title "Sobre"
text info ("Olá! Sou desenvolvedor")
button voltar ("Voltar" page inicial)
end`
                },
                com_estilo: {
                    title: '🎨 Com Estilo',
                    code: `page inicial
title "Site Estilizado"

load estilo1 :color("#FFFFFF"); backcolor("#2596be"); size("18")

text titulo ("Site com Estilo", estilo1)
jump

image logo ("https://i.imgur.com/exemplo.png")

divider

button acao ("Clique Aqui" link "https://exemplo.com", estilo1)

end`
                }
            };

            const exampleType = args[0] || 'basico';
            const example = examples[exampleType] || examples.basico;

            const embed = new EmbedBuilder()
                .setColor('#2596be')
                .setTitle(example.title)
                .setDescription('```dsl\n' + example.code + '\n```')
                .addFields(
                    { name: '💡 Dica', value: 'Copie este código e cole no editor do Fire Server!' }
                )
                .setFooter({ text: 'Tipos: basico, multiplas_paginas, com_estilo' });

            await message.reply({ embeds: [embed] });
            
            db.incrementStat('totalCommands');
        }
    },

    // Comando: /validar
    validar: {
        name: 'validar',
        description: 'Valida código DSL',
        execute: async (message, args) => {
            if (args.length === 0) {
                await message.reply('❌ Por favor, forneça o código para validar.\n\nExemplo: `/validar page inicial`\nOu envie seu código em um bloco de código:\n\\`\\`\\`\npage inicial\n...\\`\\`\\`');
                return;
            }

            // Extrair código do bloco se existir
            let code = args.join(' ');
            const codeBlockMatch = code.match(/```(?:dsl)?\n?([\s\S]*?)```/);
            if (codeBlockMatch) {
                code = codeBlockMatch[1];
            }

            // Validação simples
            const validation = validateDSLCode(code);

            const embed = new EmbedBuilder()
                .setColor(validation.valid ? '#00FF00' : '#FF0000')
                .setTitle(validation.valid ? '✅ Código Válido!' : '❌ Erros Encontrados');

            if (validation.valid) {
                embed.setDescription('Seu código está correto! 🎉')
                    .addFields(
                        { name: '📊 Estatísticas', value: `Linhas: ${validation.stats.lines}\nPáginas: ${validation.stats.pages}\nElementos: ${validation.stats.elements}` }
                    );
            } else {
                embed.setDescription('Encontramos alguns problemas:');
                validation.errors.forEach((error, index) => {
                    embed.addFields({
                        name: `Erro ${index + 1}`,
                        value: `Linha ${error.line}: ${error.message}`,
                        inline: false
                    });
                });
            }

            await message.reply({ embeds: [embed] });
            
            db.incrementStat('totalCommands');
        }
    },

    // Comando: /docs
    docs: {
        name: 'docs',
        description: 'Link para documentação',
        execute: async (message, args) => {
            const embed = new EmbedBuilder()
                .setColor('#2596be')
                .setTitle('📚 Documentação Fire Server')
                .setDescription('Acesse a documentação completa:')
                .addFields(
                    { name: '🔗 Site Principal', value: `[Fire Server](${SITE_BASE_URL})` },
                    { name: '📖 Guia Rápido', value: '[Quick Start](https://github.com/catnap11sans/fireserver/blob/main/QUICK-START.md)' },
                    { name: '🎯 Exemplos', value: '[Galeria de Exemplos](https://github.com/catnap11sans/fireserver/tree/main/assets/examples)' }
                )
                .setFooter({ text: 'Fire Server - Crie sites sem programar!' });

            await message.reply({ embeds: [embed] });
            
            db.incrementStat('totalCommands');
        }
    },

    // Comando: /stats
    stats: {
        name: 'stats',
        description: 'Estatísticas do bot',
        execute: async (message, args) => {
            const stats = db.getStats();
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);

            const embed = new EmbedBuilder()
                .setColor('#2596be')
                .setTitle('📊 Estatísticas do Bot')
                .addFields(
                    { name: '👥 Usuários Registrados', value: stats.totalUsers.toString(), inline: true },
                    { name: '⚡ Comandos Executados', value: stats.totalCommands.toString(), inline: true },
                    { name: '⏱️ Tempo Online', value: `${hours}h ${minutes}m`, inline: true },
                    { name: '📡 Servidores', value: client.guilds.cache.size.toString(), inline: true },
                    { name: '🔥 Versão', value: '2.0.0', inline: true }
                )
                .setFooter({ text: 'Fire Server Bot' })
                .setTimestamp();

            await message.reply({ embeds: [embed] });
            
            db.incrementStat('totalCommands');
        }
    }
};

// Funções auxiliares
function generateToken(discordId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return Buffer.from(`${discordId}:${timestamp}:${random}`).toString('base64');
}

function getDSLHelp(commandName) {
    const helps = {
        page: {
            title: '🏗️ Comando: page',
            description: 'Cria uma nova página no seu site',
            fields: [
                { name: 'Sintaxe', value: '`page nome`' },
                { name: 'Exemplo', value: '```dsl\npage inicio\ntitle "Home"\ntext msg ("Olá!")\nend\n```' },
                { name: '⚠️ Importante', value: 'Sempre termine a página com `end`' }
            ]
        },
        text: {
            title: '📝 Comando: text',
            description: 'Adiciona texto à página',
            fields: [
                { name: 'Sintaxe', value: '`text nome ("conteúdo", loads)`' },
                { name: 'Exemplo Básico', value: '```dsl\ntext titulo ("Bem-vindo!")\n```' },
                { name: 'Com Estilo', value: '```dsl\ntext titulo ("Olá", color("#FF0000"); size("20"))\n```' }
            ]
        },
        image: {
            title: '🖼️ Comando: image',
            description: 'Adiciona uma imagem',
            fields: [
                { name: 'Sintaxe', value: '`image nome ("url", loads)`' },
                { name: 'Exemplo', value: '```dsl\nimage logo ("https://i.imgur.com/abc.png")\n```' },
                { name: '💡 Dica', value: 'Use URLs do Imgur, Dropbox ou GitHub' }
            ]
        },
        button: {
            title: '🔘 Comando: button',
            description: 'Adiciona um botão',
            fields: [
                { name: 'Sintaxe', value: '`button nome ("texto" [link "url" ou page nome], loads)`' },
                { name: 'Link Externo', value: '```dsl\nbutton site ("Visitar" link "https://google.com")\n```' },
                { name: 'Link Interno', value: '```dsl\nbutton sobre ("Sobre Mim" page sobre)\n```' }
            ]
        },
        divider: {
            title: '➖ Comando: divider',
            description: 'Adiciona uma linha separadora',
            fields: [
                { name: 'Sintaxe', value: '`divider`' },
                { name: 'Exemplo', value: '```dsl\ntext titulo ("Seção 1")\ndivider\ntext outro ("Seção 2")\n```' }
            ]
        },
        jump: {
            title: '⬇️ Comando: jump',
            description: 'Pula uma linha (espaço vertical)',
            fields: [
                { name: 'Sintaxe', value: '`jump`' },
                { name: 'Exemplo', value: '```dsl\ntext titulo ("Título")\njump\ntext texto ("Texto abaixo")\n```' }
            ]
        },
        color: {
            title: '🎨 Função: color',
            description: 'Define a cor do texto',
            fields: [
                { name: 'Sintaxe', value: '`color("#RRGGBB")`' },
                { name: 'Exemplo', value: '```dsl\ntext msg ("Vermelho", color("#FF0000"))\n```' },
                { name: '🌈 Cores Comuns', value: '#FF0000 (vermelho)\n#00FF00 (verde)\n#0000FF (azul)\n#FFFF00 (amarelo)' }
            ]
        },
        backcolor: {
            title: '🎨 Função: backcolor',
            description: 'Define a cor de fundo',
            fields: [
                { name: 'Sintaxe', value: '`backcolor("#RRGGBB")`' },
                { name: 'Exemplo', value: '```dsl\nbutton acao ("Clique", backcolor("#2596be"))\n```' }
            ]
        }
    };

    const help = helps[commandName];
    if (!help) return null;

    const embed = new EmbedBuilder()
        .setColor('#2596be')
        .setTitle(help.title)
        .setDescription(help.description)
        .addFields(help.fields)
        .setFooter({ text: 'Fire Server DSL' });

    return embed;
}

async function showSpecificHelp(message, topic) {
    const specificHelps = {
        dsl: 'A DSL (Domain Specific Language) do Fire Server é uma linguagem simples para criar sites. Use `/dsl` para ver os comandos disponíveis.',
        page: 'Páginas são as "telas" do seu site. Use `/dsl page` para mais detalhes.',
        sintaxe: 'A sintaxe do Fire Server é simples:\n- Comandos como `page`, `text`, `button`\n- Textos entre aspas: "texto"\n- Funções: `color("#FF0000")`\n- Comentários: # isto é um comentário',
        exemplos: 'Use `/exemplos` para ver exemplos completos de sites!'
    };

    const help = specificHelps[topic] || `Não encontrei ajuda sobre "${topic}". Use \`/ajuda\` para ver todos os comandos.`;

    await message.reply(`📚 **Ajuda: ${topic}**\n\n${help}`);
}

function validateDSLCode(code) {
    const lines = code.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
    const errors = [];
    let pageCount = 0;
    let elementCount = 0;
    let inPage = false;

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        
        if (trimmed.startsWith('page ')) {
            pageCount++;
            inPage = true;
            if (!trimmed.split(' ')[1]) {
                errors.push({ line: index + 1, message: 'Nome da página está vazio' });
            }
        } else if (trimmed === 'end') {
            inPage = false;
        } else if (trimmed.startsWith('text ') || trimmed.startsWith('image ') || trimmed.startsWith('button ')) {
            elementCount++;
            if (!inPage) {
                errors.push({ line: index + 1, message: 'Elemento fora de uma página' });
            }
            if (!trimmed.includes('(') || !trimmed.includes(')')) {
                errors.push({ line: index + 1, message: 'Faltam parênteses' });
            }
            if (!trimmed.includes('"')) {
                errors.push({ line: index + 1, message: 'Faltam aspas no conteúdo' });
            }
        }
    });

    if (inPage) {
        errors.push({ line: lines.length, message: 'Página não foi fechada com "end"' });
    }

    return {
        valid: errors.length === 0,
        errors,
        stats: {
            lines: lines.length,
            pages: pageCount,
            elements: elementCount
        }
    };
}

// Event: Bot pronto
client.once('ready', () => {
    console.log(`✅ Bot online como ${client.user.tag}`);
    console.log(`🔥 Fire Server Bot v2.0`);
    console.log(`📊 Servidores: ${client.guilds.cache.size}`);
    
    client.user.setActivity('Fire Server | /ajuda', { type: 'PLAYING' });
});

// Event: Mensagem recebida
client.on('messageCreate', async (message) => {
    // Ignorar bots
    if (message.author.bot) return;

    // Ignorar mensagens sem o prefixo
    if (!message.content.startsWith(BOT_PREFIX)) return;

    // Parsear comando e argumentos
    const args = message.content.slice(BOT_PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Executar comando
    const command = commands[commandName];
    if (command) {
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(`Erro executando comando ${commandName}:`, error);
            await message.reply('❌ Ocorreu um erro ao executar este comando.');
        }
    }
});

// Event: Erro
client.on('error', (error) => {
    console.error('Erro do bot:', error);
});

// Iniciar bot
const token = process.env.DISCORD_TOKEN;
if (!token) {
    console.error('❌ DISCORD_TOKEN não encontrado no .env');
    process.exit(1);
}

client.login(token);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Desligando bot...');
    client.destroy();
    process.exit(0);
});

module.exports = { client, db };
