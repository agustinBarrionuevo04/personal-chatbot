const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('../../credentials.json');

async function getAuthenticatedDoc() {
    const serviceAccountAuth = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    return doc;
}

// Función auxiliar para normalizar fechas (solo la parte de fecha, sin hora)
function normalizeDateString(dateStr) {
    // Extraer solo la parte de la fecha (formato: dd/mm/yyyy)
    const match = dateStr.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    return match ? match[1] : null;
}

async function appendExpense(amount, concepto) {
    const doc = await getAuthenticatedDoc();
    const sheet = doc.sheetsByIndex[0];

    // Agregar la fila
    await sheet.addRow({
        Fecha: new Date().toLocaleString('es-AR'), 
        Concepto: concepto,
        Monto: amount
    });
}

async function sumAmountDates(targetDate) {
    const doc = await getAuthenticatedDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    // Normalizar la fecha objetivo (solo dd/mm/yyyy)
    const searchDate = normalizeDateString(targetDate.toLocaleDateString('es-AR'));
    
    if (!searchDate) {
        console.error('Fecha objetivo inválida');
        return 0;
    }

    let total = rows.reduce((acc, row) => {
        const rowDateStr = row.get('Fecha');
        if (!rowDateStr) return acc;
        
        const normalizedRowDate = normalizeDateString(rowDateStr);
        if (normalizedRowDate === searchDate) {
            const monto = parseFloat(row.get('Monto'));
            return acc + (isNaN(monto) ? 0 : monto);
        }
        return acc;
    }, 0);
    
    return total;
}

module.exports = { appendExpense, sumAmountDates };