const { users, addUser, findUser, resetUsers } = require('../../../bin/utils/users')

describe('addUser', () => {

    beforeEach(
        () => {
            resetUsers()        
        }
    )
    const fakeId = 'fakeId'

    it('should return an object with `id`, `cashAmount`, `assets` and `stock` properties', () => {

        addUser(fakeId)

        const result = findUser(fakeId)

        expect(result).toMatchObject({
            id: expect.any(String),
            cashAmount: expect.any(Number),
            assets: expect.any(Object),
        })

        expect(typeof result.assets.stock).toBe('object')
    })

    it('should return an object with same `id`', () => {
        const fakeId = 'fakeId2'
        addUser('fakeId1')
        addUser('fakeId2')

        const result = findUser(fakeId)

        expect(result.id).toBe(fakeId)
    })
})