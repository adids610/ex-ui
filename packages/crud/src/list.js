/**
 * 数据列表
 */
export default {
    template: '',
    provide() {
        return {
            INIT_LIST: this.initList,
            UNINIT_LIST: this.uninitList,
            SET_ROW_SELECTED: this.setRowSelected,
            SET_ROW_CHECKED: this.setRowChecked
        };
    },
    data() {
        return {
            vmList: null,
            rows: [],
            rowChecked: [],
            rowSelected: null
        };
    },
    methods: {
        /**
         * 注册列表组件
         * @param vm
         */
        initList(vm) {
            this.vmList = vm;
            this.rowChecked = vm.checked;
            this.rowSelected = vm.selected;
        },
        /**
         * 注销列表组件
         */
        uninitList() {
            this.vmList = null;
            this.rowChecked = [];
            this.rowSelected = null;
        },
        /**
         * 设置当前选中行
         * @param {Object} selected
         */
        setRowSelected(selected) {
            this.rowSelected = selected;
            this.$emit('selected-change', selected);
        },
        /**
         * 设置当前多选的行
         * @param {Array} checked
         */
        setRowChecked(checked) {
            this.rowChecked = checked;
            this.$emit('checked-change', checked);
        },
        getRows() {
            return this.rows;
        }
    }
};
