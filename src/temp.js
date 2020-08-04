/* eslint-disable */
/*
  SeedStep Params:
  - marketCap
  - transactions
  - numberOfNodes
  - tokenSupply
  - users
  - targetPrice
  - churnRate
  - targetProfitabilityPerNode
  - emaStickiness
  - entitlementMintPerUser
  - priceAdjustAggressiveness
  - maxSupplyAdjustPercent
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

  next.mintPerTransaction = Math.min(
    Math.max(
      next.priceAdjustAggressiveness
      ** (next.tokenPriceEMA - next.targetPrice),
      next.minimumBurnMintRate,
    ),
    next.tokenSupply
    / next.transactions
    / 100
    * next.maxSupplyAdjustPercent,
  );

  next.burnPerTransaction = Math.min(
    Math.max(
      next.priceAdjustAggressiveness
      ** -(next.tokenPriceEMA - next.targetPrice),
      next.minimumBurnMintRate,
    ),
    next.tokenSupply
    / next.transactions
    / 100
    * next.maxSupplyAdjustPercent,
    next.maxTXCost,
  );

  next.entitlementMint = next.users * next.entitlementMintPerUser;

  return next;
}

/*
  Adjustments Params:
  - marketCap
  - transactions
  - users
  - targetPrice
  - churnRate
  - targetProfitabilityPerNode
  - emaStickiness
  - entitlementMintPerUser
  - priceAdjustAggressiveness
  - maxSupplyAdjustPercent
  - minimumNodes
  - maxTXCost
  - minimumBurnMintRate
*/

function step(previous, adjustments) {
  const next = Object.assign(previous, adjustments);

  next.epoch = previous.epoch + 1;

  next.numberOfNodes = Math.max(
    Math.round(
      previous.numberOfNodes
      + previous.numberOfNodes * previous.joinRate / 100
      - previous.numberOfNodes * previous.churnRate / 100,
    ),
    previous.minimumNodes,
  );

  next.tokenSupply = Math.max(
    0,
    previous.tokenSupply
    - previous.burnPerTransaction * previous.transactions
    + previous.mintPerTransaction * previous.transactions
    + previous.entitlementMint,
  );

  next.tokenPrice = next.marketCap / next.tokenSupply;

  next.tokenPriceEMA = (
    previous.tokenPriceEMA
    * next.emaStickiness
    + previous.tokenPrice
  ) / (
    next.emaStickiness + 1
  );

  next.profitabilityPerNode = next.transactions / next.numberOfNodes * next.tokenPrice;

  next.profitabilityPerNodeEMA = (
    previous.profitabilityPerNodeEMA
    * next.emaStickiness
    + previous.profitabilityPerNode
  ) / (
    next.emaStickiness + 1
  );

  next.joinRate = next.churnRate
    * previous.profitabilityPerNodeEMA
    / previous.targetProfitabilityPerNode;

  next.mintPerTransaction = Math.min(
    Math.max(
      next.priceAdjustAggressiveness
      ** (next.tokenPriceEMA - next.targetPrice),
      next.minimumBurnMintRate,
    ),
    next.tokenSupply
    / next.transactions
    / 100
    * next.maxSupplyAdjustPercent,
  );

  next.burnPerTransaction = Math.min(
    Math.max(
      next.priceAdjustAggressiveness
      ** -(next.tokenPriceEMA - next.targetPrice),
      next.minimumBurnMintRate,
    ),
    next.tokenSupply
    / next.transactions
    / 100
    * next.maxSupplyAdjustPercent,
    next.maxTXCost,
  );

  next.entitlementMint = next.users * next.entitlementMintPerUser;

  return next;
}

/*
  Object:
  - epoch
  - targetPrice
  - churnRate
  - targetProfitabilityPerNode
  - emaStickiness
  - entitlementMintPerUser
  - priceAdjustAggressiveness
  - maxSupplyAdjustPercent
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
  - entitlementMint
  - users
*/

module.exports = {
  seed,
  step,
};
