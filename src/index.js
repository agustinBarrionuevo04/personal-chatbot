const { trainNLP, parseMessage } = require('./services/parser');
const { client } = require('./adapters/whatsapp');
const { getAmount } = require('./actions/querys');
const { addExpense } = require('./actions/register');

require('dotenv').config();

async function main() {
    console.log('Entrenando el modelo...');
    await trainNLP();

    client.on('ready', async () => {
        console.log('Suscribiendo listener de mensajes nuevos...');

        const chats = await client.getChats();
        let latestKnownTimestamp = chats.reduce((max, chat) => {
            const chatTimestamp = chat.timestamp;
            return Math.max(max, chatTimestamp);
        }, 0);

        client.on('message_create', async msg => {
            // Solo procesar mensajes que yO envío y solo procesar AUTO-MENSAJES
            if (!msg.fromMe || msg.from !== msg.to) {
                return;
            }
            // Evitar que el bot procese sus propias respuestas 
            if (msg.body.startsWith('Gasto registrado:') || msg.body.startsWith('¡Hola!')) {
                return;
            }
            // Ignorar mensajes con timestamp previo al último conocido al iniciar la sesión
            if (msg.timestamp && msg.timestamp <= latestKnownTimestamp) {
                return;
            }
            latestKnownTimestamp = Math.max(latestKnownTimestamp, msg.timestamp || latestKnownTimestamp);

            console.log(`Procesando mensaje: ${msg.body}`);

            const res = await parseMessage(msg.body);

            if (res && res.intent === 'greeting.hello') {
                msg.reply('¡Hola! ¿En qué puedo ayudarte? Puedo registrar gastos si me dices: "gaste X en concepto"');
            } else if (res && res.intent === 'gasto.register' && res.amount && res.concept) {
                await addExpense(msg, res.amount, res.concept);
            } else if (res && res.intent === 'gasto.query') {
                await getAmount(msg);
            }
        });
    });

    client.initialize();
}

main();