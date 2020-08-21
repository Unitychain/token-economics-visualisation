import sim from './test';

const startingConditions = {
  random: {
    chartResolution: 240,
    simulationEpochs: 87660,
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
    maxMintPerTransaction: 2,
    maxTXCost: 100,
    minimumBurnMintRate: 0.1,
  },
  sine: {
    chartResolution: 1,
    simulationEpochs: 87660,
    marketCap: 100000000,
    tokenSupply: 1000000,
    transactions: 300000,
    targetPrice: 100,
    numberOfNodes: 35000,
    users: 100,
    entitlementMintPerUser: 1,
    churnRate: 20,
    minimumNodes: 1000,
    targetProfitabilityPerNode: 1000,
    maxMintPerTransaction: 2,
    maxTXCost: 100,
    minimumBurnMintRate: 0.1,
  },
  bitcoin: {
    chartResolution: 240,
    simulationEpochs: 87660,
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
    maxMintPerTransaction: 2,
    maxTXCost: 100,
    minimumBurnMintRate: 0.1,
  },
};

const simulationFunctions = {
  random(initialConditions) {
    console.log(initialConditions);

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
      i < Math.floor(
        initialConditions.simulationEpochs.value / initialConditions.chartResolution.value,
      );
      i += 1
    ) {
      for (let p = 0; p < initialConditions.chartResolution.value; p += 1) {
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
  sine(initialConditions) {
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

    const simulation = [];

    charts.forEach((chart) => {
      simulation[chart] = {};
      simulation[chart][new Date(now)] = current[chart];
    });

    for (
      let i = 0;
      i < Math.floor(
        initialConditions.simulationEpochs.value / initialConditions.chartResolution.value,
      );
      i += 1
    ) {
      for (let p = 0; p < initialConditions.chartResolution.value; p += 1) {
        current = sim.step(current, {
          marketCap: (current.targetPrice * 100000)
            * Math.sin(current.epoch / 100) + current.targetPrice * 1000000,
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
