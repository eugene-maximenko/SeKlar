const { resetUsers, updateStock, addUser, findUser, approveStockOperation } = require('../../../bin/utils/users')

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

  it('should return boolean', () => {

    const testInput = createData()

    const result = approveStockOperation(testInput)

    expect(typeof result).toBe('boolean')
  })

  it('should return `true` if user can afford purchase of stocks', () => {

    const testInput = createData()

    const result = approveStockOperation(testInput)

    expect(result).toBe(true)
  })

  it('should return `false` if user can`t afford purchase of stocks', () => {

    const testInput = createData({actualStockPrice:20000})

    const result = approveStockOperation(testInput)

    expect(result).toBe(false)
  })
  
  it('should return `true` if user has enough stocks to sell the amount he wants', () => {

    updateStock(createData())
    const testInput = createData({operationType: sellingTypeOperation})

    const result = approveStockOperation(testInput)

    expect(result).toBe(true)
  })
  
  it('should return `false` if user doesn`t have enough stocks to sell the amount he wants', () => {

    updateStock(createData())
    const testInput = createData({operationType: sellingTypeOperation, amount: 6})

    const result = approveStockOperation(testInput)    

    expect(result).toBe(false)
  })

  it('should return `false` if user doesn`t the company in his assets', () => {

    updateStock(createData())
    const testInput = createData({operationType: sellingTypeOperation, stockCompanyName: 'Versus'})

    const result = approveStockOperation(testInput)    

    expect(result).toBe(false)
  })
  
})