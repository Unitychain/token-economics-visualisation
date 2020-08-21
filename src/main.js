import Vue from 'vue';
import Chartkick from 'vue-chartkick';
import 'highcharts/modules/boost';
import 'highcharts/modules/drag-panes.src';
import highcharts from 'highcharts';
import '../node_modules/bulma/css/bulma.css';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(Chartkick.use(highcharts));

new Vue({
  render: (h) => h(App),
}).$mount('#app');
