import ExCrudPagination from '../crud/src/modules/pagination';

ExCrudPagination.install = function(Vue) {
    Vue.component(ExCrudPagination.name, ExCrudPagination);
};

export default ExCrudPagination;
