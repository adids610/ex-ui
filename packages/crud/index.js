import ExCrud from './src/index';

ExCrud.install = function(Vue) {
    Vue.component(ExCrud.name, ExCrud);
};

export default ExCrud;
