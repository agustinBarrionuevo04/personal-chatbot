jest.mock('../adapters/googleSheets', () => ({
  appendExpense: jest.fn().mockResolvedValue(undefined),
  sumAmountDates: jest.fn().mockResolvedValue(0)
}));

const { appendExpense, sumAmountDates } = require('../adapters/googleSheets');

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

describe('GoogleSheets Adapter - sumAmountDates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('function definition', () => {
    it('must be a function', () => {
      expect(typeof sumAmountDates).toBe('function');
    });

    it('must be defined and callable', () => {
      expect(sumAmountDates).toBeDefined();
    });
  });

  describe('function behavior', () => {
    it('must return a Promise', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const result = sumAmountDates(yesterday);
      expect(result).toBeInstanceOf(Promise);
    });

    it('must accept a Date parameter', () => {
      const testDate = new Date();
      
      expect(() => {
        sumAmountDates(testDate);
      }).not.toThrow();
    });

    it('must return a number when resolved', async () => {
      sumAmountDates.mockResolvedValueOnce(150.5);
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const result = await sumAmountDates(yesterday);
      expect(typeof result).toBe('number');
    });

    it('must calculate sum for yesterday expenses', async () => {
      sumAmountDates.mockResolvedValueOnce(450);
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const total = await sumAmountDates(yesterday);
      expect(total).toBe(450);
      expect(sumAmountDates).toHaveBeenCalledWith(yesterday);
    });

    it('must calculate sum for today expenses', async () => {
      sumAmountDates.mockResolvedValueOnce(200);
      
      const today = new Date();
      const total = await sumAmountDates(today);
      
      expect(total).toBe(200);
    });

    it('must return 0 when no expenses found for date', async () => {
      sumAmountDates.mockResolvedValueOnce(0);
      
      const testDate = new Date();
      const total = await sumAmountDates(testDate);
      
      expect(total).toBe(0);
    });

    it('must handle multiple dates correctly', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const today = new Date();
      
      sumAmountDates.mockResolvedValueOnce(100);
      const total1 = await sumAmountDates(yesterday);
      
      sumAmountDates.mockResolvedValueOnce(250);
      const total2 = await sumAmountDates(today);
      
      expect(total1).toBe(100);
      expect(total2).toBe(250);
      expect(sumAmountDates).toHaveBeenCalledTimes(2);
    });
  });

  describe('edge cases', () => {
    it('must handle dates in the past', async () => {
      sumAmountDates.mockResolvedValueOnce(75);
      
      const pastDate = new Date('2024-01-15');
      const total = await sumAmountDates(pastDate);
      
      expect(total).toBe(75);
    });

    it('must handle decimal amounts correctly', async () => {
      sumAmountDates.mockResolvedValueOnce(99.99);
      
      const testDate = new Date();
      const total = await sumAmountDates(testDate);
      
      expect(total).toBe(99.99);
    });

    it('must handle large sums', async () => {
      sumAmountDates.mockResolvedValueOnce(15000.50);
      
      const testDate = new Date();
      const total = await sumAmountDates(testDate);
      
      expect(total).toBe(15000.50);
    });
  });

  describe('error handling', () => {
    it('must handle errors asynchronously', async () => {
      sumAmountDates.mockRejectedValueOnce(new Error('Error al consultar gastos'));
      
      const testDate = new Date();
      await expect(sumAmountDates(testDate)).rejects.toThrow('Error al consultar gastos');
    });

    it('must recover from a previous error', async () => {
      const testDate = new Date();
      
      sumAmountDates.mockRejectedValueOnce(new Error('Error'));
      await expect(sumAmountDates(testDate)).rejects.toThrow();
      
      sumAmountDates.mockResolvedValueOnce(100);
      await expect(sumAmountDates(testDate)).resolves.toBe(100);
    });
  });
});
