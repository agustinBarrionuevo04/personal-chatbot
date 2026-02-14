const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    // LocalAuth guarda la sesión en una carpeta local (.wwebjs_auth)
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

// Evento: Generar el QR 
client.on('qr', (qr) => {
    console.log('Escaneá este QR con tu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Evento: Bot listo para funcionar
client.on('ready', () => {
    console.log('Bot conectado y listo!');
});

// Evento: Fallo de autenticación
client.on('auth_failure', msg => {
    console.error('Error de autenticación:', msg);
});

module.exports = { client };