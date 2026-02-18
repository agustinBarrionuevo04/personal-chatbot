jest.mock('../../adapters/googleSheets', () => ({
  appendExpense: jest.fn().mockResolvedValue(undefined)
}));

const { appendExpense } = require('../../adapters/googleSheets');
const { addExpense } = require('../../actions/register');

describe('test addExpense function in the register module', () => {
    let mockMsg;
    
    beforeEach(()=> {
        jest.clearAllMocks();
        mockMsg = {reply: jest.fn()};
    });

    it('successfully registers an expense', async () => {
        appendExpense.mockResolvedValue(true);
        const amount = 100;
        const concept = 'comida' ;
        await addExpense(mockMsg, amount, concept);

        expect(appendExpense).toHaveBeenCalledWith(amount, concept);
        expect(mockMsg.reply).toHaveBeenCalledWith(`Gasto registrado: ${amount} en ${concept}`);
    });

    it('error while registering an expense', async () => {
        const error = new Error('Error al registrar el gasto');
        appendExpense.mockRejectedValue(error);
        const amount = 100;
        const concept = 'comida' ;
        await addExpense(mockMsg, amount, concept);

        expect(appendExpense).toHaveBeenCalledWith(amount, concept);
        expect(mockMsg.reply).toHaveBeenCalledWith('Hubo un error al registrar el gasto. Intenta nuevamente.');
    });

    it('parameters validation', async () => {
        const amount = 100;
        const concept = 'comida' ;
        await addExpense(mockMsg, amount, concept);

        expect(appendExpense).toHaveBeenCalledWith(amount, concept);
    });


});