/**
 * 搜索条件
 */
export default {
    template: '',
    provide() {
        return {
            INIT_SEARCH: this.initSearch,
            UNINIT_SEARCH: this.uninitSearch,
            SUBMIT_PARAMS: this.submitParams
        };
    },
    data() {
        return {
            params: {}, // 搜索条件
            vmSearch: null
        };
    },
    methods: {
        /**
         * 注册搜索组件
         * @param vm
         */
        initSearch(vm) {
            this.vmSearch = vm;
            this.params = vm.value || {};
            this.$refs['heard-search'].append(this.vmSearch.$el);
        },
        /**
         * 注销分页组件
         */
        uninitSearch() {
            this.vmSearch = null;
        },
        /**
         * 提交搜索条件
         * @param params
         */
        submitParams(params) {
            this.params = params;
        }
    }
};
