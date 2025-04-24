let users = {}
const CASH_CONSTANT = 5000


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
        return user;
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
    // validate input
    if (typeof data.amount !== 'number' || data.amount <= 0 || isNaN(data.amount) ||
        typeof data.actualStockPrice !== 'number' || data.actualStockPrice <= 0 || isNaN(data.actualStockPrice) ||
        !['buySelect', 'sellSelect'].includes(data.operationType) ||
        typeof data.id !== 'string' ||
        typeof data.stockCompanyName !== 'string' || data.stockCompanyName === ''
    ) {
        throw new Error('Invalid input')
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

const prepareStockState = (id) => {

    const user = findUser(id)

    const stockState = user.assets.stock

    console.log(`User's stock state: ` + JSON.stringify(stockState));
    console.log('')

    return stockState
}

const approveStockOperation = ({ amount, id, operationType, actualStockPrice, stockCompanyName }) => {

    const purchaseType = 'buySelect'
    const sellType = 'sellSelect'

    const user = findUser(id)
    const stockState = user.assets.stock

    console.log(`stockOperationIsApproved: ` + JSON.stringify(user));
    console.log('')


    if (operationType === purchaseType) {

        if (user.cashAmount >= actualStockPrice * amount) {
            console.log('TRUE fro BUY is gonna be returned!');

            return true
        }

        return false

    } else if (operationType === sellType) {
        if (stockCompanyName in stockState) {
            const stockOnHands = stockState[stockCompanyName].amount

            if (amount <= stockOnHands) {
                console.log(`TRUE fro SELL is gonna be returned - stockOnHands = ${stockOnHands} and amount to sell = ${amount}`);

                return true
            }

            return false
        }

        return false
    }

}

module.exports = { addUser, updateStateDelta, applyStateDelta, updateStock, prepareStockState, approveStockOperation, users, CASH_CONSTANT, findUser, resetUsers }
