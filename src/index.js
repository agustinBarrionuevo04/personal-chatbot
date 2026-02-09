const {trainNLP, parseMessage} = require('./services/parser');

async function main() {
    console.log('Entrenando el modelo...');
    await trainNLP();

    client.on('message', async msg => {
        const res = await parseMessage(msg.body);
        if (res && res.intent === 'gasto.register' && res.amount) {
            //llamar a la api de google sheets para registrar el gasto
            //await saveToSheets(res.amount, res.msg);
            console.log(`Registro de gasto: ${res.amount} en ${res.msg}`);
            msg.reply(`Gasto registrado: ${res.amount} en ${res.msg}`);
        }else{
            msg.reply(res.error);
        }
    });
}