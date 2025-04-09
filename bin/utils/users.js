const users = []
const $CASH_CONSTANT = 5000

const addUser = ({id}) => {
    
    const user = {id, cashAmount:$CASH_CONSTANT}
    users.push(user)
    console.log(`${user} was added to the array. The array looks now like ${users[0].cashAmount}`);
    return user
}

module.exports = {addUser}
