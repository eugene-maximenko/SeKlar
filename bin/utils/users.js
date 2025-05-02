let users = {}
const CASH_CONSTANT = 5000
const purchaseType = 'buySelect'
const sellType = 'sellSelect'

const findUser = (id) => {

    const user = users[id]

    return user
}

const resetUsers = () => {
    users = {}
}

const addUser = (id) => {


    if (findUser(id)) {
        throw new Error('User already exists');
    }

    const user = {
        id,
        cashAmount: CASH_CONSTANT,
        assets: {
            stock: {}
        }
    }

    users[id] = user

    return user
}

const updateStateDelta = (id, cashAmountDelta) => {

    const user = findUser(id)

    if (typeof cashAmountDelta !== 'number' || cashAmountDelta === 0 || !cashAmountDelta || isNaN(cashAmountDelta)) {
        console.log('Error is about this ' + cashAmountDelta);
        
        throw new Error('Wrong `cashAmountDelta` value in updateStateDelta function');
    }

    user.cashAmountDelta = cashAmountDelta

    return user
}

const applyStateDelta = (id) => {

    if (typeof id !== 'string') {
        throw new Error('You didn`t pass ID param to applyStateDelta function');
    }

    const user = findUser(id)

    user.cashAmount += user.cashAmountDelta
    user.cashAmountDelta = 0

    return user
}

const validateStockUpdate = data => {
    console.log(data);
    
    // validate input
    if (typeof data.amount !== 'number' || data.amount <= 0 || isNaN(data.amount) ||
        typeof data.actualStockPrice !== 'number' || data.actualStockPrice <= 0 || isNaN(data.actualStockPrice) ||
        ![purchaseType, sellType].includes(data.operationType) ||
        typeof data.id !== 'string' ||
        typeof data.stockCompanyName !== 'string' || data.stockCompanyName === ''
    ) {
        throw new Error(`Invalid input in 'validateStockUpdate'`)
    }
}

const updateStock = (data) => {

    validateStockUpdate(data)

    const { amount, operationType, id, stockCompanyName, actualStockPrice } = data

    const user = findUser(id)

    const stocks = user.assets.stock

    const userIsBuying = operationType === 'buySelect'
    const amountDelta = userIsBuying ? Number(amount) : -Number(amount)
    const investmentDelta = amountDelta * actualStockPrice

    if (stockCompanyName in stocks) {

        stocks[stockCompanyName].amount += amountDelta
        
        // users sells everything
        if (stocks[stockCompanyName].amount === 0) {
            delete stocks[stockCompanyName]
            
        } else {
            // recalculation
            stocks[stockCompanyName].totalInvestment += investmentDelta
            stocks[stockCompanyName].averagePrice = Math.round(stocks[stockCompanyName].totalInvestment / stocks[stockCompanyName].amount)
        }

    } else if (Number(amount) > 0) {
        // user doesn't own company yet
        stocks[stockCompanyName] = {
            amount: amountDelta,
            totalInvestment: investmentDelta,
            averagePrice: actualStockPrice
        }
    }

    return investmentDelta
}

const getStockState = (id) => {

    const user = findUser(id)

    const stockState = user.assets.stock

    console.log(`User's stock state: ` + JSON.stringify(stockState));
    console.log('')

    return stockState
}

const approveStockOperation = ({ amount, id, operationType, actualStockPrice, stockCompanyName }) => {


    console.log([...arguments]);
    
    const user = findUser(id)
    const stockState = user.assets.stock

    if (operationType === purchaseType) {

        // Can user afford purchase of stocks?
        return user.cashAmount >= actualStockPrice * amount

    } else if (operationType === sellType) {

        if (stockCompanyName in stockState) {

            const stockOnHands = stockState[stockCompanyName].amount
            
            // Does user have enough stocks to sell as much as he wants to? 
            return amount <= stockOnHands

        }

        return false
    }

}

module.exports = { addUser, updateStateDelta, applyStateDelta, updateStock, prepareStockState: getStockState, approveStockOperation, users, CASH_CONSTANT, findUser, resetUsers }
