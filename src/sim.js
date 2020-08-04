import sim from './temp';

const startingConditions = {
  random: {
    chartPerformanceInterval: 240,
    marketCap: 210000000,
    tokenSupply: 2100000,
    transactions: 300000,
    targetPrice: 100,
    numberOfNodes: 35000,
    users: 100,
    entitlementMintPerUser: 1,
    churnRate: 20,
    minimumNodes: 1000,
    targetProfitabilityPerNode: 1000,
    emaStickiness: 1,
    priceAdjustAggressiveness: 1.5,
    maxSupplyAdjustPercent: 2,
    maxTXCost: 100,
    minimumBurnMintRate: 0.1,
  },
  bitcoin: {
    chartPerformanceInterval: 240,
    marketCap: 210000000,
    tokenSupply: 21000,
    transactions: 300000,
    targetPrice: 100,
    numberOfNodes: 35000,
    users: 100,
    entitlementMintPerUser: 1,
    churnRate: 20,
    minimumNodes: 1000,
    targetProfitabilityPerNode: 1000,
    emaStickiness: 1,
    priceAdjustAggressiveness: 1.5,
    maxSupplyAdjustPercent: 2,
    maxTXCost: 100,
    minimumBurnMintRate: 0.1,
  },
};

const simulationFunctions = {
  random(initialConditions) {
    const now = new Date().getTime();

    const inputs = {};

    Object.keys(initialConditions).forEach((input) => {
      inputs[input] = initialConditions[input].value;
    });

    let current = sim.seed(inputs);

    const charts = [
      'marketCap',
      'tokenPrice',
      'tokenSupply',
      'mintPerTransaction',
      'burnPerTransaction',
      'profitabilityPerNode',
      'numberOfNodes',
      'joinRate',
      'transactions',
    ];

    const simulation = {};

    charts.forEach((chart) => {
      simulation[chart] = {};
      simulation[chart][new Date(now)] = current[chart];
    });

    for (
      let i = 0;
      i < Math.floor(87660 / initialConditions.chartPerformanceInterval.value);
      i += 1
    ) {
      for (let p = 0; p < initialConditions.chartPerformanceInterval.value; p += 1) {
        current = sim.step(current, {
          marketCap: Math.max(
            10,
            current.marketCap + Math.floor(Math.random() * 300000) - 150000,
          ),
          transactions: Math.max(
            10,
            current.transactions + Math.floor(Math.random() * 3000) - 1500,
          ),
        });
      }

      // eslint-disable-next-line no-loop-func
      charts.forEach((chart) => {
        simulation[chart][new Date(now + current.epoch * 3600000)] = current[chart];
      });
    }

    return simulation;
  },
};

export default {
  startingConditions,
  simulationFunctions,
};
