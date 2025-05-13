// Set up a connection with the server
const socket = io();

// Inform server about new connection
socket.emit('user:join');

function insertSpaceBeforeLastThreeDigits(num) {
    const str = num.toString();
    if (str.length <= 3) return str;
    return str.slice(0, -3) + ' ' + str.slice(-3);
}

const interactiveSection = document.querySelector("#card-field")
const headerCashPointer = document.querySelector(".header-cash")
const assetsCashPointer = document.querySelector('#asset-section-cash')
const startButton = document.querySelector('#start-button')
const stockStateSection = document.querySelector('#assets-deposit-after')
const businessStateSection = document.querySelector('#assets-real_estate-after')
const businessIncomeSection = document.querySelector('#incomes-real_estate-after')
const headerCashflow = document.querySelector('.header-cashflow')
const headerLoan = document.querySelector('#header-loan')
const sidebarLoan = document.querySelector('#liabilities-total')
const sidebarLoanCosts = document.querySelector('#sidebar-loan-number')
const sideBarTotalCosts = document.querySelector('#costs-total')
const totalIncome = document.querySelector('#incomes-total')


// Templates
const cashEventCardTemplate = document.querySelector("#cash-event-card-template").innerHTML
const stockMarketCardTemplate = document.querySelector("#stock-market-card-template").innerHTML
const stockStateTemplate = document.querySelector('#stock-state-template').innerHTML
const businessCardTemplate = document.querySelector('#business-card-template').innerHTML
const businessStateTemplate = document.querySelector('#business-state-template').innerHTML
const businessIncomeTemplate = document.querySelector('#business-income-template').innerHTML
const monthlySummaryTemplate = document.querySelector('#payroll-template').innerHTML

function updateBalance(user) {
    console.log(JSON.stringify(user))

    const state = [headerCashPointer,
        assetsCashPointer,
        headerCashflow,
        totalIncome,
        headerLoan,
        sidebarLoan,
        sideBarTotalCosts,
        sidebarLoanCosts]

    state.forEach(e => e.style.opacity = 0.1)

    setTimeout(() => {

        // Update cash
        headerCashPointer.innerText = insertSpaceBeforeLastThreeDigits(user.cashAmount)
        assetsCashPointer.innerText = insertSpaceBeforeLastThreeDigits(user.cashAmount)

        // Update Cashflow
        headerCashflow.innerHTML = insertSpaceBeforeLastThreeDigits(user.income - user.costs)

        // Display income
        totalIncome.innerHTML = insertSpaceBeforeLastThreeDigits(user.income)

        // Display loan
        headerLoan.innerHTML = insertSpaceBeforeLastThreeDigits(user.loan)
        sidebarLoan.innerHTML = insertSpaceBeforeLastThreeDigits(user.loan)

        // Display costs
        sideBarTotalCosts.innerHTML = insertSpaceBeforeLastThreeDigits(user.costs)
        sidebarLoanCosts.innerHTML = insertSpaceBeforeLastThreeDigits(user.loanMonthlyRent)

        state.forEach(e => e.style.opacity = 1)

    }, 300);  // 1000ms matches the duration of the fade-out
}

startButton.addEventListener('click', () => {
    socket.emit('game:start')
})

// Random Event Card
socket.on("randomEventCard:display", data => {

    const { user, randomFinancialEvent } = data

    updateBalance(user)

    console.log(JSON.stringify(randomFinancialEvent))

    const amountIsPositiveNumber = randomFinancialEvent.amount > 0 ? true : false

    const html = Mustache.render(cashEventCardTemplate, {
        eventDescription: randomFinancialEvent.description,
        amount: amountIsPositiveNumber ? `+${randomFinancialEvent.amount}` : randomFinancialEvent.amount
    });
    interactiveSection.innerHTML = html

    let cashEventColor = document.getElementById("cash-event-amount").style

    if (randomFinancialEvent.amount > 0) {
        cashEventColor.color = "#00d062"
    } else { cashEventColor.color = "red" }

    const nextCardButton = document.querySelector('#next-card-button')

    nextCardButton.addEventListener('click', () => {
        socket.emit('state:approveUpdate')
    })
})

// Display change in cash
socket.on('cash:update', user => {
    updateBalance(user)
})

