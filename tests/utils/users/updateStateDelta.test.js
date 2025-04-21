const { updateStateDelta, resetUsers, addUser, findUser } = require('../../../bin/utils/users')

describe('addUser', () => {

    const fakeId = 'fakeId'
    const testValue = 50

    beforeEach(
        () => {           
            resetUsers()        
            addUser(fakeId)
        }
    )
    
    it('should return an object with `id`, `cashAmount`, `assets`', () => {
        
        const result = updateStateDelta(fakeId, testValue)
        
        expect(result).toMatchObject({
            id: expect.any(String),
            cashAmount: expect.any(Number),
            assets: expect.any(Object),
        })
    })
    
    it('should init `cashAmountDelta` with passed value', () => {
        
        const user = findUser(fakeId)
        expect(user.cashAmountDelta).toBeUndefined()

        const {cashAmountDelta} = updateStateDelta(fakeId, testValue)

        expect(cashAmountDelta).toBe(testValue)
    })

    it('should replace value of `cashAmountDelta` with passed value', () => {

        const firstValue = 50
        const secondValue = 100

        updateStateDelta({id: fakeId, cashAmountDelta: firstValue})
        const {cashAmountDelta} = updateStateDelta(fakeId, secondValue)

        expect(cashAmountDelta).toBe(secondValue)
    })

    it('should not replace value of `cashAmountDelta` with 0', () => {

        const firstValue = 50
        updateStateDelta(fakeId, firstValue)

        const zeroAmount = 0
        updateStateDelta({id: fakeId, cashAmountDelta: zeroAmount})

        const {cashAmountDelta} = findUser(fakeId)

        expect(cashAmountDelta).toBe(firstValue)
    })

    it('should not replace value of `cashAmountDelta` with NaN', () => {

        const firstValue = 50
        updateStateDelta(fakeId, firstValue)

        updateStateDelta(fakeId, NaN)

        const {cashAmountDelta} = findUser(fakeId)

        expect(cashAmountDelta).toBe(firstValue)
    })
    
    it('should not replace value of `cashAmountDelta` with undefined', () => {

        const firstValue = 50
        updateStateDelta(fakeId, firstValue)

        // cashAmountDelta not passed at all
        updateStateDelta(fakeId)

        const {cashAmountDelta} = findUser(fakeId)

        expect(cashAmountDelta).toBe(firstValue)
    })

})