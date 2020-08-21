<template>
  <div class="app container is-fluid">
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': tabsel == 'random' }" @click="changeTab('random')">
          <a>Random</a>
        </li>
        <li :class="{ 'is-active': tabsel == 'sine' }" @click="changeTab('sine')">
          <a>Sine</a>
        </li>
        <li :class="{ 'is-active': tabsel == 'bitcoin' }" @click="changeTab('bitcoin')">
          <a>Bitcoin</a>
        </li>
        <li :class="{ 'is-active': tabsel == 'bitcoin10' }" @click="changeTab('bitcoin10')">
          <a>Bitcoin x10 tps</a>
        </li>
        <li :class="{ 'is-active': tabsel == 'bitcoin100' }" @click="changeTab('bitcoin100')">
          <a>Bitcoin x100 tps</a>
        </li>
        <li :class="{ 'is-active': tabsel == 'bitcoin1000' }" @click="changeTab('bitcoin1000')">
          <a>Bitcoin x1000 tps</a>
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
    setTimeout(() => {
      this.changeTab('bitcoin');
    }, 1000);

    return {
      tabsel: 'none',
      charts: {},
      initialConditions: {
        chartResolution: {
          displayFor: [
            'random',
            'sine',
            'bitcoin',
            'bitcoin10',
            'bitcoin100',
            'bitcoin1000',
          ],
          value: 0,
        },
        simulationEpochs: {
          displayFor: [
            'random',
            'sine',
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
            'sine',
          ],
          value: 0,
        },
        transactions: {
          displayFor: [
            'random',
            'sine',
          ],
          value: 0,
        },
        targetPrice: {
          displayFor: [
            'random',
            'sine',
            'bitcoin',
            'bitcoin10',
            'bitcoin100',
            'bitcoin1000',
          ],
          value: 0,
        },
        numberOfNodes: {
          displayFor: [
            'random',
            'sine',
            'bitcoin',
            'bitcoin10',
            'bitcoin100',
            'bitcoin1000',
          ],
          value: 0,
        },
        users: {
          displayFor: [
            'random',
            'sine',
            'bitcoin',
            'bitcoin10',
            'bitcoin100',
            'bitcoin1000',
          ],
          value: 0,
        },
        entitlementMintPerUser: {
          displayFor: [
            'random',
            'sine',
            'bitcoin',
            'bitcoin10',
            'bitcoin100',
            'bitcoin1000',
          ],
          value: 0,
        },
        churnRate: {
          displayFor: [
            'random',
            'sine',
            'bitcoin',
            'bitcoin10',
            'bitcoin100',
            'bitcoin1000',
          ],
          value: 0,
        },
        minimumNodes: {
          displayFor: [
            'random',
            'sine',
            'bitcoin',
            'bitcoin10',
            'bitcoin100',
            'bitcoin1000',
          ],
          value: 0,
        },
        targetProfitabilityPerNode: {
          displayFor: [
            'random',
            'sine',
            'bitcoin',
            'bitcoin10',
            'bitcoin100',
            'bitcoin1000',
          ],
          value: 0,
        },
        maxMintPerTransaction: {
          displayFor: [
            'random',
            'sine',
            'bitcoin',
            'bitcoin10',
            'bitcoin100',
            'bitcoin1000',
          ],
          value: 0,
        },
        maxTXCost: {
          displayFor: [
            'random',
            'sine',
            'bitcoin',
            'bitcoin10',
            'bitcoin100',
            'bitcoin1000',
          ],
          value: 0,
        },
        minimumBurnMintRate: {
          displayFor: [
            'random',
            'sine',
            'bitcoin',
            'bitcoin10',
            'bitcoin100',
            'bitcoin1000',
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