// Stock Card
socket.on('stockMarketCard:display', data => {

    const { user,
        randomStockCard:
        { actualPrice,
            companyName,
            fairPrice, amountOnHands, averagePrice }
    } = data
    updateBalance(user)

    const stockAmountOnHands = amountOnHands > 0 ? `${amountOnHands} по ${averagePrice}` : 0

    const html = Mustache.render(stockMarketCardTemplate, {
        actualPrice, companyName, fairPrice, stockAmountOnHands
    });
    interactiveSection.innerHTML = html

    const inputElement = document.querySelector('#input_amount')
    const amountSum = document.querySelector(".amount-sum")

    // Handler for the amount field
    inputElement.onchange = function () {
        amountSum.innerText = this.value * actualPrice
    }

    // Validator for input
    inputElement.addEventListener('blur', () => {
        const value = inputElement.value.trim();

        // Allow only digits (and not empty string)
        const isValid = /^[1-9][0-9]*$/.test(value);

        if (!isValid) {
            // Optional: show error, shake input, or reset value
            alert('Only positive numbers allowed!');
            // reset input area
            inputElement.value = 1
            amountSum.innerText = actualPrice
        }
    });


    // Handler for active lable
    let operationType = 'buySelect';

    document.querySelector('.tabs-holder').addEventListener('change', function (e) {
        operationType = e.target.id;
    });

    // Next button handler
    const nextCardButton = document.querySelector('#next-card-button')
    nextCardButton.addEventListener('click', () => {
        socket.emit('state:stockUpdate', { amount: Number(inputElement.value) || 1, operationType })
    })

    // Skip button handler
    const skipButton = document.querySelector('#skip-button')
    skipButton.addEventListener('click', () => {
        socket.emit('skipTheCard')
    })
})

// Display Stock State
socket.on("state:stockDisplay", stockState => {

    console.log(`Client got this stockState ` + JSON.stringify(stockState))

    const stockRows = document.querySelectorAll(`#stock-row`)

    stockRows.forEach((e) => { e.remove() })

    for (key in stockState) {

        const html = Mustache.render(stockStateTemplate, {
            companyName: key,
            amount: stockState[key].amount,
            totalInvestment: stockState[key].totalInvestment,
            averagePrice: stockState[key].averagePrice,
        });

        stockStateSection.insertAdjacentHTML('afterend', html)

    }

    const nextCardButton = document.querySelector('#next-card-button')

    nextCardButton.addEventListener('click', () => {
        socket.emit('state:stockUpdate', { amount: inputElement.value || 1, operationType })
    })
})

socket.on('notification:operationIsNotApproved', () => {
    alert('Operation is not approved, try again :)')
})

socket.on('notification:notEnoughCash', () => {
    alert('Sorry, you can afford it :) Now you can only move to the next card.')
})

socket.on('businessCard:display', (card) => {

    const html = Mustache.render(businessCardTemplate, card);
    interactiveSection.innerHTML = html

    // Next button handler
    const buyButton = document.querySelector('#buy-button')

    buyButton.addEventListener('click', () => {
        socket.emit('business:purchase')
        socket.emit('requestMonthlySummary')
    })

    // Skip button handler
    const skipButton = document.querySelector('#skip-button')
    skipButton.addEventListener('click', () => {
        socket.emit('requestMonthlySummary')
    })
})

socket.on('assets:business:update', (user) => {

    const businessState = user.assets.business

    console.log(`Client got this user state ` + JSON.stringify(user, null, 2))

    const businessAssetRows = document.querySelectorAll(`#business-row`)
    const businessIncomeRows = document.querySelectorAll('#business-income-row')

    businessAssetRows.forEach((e) => { e.remove() })
    businessIncomeRows.forEach((e) => { e.remove() })

    // Can be simplified
    businessState.forEach(element => {
        const businessAssetHtml = Mustache.render(businessStateTemplate, element);
        const businessIncomeHtml = Mustache.render(businessIncomeTemplate, element);

        businessStateSection.insertAdjacentHTML('afterend', businessAssetHtml)
        businessIncomeSection.insertAdjacentHTML('afterend', businessIncomeHtml)
    })

    updateBalance(user)

})

socket.on('monthlySummary', (user) => {
    const profit = insertSpaceBeforeLastThreeDigits(user.income - user.costs)
    user.income = insertSpaceBeforeLastThreeDigits(user.income)
    user.costs = insertSpaceBeforeLastThreeDigits(user.costs)

    const html = Mustache.render(monthlySummaryTemplate, { ...user, profit });
    interactiveSection.innerHTML = html

    // Next card
    const nextCardButton = document.querySelector('#next-card-button')

    nextCardButton.addEventListener('click', () => {
        socket.emit('game:start')
    })

})