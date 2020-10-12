import ExCrudDelete from '../crud/src/modules/delete';

ExCrudDelete.install = function(Vue) {
    Vue.component(ExCrudDelete.name, ExCrudDelete);
};

export default ExCrudDelete;
