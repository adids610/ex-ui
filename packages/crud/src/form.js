/**
 * 表单
 */
import { cloneDeep } from 'lodash';

export default {
    template: '',
    provide() {
        return {
            INIT_FORM: this.initForm,
            UNINIT_FROM: this.uninitForm,
            SUBMIT_FORM: this.submitForm
        };
    },
    data() {
        return {
            vmForm: null,
            action: ''
        };
    },
    methods: {
        /**
         * 注册表单组件
         * @param vm
         */
        initForm(vm) {
            this.vmForm = vm;
        },
        /**
         * 注销表单组件
         */
        uninitForm() {
            this.vmForm = null;
        },
        /**
         * 提交表单
         * @param model 表单数据
         */
        async submitForm(model) {
            const result = await this.submit(model, this.action);

            // 返回false跳出，自行控制数据更新
            if (result === false) {
                return;
            }
            this.$msg({ type: 'success', message: '保存成功。' });
            // 返回true调用刷新方法
            if (result === true) {
                this.refresh();
            }
            // 本地更新数据
            else if (this.action === 'edit') {
                const index = this.rows.indexOf(this.rowSelected);
                index > -1 && this.rows.splice(index, 1, result);
            }
            else if (this.action === 'add') {
                this.rows.splice(0, 0, result);
                this.total += 1;
            }

            this.$emit('saved', result, this.action);
        },
        /**
         * 显示表单
         * @param {String} action 操作方式【add、edit】
         */
        async showForm(action) {
            // 记录操作方式
            this.action = action;
            this.loading = true;
            try {
                // 调用添加数据初始化
                const flag = await this.initModel(this.action === 'add' ? {} : cloneDeep(this.rowSelected), this.action);
                if (flag === false) {
                    return;
                }
                this.vmForm.showForm();
            }
            catch (e) {
                console.error(e);
                this.$msg({ type: 'error', message: `数据加载失败：${typeof e === 'object' ? e.message : e}` });
            }
            finally {
                this.loading = false;
            }
        }
    }
};
