const financialEvents = [
  // 🟢 Income
  {
    type: "income",
    description: "Your friend paid back an old debt"
  },
  {
    type: "income",
    description: "You received a tax refund"
  },
  {
    type: "income",
    description: "Found cash in your winter coat"
  },
  {
    type: "income",
    description: "Got a surprise work bonus"
  },
  {
    type: "income",
    description: "Sold something you no longer need"
  },
  // 🔴 Cost
  {
    type: "cost",
    description: "You bought new furniture"
  },
  {
    type: "cost",
    description: "Paid an unexpected medical bill"
  },
  {
    type: "cost",
    description: "Your car broke down and needed repairs"
  },
  {
    type: "cost",
    description: "You went on a spontaneous weekend trip"
  },
  {
    type: "cost",
    description: "Accidentally dropped your phone and had to replace it"
  }
];

const stockCardCompanies = [
  {
    "companyName": "Equinor",
    "fairPrice": 80,
    "minPrice": 40,
    "maxPrice": 120
  },
  {
    "companyName": "Telenor",
    "fairPrice": 60,
    "minPrice": 30,
    "maxPrice": 90
  },
  {
    "companyName": "DNB Bank",
    "fairPrice": 70,
    "minPrice": 35,
    "maxPrice": 105
  },
  {
    "companyName": "Yara International",
    "fairPrice": 90,
    "minPrice": 45,
    "maxPrice": 135
  },
  {
    "companyName": "Orkla",
    "fairPrice": 50,
    "minPrice": 25,
    "maxPrice": 75
  }]

const pickRandomFinancialEvent = () => {
  
  const randomFinancialEvent = financialEvents[Math.floor(Math.random() * financialEvents.length)]
  const randomValue = Math.floor(Math.random() * (1500-500+1) + 500)
  const adjustedAmount = randomFinancialEvent.type == "income" ? randomValue : -randomValue

  const newEvent = {...randomFinancialEvent, amount: adjustedAmount
  }
  
  return newEvent
}

const pickRandomStockMarketCard = (stocks) => {
  const randomStockMarketCard = stockCardCompanies[Math.floor(Math.random() * stockCardCompanies.length)]
  const randomActualPrice = Math.floor(Math.random() * (randomStockMarketCard.maxPrice - randomStockMarketCard.minPrice) + randomStockMarketCard.minPrice)

  const newCard = {...randomStockMarketCard, actualPrice: randomActualPrice}
    
  return newCard
}


module.exports = { pickRandomFinancialEvent, pickRandomStockMarketCard, financialEvents, stockCardCompanies }