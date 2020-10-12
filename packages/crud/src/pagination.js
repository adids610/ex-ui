/**
 * 分页
 */
export default {
    template: '',
    provide() {
        return {
            INIT_PAGINATION: this.initPagination,
            UNINIT_PAGINATION: this.uninitPagination
        };
    },
    data() {
        return {
            total: 0,
            currentPage: 1,
            pageSize: Infinity,
            vmPagination: null
        };
    },
    methods: {
        /**
         * 注册分页组件
         * @param vm
         */
        initPagination(vm) {
            this.vmPagination = vm;
            this.pageSize = vm.pageSize;
            this.currentPage = vm.currentPage;
        },
        /**
         * 注销分页组件
         */
        uninitPagination() {
            this.vmPagination = null;
            this.pageSize = Infinity;
            this.currentPage = 1;
        },
        /**
         * 创建分页组件
         * @return 分页VNode
         */
        renderPagination() {
            const wrap = this.$createElement('div', { class: 'ex-crud-pagination' }, []);
            if (this.vmPagination) {
                wrap.children.push(
                    this.$createElement('el-pagination', {
                        props: {
                            ...this.vmPagination.$attrs,
                            layout: this.vmPagination.layout,
                            pageSizes: this.vmPagination.pageSizes,
                            total: this.total,
                            pageSize: this.pageSize,
                            currentPage: this.currentPage
                        },
                        on: {
                            'size-change': this.pageSizeChange,
                            'current-change': this.currentPageChange
                        }
                    })
                );
            }
            return wrap;
        },
        /**
         * 切换当前分页大小
         * @param {Number} v 分页大小
         */
        currentPageChange(v) {
            this.currentPage = v;
            // (双向绑定)同步分页参数
            if (this.vmPagination) {
                this.vmPagination.$emit('update:currentPage', v);
            }
            this.loadData(this.currentPage, this.pageSize);
        },
        /**
         * 切换分页尺寸
         * @param {Number} v 分页大小
         */
        pageSizeChange(v) {
            this.pageSize = v;
            this.currentPage = 1;
            // (双向绑定)同步分页参数
            if (this.vmPagination) {
                this.vmPagination.$emit('update:currentPage', 1);
                this.vmPagination.$emit('update:pageSize', v);
            }
            this.loadData(this.currentPage, this.pageSize);
        }
    }
};
