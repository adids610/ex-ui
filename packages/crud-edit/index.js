import ExCrudEdit from '../crud/src/modules/edit';

ExCrudEdit.install = function(Vue) {
    Vue.component(ExCrudEdit.name, ExCrudEdit);
};

export default ExCrudEdit;
