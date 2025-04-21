const { updateStateDelta, applyStateDelta, resetUsers, addUser, findUser, CASH_CONSTANT } = require('../../../bin/utils/users')

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
        
        updateStateDelta(fakeId, testValue)
        const result = applyStateDelta(fakeId)
        
        expect(result).toMatchObject({
            id: expect.any(String),
            cashAmount: expect.any(Number),
            assets: expect.any(Object),
        })
    })

    it('should add `cashAmountDelta` to `cashAmount` an object with `id`, `cashAmount`, `assets`', () => {
        
        updateStateDelta(fakeId, testValue)
        const result = applyStateDelta(fakeId)

        expect(result.cashAmount).toBe(testValue + CASH_CONSTANT)
    })
    
    it('should reset `cashAmountDelta` to 0', () => {
        
        updateStateDelta(fakeId, testValue)
        const result = applyStateDelta(fakeId)

        expect(result.cashAmountDelta).toBe(0)
    })

    it('should throw Error when `id` parameter is not passed', () => {
        
        updateStateDelta(fakeId, testValue)
        const createError = () => applyStateDelta()

        expect(createError).toThrow('You didn`t pass ID param to applyStateDelta function')
    })

})