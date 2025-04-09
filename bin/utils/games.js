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

const updateInteractiveSection = () => {

  return "Don`t quit! Keep it up!"
}

const pickRandomFinancialEvent = () => {
  const randomFinancialEvent = financialEvents[Math.floor(Math.random() * financialEvents.length)]
  
  const randomNumber = Math.floor(Math.random() * (1500-500+1) + 500)
  const randomAmount = randomFinancialEvent.type == "income" ? randomNumber : -randomNumber
  randomFinancialEvent.amount = randomAmount

  console.log(randomFinancialEvent.amount);
  
  return randomFinancialEvent
}

module.exports = { updateInteractiveSection, pickRandomFinancialEvent }