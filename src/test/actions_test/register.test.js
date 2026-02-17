jest.mock('../../adapters/googleSheets', () => ({
  appendExpense: jest.fn().mockResolvedValue(undefined)
}));

const { appendExpense } = require('../../adapters/googleSheets');
const { add_expense } = require('../../actions/register');

describe('test add_expense function in the register module', () => {
    let mockMsg;
    
    beforeEach(()=> {
        jest.clearAllMocks();
        mockMsg = {reply: jest.fn()};
    });

    it('successfully registers an expense', async () => {
        appendExpense.mockResolvedValue(true);
        const amount = 100;
        const concept = 'comida' ;
        await add_expense(mockMsg, amount, concept);

        expect(appendExpense).toHaveBeenCalledWith(amount, concept);
        expect(mockMsg.reply).toHaveBeenCalledWith(`Gasto registrado: ${amount} en ${concept}`);
    });





});