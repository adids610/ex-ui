<template>
    <div class="ex-crud-list"></div>
</template>

<script>
    export default {
        name: 'ExCrudList',
        inheritAttrs: false,
        inject: {
            CRUD: {
                from: 'CRUD',
                default: {}
            },
            INIT_LIST: {
                from: 'INIT_LIST',
                default: null
            },
            UNINIT_LIST: {
                from: 'UNINIT_LIST',
                default: null
            },
            SET_ROW_SELECTED: {
                from: 'SET_ROW_SELECTED',
                default: null
            },
            SET_ROW_CHECKED: {
                from: 'SET_ROW_CHECKED',
                default: null
            }
        },
        data() {
            return {
                rows: [],
                checked: [],
                selected: null
            }
        },
        methods: {
            getRows() {
                return this.rows;
            }
        },
        beforeMount() {
            // 向crud中注册组件
            typeof this.INIT_LIST === 'function' && this.INIT_LIST(this);
        },
        beforeDestroy() {
            // 向crud中注销组件
            typeof this.UNINIT_LIST === 'function' && this.UNINIT_LIST();
        }
    }
</script>
