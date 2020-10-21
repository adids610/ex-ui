<script>
    import mixList from './list';
    import mixTable from '../../../table/src/index';
    import { get } from 'lodash';

    export default {
        name: 'ExCrudTable',
        mixins: [mixList, mixTable],
        data() {
            return {};
        },
        computed: {
            className() {
                return ['ex-table', 'ex-crud-table', 'ex-crud-list'].join(' ');
            },
            listeners() {
                return {
                    ...this.$listeners,
                    'current-change': (r, o) => {
                        typeof this.SET_ROW_SELECTED === 'function' && this.SET_ROW_SELECTED(r);
                        typeof this.$listeners['current-change'] === 'function' && this.$listeners['current-change'](r, o);
                    },
                    'selection-change': (s) => {
                        typeof this.SET_ROW_CHECKED === 'function' && this.SET_ROW_CHECKED(s);
                        typeof this.$listeners['selection-change'] === 'function' && this.$listeners['selection-change'](s);
                    }
                };
            },
            attrs() {
                const attrs = { ...this.$attrs };
                if (!attrs.height) {
                    attrs.height = '100%'
                }
                attrs.highlightCurrentRow = true;
                attrs['highlight-current-row'] = true;
                attrs.data = get(this.CRUD, 'rows', []);
                return attrs;
            }
        },
        methods: {
            /**
             * 渲染序号列
             * @param {Object} props 列定义
             * @param {Object} scopedSlots 作用域插槽
             * @return VNode
             */
            renderColIndex(props, scopedSlots) {
                props.index = (v) => {
                    if (this.CRUD.pageSize === Infinity) {
                        return v + 1;
                    }
                    return this.CRUD.pageSize * (this.CRUD.currentPage - 1) + v + 1;
                }
                return this.$createElement('el-table-column', { props, scopedSlots });
            }
        }
    }
</script>
