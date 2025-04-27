const { resetUsers, updateStock, prepareStockState, addUser, findUser } = require('../../../bin/utils/users')

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

  beforeEach(
    () => {
      resetUsers()
      addUser(testId)
    }
  )

  it('should return an object', () => {

    updateStock(createData())

    const stockState = prepareStockState(testId)

    expect(stockState[testCompany]).toMatchObject({
      amount: testAmount,
      totalInvestment: testAmount * testPrice,
      averagePrice: testPrice
    })
  })

})