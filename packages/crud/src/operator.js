/**
 * 新增删除修改
 */
import { cloneDeep } from 'lodash';

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
    computed: {
        addDisabled() {
            if (!this.vmAdd) {
                return false;
            }
            return typeof this.vmAdd.disabled === 'function' ? this.vmAdd.disabled(this.rowSelected) : this.vmAdd.disabled;
        },
        editDisabled() {
            if (!this.vmEdit) {
                return false;
            }
            if (!this.rowSelected) {
                return true;
            }
            return typeof this.vmEdit.disabled === 'function' ? this.vmEdit.disabled(this.rowSelected) : this.vmEdit.disabled;
        },
        deleteDisabled() {
            if (!this.vmDelete) {
                return false;
            }
            if (!this.rowSelected && this.rowChecked.length === 0) {
                return true;
            }
            return typeof this.vmDelete.disabled === 'function' ? this.vmDelete.disabled(this.rowSelected, this.rowChecked) : this.vmDelete.disabled;
        }
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
                    icon: this.vmAdd.icon,
                    disabled: this.addDisabled
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
                    disabled: this.editDisabled
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
                    disabled: this.deleteDisabled
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
         * @param {Object | Array} row 指定删除的数据
         */
        async del(row = null) {
            let checked = [];
            if (row) {
                checked = Array.isArray(row) ? row : [row];
            }
            else {
                // 选中数据 优先级 复选 > 单选
                checked = this.rowChecked.length === 0 ? (this.rowSelected ? [this.rowSelected] : []) : this.rowChecked;
            }

            // 如果没有待删除数据，则跳出
            if (checked.length === 0) {
                return;
            }

            let result = false;

            if (this.deleteRewrite) {
                try {
                    result = await this.delete(cloneDeep(checked));
                }
                catch (e) {
                    return;
                }
            }
            else {
                // 二次确认
                try {
                    await this.$confirm(`此操作将删除${checked.length === 1 ? '此' : checked.length}行数据, 是否继续`, '提示', {
                        type: 'danger'
                    })
                }
                catch (e) {
                    return;
                }

                try {
                    this.loading = true;
                    result = await this.delete(cloneDeep(checked));
                    this.$msg({ type: 'success', message: '删除成功。' });
                }
                catch (e) {
                    console.error(e);
                    this.$msg({ type: 'error', message: `删除失败：${typeof e === 'object' ? e.message : e}` });
                    return;
                }
                finally {
                    this.loading = false;
                }
            }

            // 返回false跳出，自行控制数据更新
            if (result === false) {
                return;
            }

            // 返回true调用刷新方法
            if (result === true) {
                this.refresh();
            }
            // 默认移除选中行，本地更新数据
            else {
                checked.forEach((c) => {
                    const index = this.rows.indexOf(c);
                    if (index > -1) {
                        this.rows.splice(index, 1);
                        this.total -= 1;
                    }
                });
                // 本页被全部删除，退回上一页
                if (this.rows.length === 0) {
                    this.currentPageChange(Math.max(1, this.currentPage - 1));
                }
            }
            this.$emit('deleted');
        }
    }
};
