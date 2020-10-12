import ExCrudSearch from '../crud/src/modules/search';

ExCrudSearch.install = function(Vue) {
    Vue.component(ExCrudSearch.name, ExCrudSearch);
};

export default ExCrudSearch;
