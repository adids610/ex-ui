import ExCrudAdd from '../crud/src/modules/add';

ExCrudAdd.install = function(Vue) {
    Vue.component(ExCrudAdd.name, ExCrudAdd);
};

export default ExCrudAdd;
