const app = require('../app');
const http = require('http');
const socketio = require('socket.io');

// Import helpers
const { pickRandomFinancialEvent, pickRandomStockMarketCard, generateBusinessCard } = require('./utils/cards')
const { addUser, updateStateDelta, applyStateDelta, updateStock, prepareStockState, approveStockOperation, purchaseBusiness, putBuinessCardInBuffer } = require('./utils/users')

// Configure port
const port = process.env.PORT || '3001'
app.set('port', port);

// Configure server
const server = http.createServer(app);
const io = socketio(server);


io.on('connection', (socket) => {

  let stockCompanyName = null
  let actualStockPrice = null

  // Game starts
  socket.on('user:join', () => {

    console.log(`User ${socket.id} opened the game page`)

    const user = addUser(socket.id)

    // Display change in cash
    socket.emit('cash:update', user)
  })

  // 1st card
  socket.on('game:start', () => {

    const randomFinancialEvent = pickRandomFinancialEvent()

    updateStateDelta(socket.id, randomFinancialEvent.amount)

    // Display randomEventCard
    socket.emit("randomEventCard:display", randomFinancialEvent)
  })

  // Apply changes after random event card
  socket.on('state:approveUpdate', () => {

    const user = applyStateDelta(socket.id)

    // Display change in cash
    socket.emit('cash:update', user)

    const randomStockCard = pickRandomStockMarketCard()

    // Update values of mediator variables
    stockCompanyName = randomStockCard.companyName
    actualStockPrice = randomStockCard.actualPrice

    // Send stock market card to a client
    socket.emit('stockMarketCard:display',
      randomStockCard
    )
  })



  // Logic for purhcase / sell of stocks  
  socket.on('state:stockUpdate', ({ amount, operationType }) => {

    // Logs
    console.log('We got state:stockUpdate event from client :)');
    console.log(amount, operationType);

    // Approve stock operations 
    const stockOperationIsApproved = approveStockOperation({ amount, id: socket.id, operationType, actualStockPrice, stockCompanyName })

    if (stockOperationIsApproved) {

      // Update cash
      const cashAmountDelta = -updateStock({ amount, operationType, id: socket.id, stockCompanyName, actualStockPrice })
      updateStateDelta(socket.id, cashAmountDelta)
      const user = applyStateDelta(socket.id)

      // Display change in cash
      socket.emit('cash:update', user)

      // Display new state for stock in `Assets` section
      const stockState = prepareStockState(socket.id)
      socket.emit('state:stockDisplay', stockState)

      const randomStockCard = pickRandomStockMarketCard()

      if (randomStockCard.companyName in stockState) {
        randomStockCard.amountOnHands = stockState[randomStockCard.companyName].amount
        randomStockCard.averagePrice = stockState[randomStockCard.companyName].averagePrice
      } else {
        randomStockCard.amountOnHands = 0
      }

      stockCompanyName = randomStockCard.companyName
      actualStockPrice = randomStockCard.actualPrice

      socket.emit('stockMarketCard:display',
        randomStockCard)
    } else {
      socket.emit('notification:operationIsNotApproved')
    }
  }
  )

  socket.on('skipTheCard', () => {

    const businessCard = generateBusinessCard()

    putBuinessCardInBuffer(socket.id, businessCard)

    socket.emit('businessCard:display', businessCard)
  })

  socket.on('business:purchase', () => {
    const user = purchaseBusiness(socket.id)

    // Display change in cash
    socket.emit('cash:update', user)
  })


  // Closing brackets to the io function
})

server.listen(port);