const users = []
const $CASH_CONSTANT = 5000

const addUser = ({id}) => {
    
    const user = {id, cashAmount:$CASH_CONSTANT}
    users.push(user)
    console.log(`${user} was added to the array. The array looks now like ${users[0].cashAmount}`);
    return user
}

const findUser = (id) => {return users.find(user=>user.id===id)}

const updateStateDelta = ({id, cashAmountDelta}) => {

    const user = findUser(id)
    user.cashAmountDelta = cashAmountDelta
    console.log(JSON.stringify(user))
}

const applyStateDelta = (id) => {
    
    const user = findUser(id)

    user.cashAmount += user.cashAmountDelta
    user.cashAmountDelta = 0

    console.log(JSON.stringify(user))

    return user
}

module.exports = {addUser, updateStateDelta, applyStateDelta}
