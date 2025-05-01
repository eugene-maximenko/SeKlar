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

        const { cashAmountDelta } = updateStateDelta(fakeId, testValue)

        expect(cashAmountDelta).toBe(testValue)
    })

    it('should replace value of `cashAmountDelta` with passed value', () => {

        const firstValue = 50
        const secondValue = 100

        updateStateDelta(fakeId, firstValue)
        const { cashAmountDelta } = updateStateDelta(fakeId, secondValue)

        expect(cashAmountDelta).toBe(secondValue)
    })

    it('should not replace value of `cashAmountDelta` with 0', () => {

        const firstValue = 50
        updateStateDelta(fakeId, firstValue)

        const zeroAmount = 0

        expect(() => updateStateDelta(fakeId, zeroAmount)).toThrow('Wrong `cashAmountDelta` value in updateStateDelta function')
    })

    it('should not replace value of `cashAmountDelta` with NaN', () => {

        const firstValue = 50
        updateStateDelta(fakeId, firstValue)


        expect(() => updateStateDelta(fakeId, NaN)).toThrow('Wrong `cashAmountDelta` value in updateStateDelta function')
    })

    it('should not replace value of `cashAmountDelta` with undefined', () => {

        const firstValue = 50
        updateStateDelta(fakeId, firstValue)

        expect(() => updateStateDelta(fakeId)).toThrow('Wrong `cashAmountDelta` value in updateStateDelta function')
    })

})