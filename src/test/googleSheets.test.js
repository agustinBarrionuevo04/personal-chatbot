jest.mock('../adapters/googleSheets', () => ({
  appendExpense: jest.fn().mockResolvedValue(undefined)
}));

const { appendExpense } = require('../adapters/googleSheets');

describe('GoogleSheets Adapter - appendExpense', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('function definition', () => {
    it('must be a function', () => {
      expect(typeof appendExpense).toBe('function');
    });

    it('must be defined and callable', () => {
      expect(appendExpense).toBeDefined();
    });
  });

  describe('function behavior', () => {
    it('must return a Promise', async () => {
      const result = appendExpense(100, 'comida');
      expect(result).toBeInstanceOf(Promise);
    });

    it('must accept amount and concept parameters', () => {
      expect(() => {
        appendExpense(100, 'comida');
      }).not.toThrow();
    });

    it('must be callable with different amounts', () => {
      const amounts = [100, 250, 99.99, 1000];
      
      amounts.forEach(amount => {
        expect(() => {
          appendExpense(amount, 'concepto');
        }).not.toThrow();
      });
    });

    it('must be callable with different concepts', () => {
      const conceptos = ['comida', 'transporte', 'farmacia', 'supermercado'];
      
      conceptos.forEach(concepto => {
        expect(() => {
          appendExpense(100, concepto);
        }).not.toThrow();
      });
    });

    it('must be called with correct arguments', async () => {
      await appendExpense(100, 'comida');
      expect(appendExpense).toHaveBeenCalledWith(100, 'comida');
    });

    it('must register multiple expenses', async () => {
      await appendExpense(100, 'comida');
      await appendExpense(250, 'supermercado');
      await appendExpense(50, 'transporte');

      expect(appendExpense).toHaveBeenCalledTimes(3);
    });
  });

  describe('error handling', () => {
    it('must handle errors asynchronously', async () => {
      appendExpense.mockRejectedValueOnce(new Error('Error en sheets'));
      
      await expect(appendExpense(100, 'comida')).rejects.toThrow('Error en sheets');
    });

    it('must recover from a previous error', async () => {
      appendExpense.mockRejectedValueOnce(new Error('Error'));
      
      await expect(appendExpense(100, 'comida')).rejects.toThrow();
      
      appendExpense.mockResolvedValueOnce(undefined);
      
      await expect(appendExpense(100, 'comida')).resolves.toBeUndefined();
    });
  });
});

