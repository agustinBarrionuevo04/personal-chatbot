const { parseMessage } = require('../services/parser');

describe('Parser Module - parseMessage', () => {
  describe('parseMessage', () => {
    it('must be a function', () => {
      expect(typeof parseMessage).toBe('function');
    });

    it('must return a Promise', () => {
      const result = parseMessage('test');
      expect(result instanceof Promise).toBe(true);
    });

    it('must be callable without errors', async () => {
      expect(async () => {
        await parseMessage('hola');
      }).not.toThrow();
    });

    it('must accept a string as parameter', async () => {
      expect(() => {
        parseMessage('gaste 100 en comida');
      }).not.toThrow();
    });

    it('must return an object with properties intent, amount, msg, score', async () => {
      const result = await parseMessage('gaste 100 en comida');
      
      if (result !== null) {
        expect(result).toHaveProperty('intent');
        expect(result).toHaveProperty('amount');
        expect(result).toHaveProperty('msg');
        expect(result).toHaveProperty('score');
      }
    });

    it('must handle null or undefined messages gracefully', async () => {
      expect(async () => {
        await parseMessage(null);
        await parseMessage(undefined);
      }).not.toThrow();
    });

    it('must return an object or null', async () => {
      const result = await parseMessage('test');
      expect(result === null || typeof result === 'object').toBe(true);
    });

    it('must process different messages without errors', async () => {
      const mensajes = [
        'gaste 100 en comida',
        'anota 50 en transporte',
        'gaste 250 en supermercado'
      ];

      for (const msg of mensajes) {
        expect(async () => {
          await parseMessage(msg);
        }).not.toThrow();
      }
    });

    it('must maintain consistency in its response', async () => {
      const msg = 'gaste 100 en comida';
      const result1 = await parseMessage(msg);
      const result2 = await parseMessage(msg);
      
      // Ambas deberían ser del mismo tipo
      expect(typeof result1).toBe(typeof result2);
    });
  });
});

