const { sumAmountDates } = require('../adapters/googleSheets');

async function getAmount(msg) {
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

module.exports = { getAmount };