const { pickRandomStockMarketCard, stockCardCompanies } = require('../../../bin/utils/cards')

describe('pickRandomFinancialEvent', () => {
    it('should return an object with `actualPrice`, `companyName`, `fairPrice`, `maxPrice` and `minPrice` properties', () => {

        const result = pickRandomStockMarketCard(stockCardCompanies)

        expect(result).toMatchObject({
            actualPrice: expect.any(Number),
            companyName: expect.any(String),
            fairPrice: expect.any(Number),
            maxPrice: expect.any(Number),
            minPrice: expect.any(Number)
        })
    })

    it('should not return null', () => {
        const result = pickRandomStockMarketCard(stockCardCompanies)

        expect(result).not.toBeNull()
    })

    it('should return a positive amount when type is "income", and negative when type is "cost"', () => {
        const result = pickRandomStockMarketCard(stockCardCompanies)

        expect(result.actualPrice).toBeGreaterThan(0)
        expect(result.fairPrice).toBeGreaterThan(0)
        expect(result.maxPrice).toBeGreaterThan(0)
        expect(result.minPrice).toBeGreaterThan(0)
    })
})