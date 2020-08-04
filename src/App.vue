<template>
  <div class="app container is-fluid">
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': tabsel == 'random' }" @click="changeTab('random')">
          <a>Random</a>
        </li>
        <li :class="{ 'is-active': tabsel == 'bitcoin' }" @click="changeTab('bitcoin')">
          <a>Bitcoin</a>
        </li>
      </ul>
    </div>
    <div class="content">
      <h5 v-if="tabsel != 'none'">Initial Conditions</h5>
      <div
        class="field is-horizontal"
        v-for="parameter in adjustableParameters"
        :key="parameter"
      >
        <div class="field-label is-normal">
          <label class="label">{{parameter}}</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input class="input" type="number" v-model="initialConditions[parameter].value">
            </p>
          </div>
        </div>
      </div>
      <button v-if="tabsel != 'none'" class="button is-fullwidth" @click="simulate">
        Run Simulation
      </button>
    </div>
    <div class="box" v-for="chart in Object.keys(charts)" :key="chart">
      {{chart}}
      <line-chart
        :data="charts[chart]"
        :library="{
          chart: {
            zoomType: 'x'
          },
        }"
      ></line-chart>
    </div>
  </div>
</template>

<script>
import sim from '@/sim';

export default {
  name: 'App',
  data() {
    return {
      tabsel: 'none',
      charts: {},
      initialConditions: {
        chartPerformanceInterval: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
        marketCap: {
          displayFor: [
            'random',
          ],
          value: 0,
        },
        tokenSupply: {
          displayFor: [
            'random',
          ],
          value: 0,
        },
        transactions: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
        targetPrice: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
        numberOfNodes: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
        users: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
        entitlementMintPerUser: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
        churnRate: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
        minimumNodes: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
        targetProfitabilityPerNode: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
        emaStickiness: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
        priceAdjustAggressiveness: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
        maxSupplyAdjustPercent: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
        maxTXCost: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
        minimumBurnMintRate: {
          displayFor: [
            'random',
            'bitcoin',
          ],
          value: 0,
        },
      },
    };
  },
  computed: {
    adjustableParameters() {
      const adjustableParameters = [];
      Object.keys(this.initialConditions).forEach((parameter) => {
        if (this.initialConditions[parameter].displayFor.includes(this.tabsel)) {
          adjustableParameters.push(parameter);
        }
      });
      return adjustableParameters;
    },
  },
  methods: {
    changeTab(tab) {
      this.tabsel = tab;
      Object.keys(this.initialConditions).forEach((parameter) => {
        this.initialConditions[parameter].value = sim.startingConditions[this.tabsel][parameter];
      });
    },
    simulate() {
      console.time('simulate');
      this.charts = sim.simulationFunctions[this.tabsel]({ ...this.initialConditions });
      console.timeEnd('simulate');
    },
  },
};
</script>

<style>
  .app {
    margin-top: 24px;
    margin-bottom: 24px;
  }
</style>
