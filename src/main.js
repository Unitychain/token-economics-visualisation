import Vue from 'vue';
import Chartkick from 'vue-chartkick';
import Chart from 'highcharts';
import '../node_modules/bulma/css/bulma.css';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(Chartkick.use(Chart));

new Vue({
  render: (h) => h(App),
}).$mount('#app');
