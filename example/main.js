import Vue from 'vue';
import App from './App.vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import ExUI from '../src/index';
import '../themes/index.scss';

Vue.use(ElementUI, { size: 'mini' });
Vue.use(ExUI);

Vue.config.productionTip = false;

new Vue({
    render: h => h(App)
}).$mount('#app');
