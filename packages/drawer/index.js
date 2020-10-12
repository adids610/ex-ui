import ExDrawer from './src/index';

ExDrawer.install = function(Vue) {
    Vue.component(ExDrawer.name, ExDrawer);
};

export default ExDrawer;
