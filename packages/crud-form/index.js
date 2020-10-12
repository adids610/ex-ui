import ExCrudForm from '../crud/src/modules/form';

ExCrudForm.install = function(Vue) {
    Vue.component(ExCrudForm.name, ExCrudForm);
};

export default ExCrudForm;
