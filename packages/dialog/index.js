import ExDialog from './src/index';

ExDialog.install = function(Vue) {
    Vue.component(ExDialog.name, ExDialog);
};

export default ExDialog;
