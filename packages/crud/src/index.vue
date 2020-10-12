<script>
    import mixPagination from './pagination';
    import mixOperator from './operator';
    import mixSearch from './search';
    import mixList from './list';
    import mixForm from './form';
    import { optionValue } from '../../../src/options';

    export default {
        name: 'ExCrud',
        mixins: [mixSearch, mixPagination, mixOperator, mixList, mixForm],
        provide() {
            return { CRUD: this };
        },
        render(h) {
            // 顶部区域
            const header = h('el-header', { class: 'ex-crud-header', props: { height: 'auto' }, ref: 'header' }, [
                // 左侧操作按钮
                h('div', { class: 'ex-crud-operator' }, [
                    this.renderAdd(),
                    this.renderEdit(),
                    this.renderDelete()
                ]),

                // 导出和列显示设置
                h('div', { class: 'ex-crud-tools', ref: 'header-tools' }, [
                    // h('el-button', { props: { icon: '' } }, '导出'),
                    this.$slots.tools
                ])
            ]);

            // 主题区域
            const main = h('el-main', { class: 'ex-crud-wrap' }, [
                this.$slots.default
            ]);

            // 底部区域
            const footer = this.vmPagination ? h('el-footer', { class: 'ex-crud-footer', props: { height: 'auto' } }, [
                this.renderPagination()
            ]) : null;

            return h('el-container', {
                class: 'ex-crud-container', directives: [
                    { name: 'loading', value: this.loading }
                ]
            }, [
                header,
                main,
                footer
            ]);
        },
        props: {
            name: { type: String, default: '' },
            loader: { type: Function, required: true },
            submit: { type: Function },
            initModel: { type: Function },
            delete: { type: Function }
        },
        data() {
            return {
                loading: false
            }
        },
        methods: {
            /**
             * 数据加载
             */
            async loadData(index, size) {
                this.loading = true;
                try {
                    if (optionValue('crud.beginWith0', false)) {
                        index -= 1;
                    }
                    const res = await this.loader({ params: this.params, index, size });
                    const fmt = optionValue('crud.loaderFormat', null);
                    const { total, rows } = typeof fmt === 'function' ? fmt(res) : res;
                    // 设置数据总量
                    this.total = total;
                    // 设置list数据
                    this.rows = rows;
                    await this.$nextTick();
                    this.$emit('quired', { total, rows });
                }
                catch (e) {
                    e && console.error(e);
                }
                finally {
                    this.loading = false;
                }
            },
            /*
             * 数据查询
             */
            query() {
                this.currentPageChange(1);
            },
            /*
             * 数据刷新
             */
            refresh() {
                this.loadData(this.currentPage, this.pageSize);
            }
        }
    };
</script>
