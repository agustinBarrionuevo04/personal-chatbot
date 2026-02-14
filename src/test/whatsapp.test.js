const { client } = require('../adapters/whatsapp');

describe('WhatsApp Adapter', () => {
  describe('client object', () => {
    
    it('must export a client object', () => {
      expect(client).toBeDefined();
      expect(typeof client).toBe('object');
    });

    it('must have the on method', () => {
      expect(client.on).toBeDefined();
      expect(typeof client.on).toBe('function');
    });

    it('must have the initialize method', () => {
      expect(client.initialize).toBeDefined();
      expect(typeof client.initialize).toBe('function');
    });

    it('must have the getChats method', () => {
      expect(client.getChats).toBeDefined();
      expect(typeof client.getChats).toBe('function');
    });
  });

  describe('client methods', () => {
    it('must allow registering an event with on()', () => {
      expect(() => {
        client.on('ready', () => {});
      }).not.toThrow();
    });

    it('must allow registering multiple events', () => {
      expect(() => {
        client.on('ready', () => {});
        client.on('message', () => {});
        client.on('qr', () => {});
      }).not.toThrow();
    });

    it('must allow initializing the client', () => {
      expect(() => {
        client.initialize();
      }).not.toThrow();
    });
  });

  describe('client return types', () => {
    it('must return a Promise when calling initialize', async () => {
      const result = client.initialize();
      expect(result).toBeInstanceOf(Promise);
    }, 5000);

    it('must allow registering callbacks for events', () => {
      const callback = jest.fn();
      
      expect(() => {
        client.on('message', callback);
      }).not.toThrow();
    });
  });
});

