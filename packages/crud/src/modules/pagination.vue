<script>
    import { propsDefault } from '../../../../src/options';

    export default {
        name: 'ExCrudPagination',
        render() {
            return null;
        },
        inheritAttrs: false,
        inject: {
            INIT_PAGINATION: {
                from: 'INIT_PAGINATION',
                default: null
            },
            UNINIT_PAGINATION: {
                from: 'UNINIT_PAGINATION',
                default: null
            }
        },
        props: {
            pageSize: { type: Number, default: propsDefault('crud.pagination.pageSize', 20) },
            currentPage: { type: Number, default: 1 },
            pageSizes: { type: Array, default: propsDefault('crud.pagination.pageSizes', [20, 50, 100, 200]) },
            layout: {
                type: String,
                default: propsDefault('crud.pagination.layout', 'total, sizes, prev, pager, next, jumper')
            }
        },
        data() {
            return {}
        },
        beforeMount() {
            // 向crud中注册组件
            typeof this.INIT_PAGINATION === 'function' && this.INIT_PAGINATION(this);
        },
        beforeDestroy() {
            // 向crud中注销组件
            typeof this.UNINIT_PAGINATION === 'function' && this.UNINIT_PAGINATION();
        }
    }
</script>
