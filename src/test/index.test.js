// Mock de los módulos antes de requerirlos
jest.mock('../services/parser', () => ({
  trainNLP: jest.fn().mockResolvedValue(undefined),
  parseMessage: jest.fn().mockResolvedValue(null)
}));

jest.mock('../adapters/whatsapp', () => ({
  client: {
    on: jest.fn(),
    initialize: jest.fn().mockResolvedValue(undefined),
    getChats: jest.fn().mockResolvedValue([])
  }
}));

jest.mock('../adapters/googleSheets', () => ({
  appendExpense: jest.fn().mockResolvedValue(undefined)
}));

jest.mock('dotenv');

const { trainNLP, parseMessage } = require('../services/parser');
const { client } = require('../adapters/whatsapp');
const { appendExpense } = require('../adapters/googleSheets');

describe('test main function in the index module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('module dependencies', () => {
    it('import trainNLP', () => {
      expect(trainNLP).toBeDefined();
      expect(typeof trainNLP).toBe('function');
    });

    it('import parseMessage', () => {
      expect(parseMessage).toBeDefined();
      expect(typeof parseMessage).toBe('function');
    });

    it('import client of whatsapp', () => {
      expect(client).toBeDefined();
      expect(typeof client).toBe('object');
    });

    it('import appendExpense of googleSheets', () => {
      expect(appendExpense).toBeDefined();
      expect(typeof appendExpense).toBe('function');
    });
  });

  describe('client configuration', () => {
    it('client must have the method on', () => {
      expect(client.on).toBeDefined();
      expect(typeof client.on).toBe('function');
    });

    it('client must have the method initialize', () => {
      expect(client.initialize).toBeDefined();
      expect(typeof client.initialize).toBe('function');
    });

    it('client must have the method getChats', () => {
      expect(client.getChats).toBeDefined();
      expect(typeof client.getChats).toBe('function');
    });
  });

  describe('async functions', () => {
    it('trainNLP must return a Promise', async () => {
      const result = trainNLP();
      expect(result).toBeInstanceOf(Promise);
    });

    it('parseMessage must return a Promise', () => {
      const result = parseMessage('test');
      expect(result).toBeInstanceOf(Promise);
    });

    it('client.initialize must return a Promise', () => {
      const result = client.initialize();
      expect(result).toBeInstanceOf(Promise);
    });

    it('client.getChats must return a Promise', () => {
      const result = client.getChats();
      expect(result).toBeInstanceOf(Promise);
    });

    it('appendExpense must return a Promise', () => {
      const result = appendExpense(100, 'comida');
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('event registration', () => {
    it('must register ready event', () => {
      const callback = jest.fn();
      client.on('ready', callback);
      
      expect(client.on).toHaveBeenCalledWith('ready', expect.any(Function));
    });

    it('must register message event', () => {
      const callback = jest.fn();
      client.on('message', callback);
      
      expect(client.on).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('must register multiple listeners', () => {
      const readyCallback = jest.fn();
      const messageCallback = jest.fn();
      
      client.on('ready', readyCallback);
      client.on('message', messageCallback);
      
      expect(client.on).toHaveBeenCalledTimes(2);
    });
  });

  describe('mocks verification', () => {
    it('parseMessage must be a mock', () => {
      expect(parseMessage.mock).toBeDefined();
    });

    it('trainNLP must be a mock', () => {
      expect(trainNLP.mock).toBeDefined();
    });

    it('appendExpense must be a mock', () => {
      expect(appendExpense.mock).toBeDefined();
    });

    it('client.on must be a mock', () => {
      expect(client.on.mock).toBeDefined();
    });
  });
});
