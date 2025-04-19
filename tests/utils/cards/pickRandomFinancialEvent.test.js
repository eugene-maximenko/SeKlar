const { pickRandomFinancialEvent, financialEvents } = require('../../../bin/utils/cards')

describe('pickRandomFinancialEvent', () => {
    it('should return an object with `type`, `description` and `amount` properties', ()=>{

        const result = pickRandomFinancialEvent(financialEvents)
        
        expect(result).toMatchObject({
            type: expect.any(String),
            description: expect.any(String),
            amount: expect.any(Number),
        })
    })

    it('should not return null',()=>{
        const result = pickRandomFinancialEvent(financialEvents)

        expect(result).not.toBeNull()
    })
    
    it('should return an event with type as either "income" or "cost"',()=>{
        const result = pickRandomFinancialEvent(financialEvents)

        expect(result.type).toMatch(/income|cost/)
    })

    it('should return a positive amount when type is "income", and negative when type is "cost"',()=>{
        const result = pickRandomFinancialEvent(financialEvents)
        
        expect(['income', 'cost']).toContain(result.type)

        if (result.type === 'income') {
            expect(result.amount).toBeGreaterThan(0)
        }

        if (result.type === 'cost') {
            expect(result.amount).toBeLessThan(0)
        }
    })
})