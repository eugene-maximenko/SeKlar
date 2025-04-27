const { resetUsers, updateStock, addUser, findUser } = require('../../../bin/utils/users')

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

    const result = updateStock(testInput)

    expect(typeof result).toBe('number')
  })

  describe('validate input', () => {
    it.each(invalidCases)('should throw if %s', (_, input) => {
      expect(() => updateStock(input)).toThrow();
    });
  })

  it('should add stocks of new company to `assets.stock`  ', () => {

    updateStock(createData({ stockCompanyName: "New company" }))

    const user = findUser(testId)

    const result = user.assets.stock["New company"]

    expect(result).toMatchObject({
      amount: testAmount,
      totalInvestment: testAmount * testPrice,
      averagePrice: testPrice
    })
  })

  it('should recalculate `amount`, `totalInvestment` and `averagePrice` when user buys more stocks of the same company', () => {

    const newPrice = 100
    // 1st purchase
    updateStock(createData({ actualStockPrice: newPrice }))

    // 2nd purchase
    updateStock(createData())

    const user = findUser(testId)

    // get amount of stocks
    const result = user.assets.stock[testCompany]

    expect(result).toMatchObject({
      amount: testAmount * 2,
      totalInvestment: testAmount * testPrice + testAmount * newPrice,
      averagePrice: Math.round(result.totalInvestment / result.amount)
    })

  })

  it('should recalculate `amount`, `totalInvestment` and `averagePrice` when user sells stocks partially', () => {

    const newPrice = 50
    const amountToPurchase = 10

    // 1st purchase
    updateStock(createData({ amount: amountToPurchase }))

    // sell partially
    updateStock(createData({ amountactualStockPrice: newPrice, operationType: sellingTypeOperation }))

    const user = findUser(testId)

    // get amount of stocks
    const result = user.assets.stock[testCompany]

    expect(result).toMatchObject({
      amount: amountToPurchase - testAmount,
      totalInvestment: (amountToPurchase - testAmount) * testPrice,
      averagePrice: Math.round(result.totalInvestment / result.amount)
    })

  })

  it('should remove stocks from assets when user sells company`s stocks completely', () => {

    // 1st purchase
    updateStock(createData())

    // sells completely
    updateStock(createData({ operationType: sellingTypeOperation }))

    const user = findUser(testId)

    // get amount of stocks
    const result = user.assets.stock[testCompany]

    expect(typeof result).toBe('undefined')
  })


})