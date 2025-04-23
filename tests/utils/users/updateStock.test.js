const { resetUsers, updateStock, addUser } = require('../../../bin/utils/users')

describe('addUser', () => {
    
    const purchaseTypeOperation = 'buySelect'
    const sellingTypeOperation = 'sellSelect'
    const testAmount = 5
    const testId = 'fakeId'
    const testCompany = 'Circle K'
    const testPrice = 200

    const createData = (overrides = {}) => {
        const defaults = {
          amount: testAmount,
          operationType: purchaseTypeOperation,
          id: testId, 
          stockCompanyName: testCompany,
          actualStockPrice: testPrice,
        };
      
        return { ...defaults, ...overrides };
      };

      const invalidCases = [
        // amount
        ['amount is null', createData({ amount: null })],
        ['amount is undefined', createData({ amount: undefined })],
        ['amount is string', createData({ amount: 'fifty' })],
        ['amount is negative', createData({ amount: -5 })],
        ['amount is NaN', createData({ amount: NaN })],
        ['amount is zero', createData({ amount: 0 })],
      
        // operationType
        ['operationType is null', createData({ operationType: null })],
        ['operationType is number', createData({ operationType: 123 })],
        ['operationType is empty string', createData({ operationType: '' })],
        ['operationType is random string', createData({ operationType: 'randomstring' })],
      
        // id
        ['id is null', createData({ id: null })],
        ['id is number', createData({ id: 999 })],
        ['id is empty string', createData({ id: '' })],
      
        // stockCompanyName
        ['stockCompanyName is null', createData({ stockCompanyName: null })],
        ['stockCompanyName is boolean', createData({ stockCompanyName: true })],
        ['stockCompanyName is empty string', createData({ stockCompanyName: '' })],
      
        // actualStockPrice
        ['actualStockPrice is null', createData({ actualStockPrice: null })],
        ['actualStockPrice is string', createData({ actualStockPrice: 'high' })],
        ['actualStockPrice is negative', createData({ actualStockPrice: -100 })],
        ['actualStockPrice is NaN', createData({ actualStockPrice: NaN })],
        ['actualStockPrice is zero', createData({ actualStockPrice: 0 })],
      ];
      
    
    beforeEach(
        () => {           
            resetUsers()        
            addUser(testId)
        }
    )
    
    it('should return a number with right input parameters', () => {
        
        const testInput = createData()
        console.log(testInput);
        

        const result = updateStock(testInput)
        
        expect(typeof result).toBe('number')
    })
    
    describe('validate input', () => {
        it.each(invalidCases)('should throw if %s', (_, input) => {
          expect(() => updateStock(input)).toThrow();
        });
    })
      
    // operationType not buySelect or sellSelect - bye

    // if (stockCompanyName in stocks) {stocks[stockCompanyName].totalInvestment += investmentDelta}
    // {stocks[stockCompanyName].amount += amountDelta}

    // if (stocks[stockCompanyName].amount === 0) {
        // delete stocks[stockCompanyName]

        // else 
        // stocks[stockCompanyName].averagePrice = Math.round(stocks[stockCompanyName].totalInvestment / stocks[stockCompanyName].amount)

    // else if (Number(amount) > 0) {
    // //     stocks[stockCompanyName] = {
    // //         amount: amountDelta,
    // //         totalInvestment: investmentDelta,
    // //         averagePrice: actualStockPrice
    // //     }
    // // } else { nothing}
        
})