const { appendExpense } = require('../adapters/googleSheets');

async function addExpense(msg, amount, concept) {
    try {
        await appendExpense(amount, concept);
        msg.reply(`Gasto registrado: ${amount} en ${concept}`);
        console.log("Se registró el gasto:", amount, concept);
    } catch (error) {
        console.error('Error al registrar el gasto:', error);
        msg.reply('Hubo un error al registrar el gasto. Intenta nuevamente.');
    }
}

module.exports = { addExpense };