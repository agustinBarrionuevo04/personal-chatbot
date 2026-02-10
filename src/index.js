const fs = require('fs');
const path = require('path');

function loadEnvFallback() {
    try {
        const envPath = path.resolve(__dirname, '..', '.env');
        if (!fs.existsSync(envPath)) return;
        const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
        lines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            const [key, ...valueParts] = trimmed.split('=');
            const value = valueParts.join('=').trim();
            if (!process.env[key] && value) {
                process.env[key] = value;
            }
        });
    } catch (err) {
        console.warn('No se pudo cargar el archivo .env:', err.message);
    }
}

try {
    require('dotenv').config();
} catch (err) {
    loadEnvFallback();
}

const { trainNLP, parseMessage } = require('./services/parser');
const { client } = require('./adapters/whatsapp');
const { appendExpense } = require('./adapters/googleSheets');

async function main() {
    console.log('Entrenando el modelo...');
    await trainNLP();

    client.on('ready', async () => {
        console.log('Suscribiendo listener de mensajes nuevos...');

        const chats = await client.getChats();
        let latestKnownTimestamp = chats.reduce((max, chat) => {
            const chatTimestamp = chat.timestamp || (chat.lastMessage ? chat.lastMessage.timestamp : 0);
            return Math.max(max, chatTimestamp || 0);
        }, 0);

        client.on('message', async msg => {
            // Ignorar mensajes con timestamp previo al último conocido al iniciar la sesión
            if (msg.timestamp && msg.timestamp <= latestKnownTimestamp) {
                return;
            }
            latestKnownTimestamp = Math.max(latestKnownTimestamp, msg.timestamp || latestKnownTimestamp);

            const res = await parseMessage(msg.body);
            if (res && res.intent === 'gasto.register' && res.amount) {
                try {
                    //await saveToSheets(res.amount, res.msg);
                    //llamar a la api de google sheets para registrar el gasto
                    await appendExpense(res.amount, res.msg);
                    msg.reply(`Gasto registrado: ${res.amount} en ${res.msg}`);
                } catch (error) {
                    console.error('Error al registrar el gasto:', error);
                    msg.reply('Hubo un error al registrar el gasto. Intenta nuevamente.');
                }
            }
        });
    });

    client.initialize();
}

main();
