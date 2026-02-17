const { trainNLP, parseMessage } = require('./services/parser');
const { client } = require('./adapters/whatsapp');
const { sumAmountDates } = require('./adapters/googleSheets');
const {add_expense} = require('./actions/register');

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
            if (res && res.intent === 'gasto.register' && res.amount && res.concept) {
                
                await add_expense(msg, res.amount, res.concept);

            } else if (res && res.intent === 'greeting.hello') {
                //msg.reply("Hola fidel cola rota, ¿en qué puedo ayudarte? Puedo registrar gastos si me dices: \"gaste X en concepto\"");
                msg.reply('¡Hola! ¿En qué puedo ayudarte? Puedo registrar gastos si me dices: "gaste X en concepto"');
            } else if (res && res.intent === 'gasto.query') {
                let searchDate = new Date();
                if (msg.body.toLowerCase().includes('ayer')) {
                    searchDate.setDate(searchDate.getDate() - 1);
                }
                try {
                    const total = await sumAmountDates(searchDate);
                    const dateStr = searchDate.toLocaleDateString('es-AR');
                    msg.reply(`El total de gastos para ${dateStr} es: ${total}`);
                    console.log(`Total de gastos para ${dateStr}:`, total);
                } catch (error) {
                    console.error('Error al consultar los gastos:', error);
                    msg.reply('Hubo un error al consultar los gastos. Intenta nuevamente.');
                }
            }
        });
    });

    client.initialize();
}

main();