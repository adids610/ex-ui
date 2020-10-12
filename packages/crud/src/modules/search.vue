<template>
    <div class="ex-crud-search">
        <template v-if="$slots.default">
            <el-form :model="value" inline class="ex-crud-search-form">
                <slot/>
            </el-form>
            <el-button :type="'crud.search.button.type' | optionValue('primary')"
                       :plain="'crud.search.button.plain' | optionValue(false)"
                       :icon="'crud.search.button.icon' | optionValue('')"
                       @click="search"
                       class="ex-crud-search-button">
                {{ 'crud.search.button.text' | optionValue('搜索') }}
            </el-button>
        </template>

        <template v-if="$slots.more">
            <el-button :type="'crud.search.more.type' | optionValue('primary')"
                       :plain="'crud.search.more.plain' | optionValue(true)"
                       :icon="'crud.search.more.icon' | optionValue('')" @click="openPop"
                       class="ex-crud-search-more">
                {{ 'crud.search.more.text' | optionValue('高级筛选') }}
            </el-button>
            <ex-drawer :visible.sync="popupVisible" :title="'高级筛选'" size="auto" direction="rtl" append-to-body
                       custom-class="ex-crud-search-popup">
                <el-form class:="ex-crud-search-pop-form" :label-width="labelWidth" :model="value">
                    <slot name="more"/>
                </el-form>

                <template slot="footer">
                    <el-button :type="'crud.search.cancel.type' | optionValue('')"
                               :plain="'crud.search.cancel.plain' | optionValue(false)"
                               @click="popupVisible = false">
                        {{ 'crud.search.cancel.text' | optionValue('取消') }}
                    </el-button>
                    <el-button :type="'crud.search.confirm.type' | optionValue('primary')"
                               :plain="'crud.search.confirm.plain' | optionValue(false)"
                               @click="search">
                        {{ 'crud.search.confirm.text' | optionValue('确定') }}
                    </el-button>
                </template>
            </ex-drawer>
        </template>
    </div>
</template>
<script>
    import { propsDefault, mixinOption } from '../../../../src/options';
    import ExDrawer from '../../../drawer/src';
    import { cloneDeep } from 'lodash';

    export default {
        name: 'ExCrudSearch',
        mixins: [mixinOption],
        components: { ExDrawer },
        inheritAttrs: false,
        inject: {
            CRUD: {
                from: 'CRUD',
                default: {}
            },
            INIT_SEARCH: {
                from: 'INIT_SEARCH',
                default: null
            },
            UNINIT_SEARCH: {
                from: 'UNINIT_SEARCH',
                default: null
            },
            SUBMIT_PARAMS: {
                from: 'SUBMIT_PARAMS',
                default: null
            }
        },
        props: {
            // 查询条件数据
            value: {
                type: Object,
                default() {
                    return {};
                }
            },
            popSize: {
                type: String, default: propsDefault('crud.search.popSize', 'auto')
            },
            labelWidth: {
                type: String, default: propsDefault('crud.search.labelWidth', '90px')
            }
        },
        data() {
            return {
                store: null,
                popupVisible: false
            }
        },
        watch: {
            popupVisible(v) {
                // 关闭抽屉时，还原查询条件
                if (!v && this.store != null) {
                    this.$emit('input', this.store);
                }
            }
        },
        methods: {
            /**
             * 打开高级查询
             */
            openPop() {
                // 缓存查询条件
                this.store = cloneDeep(this.value);
                this.popupVisible = true;
            },
            /**
             * 搜索时间
             */
            search() {
                // 清空缓存，避免关闭时插叙条件被还原
                this.store = null;
                typeof this.SUBMIT_PARAMS === 'function' && this.SUBMIT_PARAMS(cloneDeep(this.value));
                typeof this.CRUD.query === 'function' && this.CRUD.query();
                this.popupVisible = false;
            }
        },
        mounted() {
            // 向crud中注册组件
            typeof this.INIT_SEARCH === 'function' && this.INIT_SEARCH(this);
        },
        beforeDestroy() {
            // 向crud中注销组件
            typeof this.UNINIT_SEARCH === 'function' && this.UNINIT_SEARCH();
        }
    }
</script>
