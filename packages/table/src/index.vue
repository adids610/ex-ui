<script>
    import { cloneDeep } from 'lodash';
    import dayjs from 'dayjs';
    import { removeResizeListener, addResizeListener } from '@/utils/resize-event';

    const METHODS = {};
    [
        'clearSelection', 'toggleRowSelection', 'toggleAllSelection', 'toggleRowExpansion', 'setCurrentRow',
        'clearSort', 'clearFilter', 'doLayout', 'sort'
    ].forEach((m) => {
        METHODS[m] = function(...args) {
            return this.$refs.eltable[m](...args);
        };
    });

    export default {
        name: 'ExTable',
        inheritAttrs: false,
        components: {},
        props: {
            columns: { type: Array },
            enums: { type: Object, default: null },
            border: { type: Boolean, default: true }
        },
        data() {
            return {};
        },
        computed: {
            className() {
                return 'ex-table';
            },
            listeners() {
                return this.$listeners;
            },
            attrs() {
                return this.$attrs;
            },
            bindings() {
                const bindings = {};
                Object.entries(this.enums || {}).forEach(([k, records]) => {
                    bindings[k] = {};
                    (records || []).forEach(({ value, label }) => {
                        bindings[k][String(value)] = label;
                    })
                });
                return bindings;
            }
        },
        watch: {
            columns() {
                this.$nextTick(() => {
                    this.doLayout()
                })
            }
        },
        render(h) {
            const createCols = (cols) => {
                return (cols || []).filter((c) => {
                    return c;
                }).map((c) => {
                    if ((c.children || []).length > 0) {
                        return h('el-table-column', { props: c }, createCols(c.children));
                    }

                    const scoped = {};
                    if (c.header && this.$scopedSlots[c.header]) {
                        scoped.header = this.$scopedSlots[c.header];
                    }
                    if (c.cell && this.$scopedSlots[c.cell]) {
                        scoped.default = this.$scopedSlots[c.cell];
                        return h('el-table-column', { props: c, scopedSlots: scoped });
                    }

                    if (c.type === 'index') {
                        return this.renderColIndex(c, scoped);
                    }
                    else if (c.type === 'bool') {
                        return this.renderColBool(c, scoped);
                    }
                    else if (c.type === 'enum') {
                        return this.renderColEnum(c, scoped);
                    }
                    else if (c.type === 'date') {
                        return this.renderColDate(c, scoped);
                    }
                    else if (c.type === 'unix') {
                        return this.renderColUnix(c, scoped);
                    }
                    else {
                        return h('el-table-column', { props: c, scopedSlots: scoped });
                    }
                });
            };

            const columns = cloneDeep(this.columns);

            return h('el-table', {
                ref: 'eltable', class: this.className,
                props: { ...this.attrs, border: this.border },
                on: this.listeners
            }, createCols(columns));
        },
        methods: {
            ...METHODS,
            /**
             * 渲染序号列
             * @param {Object} props 列定义
             * @param {Object} scopedSlots 作用域插槽
             * @return VNode
             */
            renderColIndex(props, scopedSlots) {
                return this.$createElement('el-table-column', { props, scopedSlots });
            },
            /**
             * 渲染时间戳数据
             * @param {Object} props 列定义
             * @param {Object} scopedSlots 作用域插槽
             * @return VNode
             */
            renderColUnix(props, scopedSlots) {
                if (!props.formatter) {
                    props.formatter = (row, column, cellValue) => {
                        const v = Number(cellValue);
                        return v ? dayjs.unix(v).format(props.format || 'YYYY-MM-DD') : '';
                    };
                }
                return this.$createElement('el-table-column', { props, scopedSlots });
            },
            /**
             * 渲染时间数据，可以 new Date
             * @param {Object} props 列定义
             * @param {Object} scopedSlots 作用域插槽
             * @return VNode
             */
            renderColDate(props, scopedSlots) {
                if (!props.formatter) {
                    props.formatter = (row, column, cellValue) => {
                        const v = cellValue ? dayjs(cellValue) : null;
                        return v && v.isValid() ? v.format(props.format || 'YYYY-MM-DD') : '';
                    };
                }
                return this.$createElement('el-table-column', { props, scopedSlots });
            },
            /**
             * 渲染枚举数据
             * @param {Object} props 列定义
             * @param {Object} scopedSlots 作用域插槽
             * @return VNode
             */
            renderColEnum(props, scopedSlots) {
                if (!props.formatter) {
                    props.formatter = (row, column, cellValue) => {
                        if (cellValue == null || !this.bindings[props.format]) {
                            return '';
                        }
                        const v = this.bindings[props.format][cellValue];
                        return v === null ? '' : v;
                    };
                }
                return this.$createElement('el-table-column', { props, scopedSlots });
            },
            /**
             * 渲染Bool数据
             * @param {Object} props 列定义
             * @param {Object} scopedSlots 作用域插槽
             * @return VNode
             */
            renderColBool(props, scopedSlots) {
                if (!props.formatter) {
                    props.formatter = (row, column, cellValue) => {
                        if (cellValue == null) {
                            return '';
                        }
                        if (typeof cellValue === 'number' || !isNaN(cellValue)) {
                            return !Number(cellValue) ? '否' : '是';
                        }
                        return !cellValue ? '否' : '是';
                    };
                }
                return this.$createElement('el-table-column', { props, scopedSlots });
            }
        },
        mounted() {
            addResizeListener(this.$el, this.doLayout);
        },
        beforeDestroy() {
            removeResizeListener(this.$el, this.doLayout);
        }
    }
</script>
