const { trainNLP, parseMessage } = require('./services/parser');
const { client } = require('./adapters/whatsapp');
const { appendExpense } = require('./adapters/googleSheets');

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
            // Solo procesar mensajes que YO envío
            if (!msg.fromMe) {
                return;
            }
            
            // Solo procesar AUTO-MENSAJES (mensajes que me envío a mí mismo)
            if (msg.from !== msg.to) {
                return;
            }
            
            // Evitar que el bot procese sus propias respuestas (loop infinito)
            if (msg.body.startsWith('Gasto registrado:') || msg.body.startsWith('¡Hola!')) {
                return;
            }
            
            // Ignorar mensajes con timestamp previo al último conocido al iniciar la sesión
            if (msg.timestamp && msg.timestamp <= latestKnownTimestamp) {
                return;
            }
            latestKnownTimestamp = Math.max(latestKnownTimestamp, msg.timestamp || latestKnownTimestamp);

            console.log(`Procesando mi mensaje: ${msg.body}`);
            const res = await parseMessage(msg.body);
            if (res && res.intent === 'gasto.register' && res.amount) {
                try {
                    await appendExpense(res.amount, res.msg);
                    msg.reply(`Gasto registrado: ${res.amount} en ${res.msg}`);
                    console.log("Se registró el gasto:", res.amount, res.msg);
                } catch (error) {
                    console.error('Error al registrar el gasto:', error);
                    msg.reply('Hubo un error al registrar el gasto. Intenta nuevamente.');
                }
            } else if (res && res.intent === 'greeting.hello') {
                //msg.reply("Hola fidel cola rota, ¿en qué puedo ayudarte? Puedo registrar gastos si me dices: \"gaste X en concepto\"");
                msg.reply('¡Hola! ¿En qué puedo ayudarte? Puedo registrar gastos si me dices: "gaste X en concepto"');
            }
        });
    });

    client.initialize();
}

main();