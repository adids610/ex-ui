import ExCrudTable from '../crud/src/modules/table';

ExCrudTable.install = function(Vue) {
    Vue.component(ExCrudTable.name, ExCrudTable);
};

export default ExCrudTable;
