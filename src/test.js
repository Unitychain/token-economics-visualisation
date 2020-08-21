/* eslint-disable */
/*
  SeedStep Params:
  - marketCap
  - transactions
  - numberOfNodes
  - tokenSupply
  - targetPrice
  - churnRate
  - targetProfitabilityPerNode
  - maxMintPerTransaction
  - minimumNodes
  - maxTXCost
  - minimumBurnMintRate
*/

function seed(next) {
  next.epoch = 0;

  next.tokenPrice = next.marketCap / next.tokenSupply;

  next.tokenPriceEMA = next.tokenPrice;

  next.profitabilityPerNode = next.transactions / next.numberOfNodes * next.tokenPrice;

  next.profitabilityPerNodeEMA = next.profitabilityPerNode;

  next.joinRate = next.churnRate;

  next.mintPerTransaction = Math.max(
    next.minimumBurnMintRate,
    Math.min(
      next.maxMintPerTransaction,
      next.tokenPriceEMA / next.targetPrice
    )
  );

  next.burnPerTransaction = Math.max(
    next.minimumBurnMintRate,
    Math.min(
      next.maxTXCost,
      next.targetPrice / next.tokenPriceEMA,
    ),
  );

  return next;
}

/*
  Adjustments Params:
  - marketCap
  - transactions
  - targetPrice
  - churnRate
  - targetProfitabilityPerNode
  - maxMintPerTransaction
  - minimumNodes
  - maxTXCost
  - minimumBurnMintRate
*/

function step(previous, adjustments) {
  /*
    Apply adjustments to parameters, this can be called in cases such as:
    - Target price adjustments to track CPI
    - Churn rate adjustment in case of possible network attacks
  */
  const next = Object.assign(previous, adjustments);

  /*
    Increment epoch
  */
  next.epoch = previous.epoch + 1;

  /*
    Calculate number of nodes:
    + previous.numberOfNodes * previous.joinRate / 100 : add number of nodes from join rate
    - previous.numberOfNodes * previous.churnRate / 100 : remove number of nodes from churn rate
    round to nearest whole number because we can't have partial nodes
    Math.max previous.minimumNodes : don't go below minimum node number
  */
  next.numberOfNodes = Math.max(
    Math.round(
      previous.numberOfNodes
      + previous.numberOfNodes * previous.joinRate / 100
      - previous.numberOfNodes * previous.churnRate / 100,
    ),
    previous.minimumNodes,
  );

  /*
    Calculate token supply:
    - previous.burnPerTransaction * previous.transactions : remove burnt tokens for transaction fees
    + previous.mintPerTransaction * previous.transactions : add minted tokens for transactions processed
    Math.max 1 : 1 token minimum supply to prevent dividing by 0 in other calculations
  */
  next.tokenSupply = Math.min(
    Math.max(
      1,
      previous.tokenSupply - (previous.tokenSupply / 50),
      previous.tokenSupply
      - previous.burnPerTransaction * previous.transactions
      + previous.mintPerTransaction * previous.transactions,
    ),
    previous.tokenSupply + (previous.tokenSupply / 50),
  );

  /*
    Calculate token price from supply and market cap
  */
  next.tokenPrice = next.marketCap / next.tokenSupply;

  /*
    Calculate token price exponential moving average
  */
  next.tokenPriceEMA = (
    previous.tokenPriceEMA
    + previous.tokenPrice
  ) / (
    2
  );

  /*
    Calculate profitability per node
    Nodes get minted tokens from transactions processed
  */
  next.profitabilityPerNode = next.transactions / next.numberOfNodes * next.tokenPrice;

  /*
    Calculate profitability per node exponential moving average
  */
  next.profitabilityPerNodeEMA = (
    previous.profitabilityPerNodeEMA
    + previous.profitabilityPerNode
  ) / (
    2
  );

  /*
    Calculate join rate
    Use EMAs in calculation to smooth out spiky data
    Join rate adjusts so the net gain/loss of nodes tracks towards the target profitability per node
  */
  next.joinRate = next.churnRate
    * previous.profitabilityPerNodeEMA
    / previous.targetProfitabilityPerNode;

  next.mintPerTransaction = Math.max(
    next.minimumBurnMintRate,
    Math.min(
      next.maxMintPerTransaction,
      next.tokenPriceEMA / next.targetPrice
    )
  );

  next.burnPerTransaction = Math.max(
    next.minimumBurnMintRate,
    Math.min(
      next.maxTXCost,
      next.targetPrice / next.tokenPriceEMA,
    ),
  );

  return next;
}

/*
  Object:
  - epoch
  - targetPrice
  - churnRate
  - targetProfitabilityPerNode
  - maxMintPerTransaction
  - minimumNodes
  - maxTXCost
  - minimumBurnMintRate
  - marketCap
  - transactions
  - numberOfNodes
  - profitabilityPerNode
  - profitabilityPerNodeEMA
  - tokenSupply
  - tokenPrice
  - tokenPriceEMA
  - joinRate
  - mintPerTransaction
  - burnPerTransaction
*/

module.exports = {
  seed,
  step,
};
