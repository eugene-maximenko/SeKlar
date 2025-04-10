const users = []
const $CASH_CONSTANT = 5000

const addUser = ({id}) => {
    
    const user = {id, cashAmount:$CASH_CONSTANT}
    users.push(user)
    console.log(`${user} was added to the array. The array looks now like ${users[0].cashAmount}`);
    return user
}

const updateStateDelta = ({id, cashAmountDelta}) => {

    const user = users.find(user=>user.id===id) 
    user.cashAmountDelta = cashAmountDelta
    console.log(JSON.stringify(user))
}

module.exports = {addUser, updateStateDelta}
