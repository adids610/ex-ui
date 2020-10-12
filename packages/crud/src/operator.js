/**
 * 新增删除修改
 */
import { runDelete } from './utils/del';

export default {
    template: '',
    provide() {
        return {
            INIT_ADD: this.initAdd,
            UNINIT_ADD: this.uninitAdd,

            INIT_EDIT: this.initEdit,
            UNINIT_EDTI: this.uninitEdit,

            INIT_DELETE: this.initDelete,
            UNINIT_DELETE: this.uninitDelete
        };
    },
    data() {
        return {
            vmAdd: null,
            vmEdit: null,
            vmDelete: null
        };
    },
    methods: {
        /**
         * 注册新增组件
         * @param vm
         */
        initAdd(vm) {
            this.vmAdd = vm;
        },
        /**
         * 注销新增组件
         */
        uninitAdd() {
            this.vmAdd = null;
        },

        /**
         * 注册编辑组件
         * @param vm
         */
        initEdit(vm) {
            this.vmEdit = vm;
        },
        /**
         * 注销编辑组件
         */
        uninitEdit() {
            this.vmEdit = null;
        },

        /**
         * 注册删除组件
         * @param vm
         */
        initDelete(vm) {
            this.vmDelete = vm;
        },
        /**
         * 注销删除组件
         */
        uninitDelete() {
            this.vmDelete = null;
        },
        /**
         * 渲染新增按钮
         * @return 新增按钮VNode
         */
        renderAdd() {
            if (!this.vmAdd) {
                return null;
            }
            return this.$createElement('el-button', {
                props: {
                    plain: this.vmAdd.plain,
                    type: this.vmAdd.type,
                    icon: this.vmAdd.icon
                },
                on: {
                    click: this.add
                }
            }, [this.vmAdd.text]);
        },

        /**
         * 渲染修改按钮
         * @return 修改按钮VNode
         */
        renderEdit() {
            if (!this.vmEdit) {
                return null;
            }
            return this.$createElement('el-button', {
                props: {
                    plain: this.vmEdit.plain,
                    type: this.vmEdit.type,
                    icon: this.vmEdit.icon,
                    disabled: this.vmEdit.disabled || !this.rowSelected
                },
                on: {
                    click: () => {
                        this.edit();
                    }
                }
            }, [this.vmEdit.text]);
        },
        /**
         * 渲染删除按钮
         * @return 删除按钮VNode
         */
        renderDelete() {
            if (!this.vmDelete) {
                return null;
            }
            return this.$createElement('el-button', {
                props: {
                    plain: this.vmDelete.plain,
                    type: this.vmDelete.type,
                    icon: this.vmDelete.icon,
                    disabled: this.vmDelete.disabled || (!this.rowSelected && this.rowChecked.length === 0)
                },
                on: {
                    click: () => {
                        this.del();
                    }
                }
            }, [this.vmDelete.text]);
        },
        /**
         * 点击添加按钮
         * @return {Promise<void>}
         */
        async add() {
            this.showForm('add');
        },
        async edit(row = null) {
            if (row) {
                this.setRowSelected(row);
            }
            if (!this.rowSelected) {
                return;
            }
            this.showForm('edit');
        },
        /**
         * 单击删除按钮
         * @param {Object} row 指定删除的数据
         */
        del(row = null) {
            let checked = [];
            if (row) {
                checked = [row];
            }
            else {
                // 选中数据 优先级 复选 > 单选
                checked = this.rowChecked.length === 0 ? (this.rowSelected ? [this.rowSelected] : []) : this.rowChecked;
            }

            // 如果没有待删除数据，则跳出
            if (checked.length === 0) {
                return;
            }

            // 执行删除迭代
            runDelete(this, checked);
        }
    }
};
