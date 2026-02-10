const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('../../credentials.json');

async function appendExpense(amount, concepto) {
    // Autenticación
    const serviceAccountAuth = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    //Seleccionar la primera hoja
    const sheet = doc.sheetsByIndex[0];

    // Agregar la fila
    await sheet.addRow({
        Fecha: new Date().toLocaleString('es-AR'), 
        Concepto: concepto,
        Monto: amount
    });
}

module.exports = { appendExpense };