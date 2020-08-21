const bitcoinSimData = require('./bitcoinRaw.json');

const bitcoinSimDataKeys = {};

bitcoinSimData.forEach((day) => {
  bitcoinSimDataKeys[day.timestamp] = {
    marketCap: day.marketcap,
    transactions: Math.round(day.tps * 3600),
  };
});

console.log(JSON.stringify(bitcoinSimDataKeys));
