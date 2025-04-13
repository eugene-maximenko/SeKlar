const users = []
const $CASH_CONSTANT = 5000

const addUser = ({id}) => {
    
    const user = {id, cashAmount:$CASH_CONSTANT, assets: {stock:{}}}
    users.push(user)
    return user
}

const findUser = (id) => {return users.find(user=>user.id===id)}

const updateStateDelta = ({id, cashAmountDelta}) => {

    const user = findUser(id)
    user.cashAmountDelta = cashAmountDelta
}

const applyStateDelta = (id) => {
    
    const user = findUser(id)

    user.cashAmount += user.cashAmountDelta
    user.cashAmountDelta = 0
    
    return user
}

const updateStock = (data) => {
    
    console.log(JSON.stringify(data))
    const {amount, operationType, id, stockCompanyName, actualStockPrice} = data

    const user = findUser(id)
    console.log('User before changes' + JSON.stringify(user))
    
    const stocks = user.assets.stock
    
    const userIsBuying = operationType === 'buySelect'
    const amountDelta = userIsBuying ? Number(amount): -Number(amount)
    const investmentDelta = amountDelta * actualStockPrice
    
    if(stockCompanyName in stocks) {
        
        stocks[stockCompanyName].totalInvestment += investmentDelta
        stocks[stockCompanyName].amount += amountDelta

        if(stocks[stockCompanyName].amount === 0) {
            delete stocks[stockCompanyName]
            console.log('User after removing stock' + JSON.stringify(user))
        } else {
            stocks[stockCompanyName].averagePrice = stocks[stockCompanyName].totalInvestment / stocks[stockCompanyName].amount
            console.log('User after changing stock' + JSON.stringify(user))
        }
        console.log('')
    } else if (Number(amount)>0){
        stocks[stockCompanyName] = {
            amount: amountDelta,
            totalInvestment: investmentDelta,
            averagePrice: actualStockPrice
        }
        console.log('User after initiating stock' + JSON.stringify(user))
        console.log('')
    } else {
        console.log(`Update stock function didn't change user.`);
    }
    
    return investmentDelta
}    

const prepareStockState = (id) => {
    
    const user = findUser(id)
    
    const stockState = user.assets.stock
    
    console.log(`User's stock state: ` + JSON.stringify(stockState));
    console.log('')
    
    return stockState 
}

module.exports = {addUser, updateStateDelta, applyStateDelta, updateStock, prepareStockState}
