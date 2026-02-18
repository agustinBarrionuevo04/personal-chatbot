jest.mock('../../adapters/googleSheets', () => ({
    sumAmountDates: jest.fn().mockResolvedValue(undefined)
}));

const { sumAmountDates } = require('../../adapters/googleSheets');
const { getAmount } = require('../../actions/querys');

describe('test getAmount function in the querys module', () => {
    let mockMsg;

    beforeEach(() => {
        jest.clearAllMocks();
        mockMsg = {
            reply: jest.fn(),
            body: 'cuanto gaste hoy?'
        };
    });

    it('successfully retrieves the total amount for today', async () => {
        const total = 500;
        sumAmountDates.mockResolvedValue(total);

        await getAmount(mockMsg);

        const todayStr = new Date().toLocaleDateString('es-AR');
        expect(sumAmountDates).toHaveBeenCalledWith(expect.any(Date));
        expect(mockMsg.reply).toHaveBeenCalledWith(`El total de gastos para ${todayStr} es: ${total}`);
    });

    it('successfully retrieves the total amount for yesterday', async () => {
        const total = 300;
        sumAmountDates.mockResolvedValue(total);
        mockMsg.body = 'cuanto gaste ayer?';

        await getAmount(mockMsg);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toLocaleDateString('es-AR');
        expect(sumAmountDates).toHaveBeenCalledWith(expect.any(Date));
        expect(mockMsg.reply).toHaveBeenCalledWith(`El total de gastos para ${yesterdayStr} es: ${total}`);
    });

    it('handles errors when retrieving the total amount', async () => {
        const error = new Error('Error al consultar los gastos');
        sumAmountDates.mockRejectedValue(error);

        await getAmount(mockMsg);

        expect(sumAmountDates).toHaveBeenCalledWith(expect.any(Date));
        expect(mockMsg.reply).toHaveBeenCalledWith('Hubo un error al consultar los gastos. Intenta nuevamente.');
    });

    it('must handle zero total amount', async () => {
        const total = 0;
        sumAmountDates.mockResolvedValue(total);
        await getAmount(mockMsg);
        
        const todayStr = new Date().toLocaleDateString('es-AR');
        expect(sumAmountDates).toHaveBeenCalledWith(expect.any(Date));
        expect(mockMsg.reply).toHaveBeenCalledWith(`El total de gastos para ${todayStr} es: ${total}`);
    });
});
