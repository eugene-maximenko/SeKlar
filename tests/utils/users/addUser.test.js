const { users, addUser, CASH_CONSTANT } = require('../../../bin/utils/users')

describe('addUser', () => {

    beforeEach(
        () => {
         users.length = 0    
        }
    )

    const fakeId = 'fakeId'

    it('should return an object with `id`, `cashAmount`, `assets`', () => {

        const result = addUser(fakeId)

        expect(result).toMatchObject({
            id: expect.any(String),
            cashAmount: expect.any(Number),
            assets: expect.any(Object),
        })

    })


    it('should create user with 5000 cash', () => {
        const result = addUser(fakeId)

        expect(result.cashAmount).toBe(CASH_CONSTANT)
    })

    it('should create new user with provided id ', () => {
        const result = addUser(fakeId)

        expect(result.id).toBe(fakeId)
    })

    it('should add user to users array ', () => {
        const result = addUser(fakeId)

        expect(users).toContain(result)
    })

    it('should contain `stock` object in `assets` property', () => {
        const result = addUser(fakeId)

        expect(typeof result.assets.stock).toBe('object')
    })

    it('creates users only with unique IDs', () => {

        addUser(fakeId)
        const createDuplicate = () => addUser(fakeId)

        expect(createDuplicate).toThrow('User already exists')
    })
})