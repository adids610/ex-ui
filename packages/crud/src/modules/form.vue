<template>
    <component :is="cmp.type" :direction="cmp.direction" :visible.sync="popupVisible"
               :size="size" :width="size" :title="title" append-to-body :show-close="!submiting"
               :close-on-click-modal="false" :close-on-press-escape="false" custom-class="ex-crud-form-popup"
               v-bind="$attrs">

        <el-form class="ex-crud-form" :label-width="labelWidth" :label-position="labelPosition"
                 :label-suffix="labelSuffix" :rules="rules" :model="model" ref="form">
            <slot></slot>
        </el-form>

        <template slot="footer">
            <el-button :type="'crud.form.cancel.type' | optionValue('')"
                       :plain="'crud.form.cancel.plain' | optionValue(false)"
                       @click="popupVisible = false" :disabled="submiting">
                {{ 'crud.form.cancel.text' | optionValue('取消') }}
            </el-button>
            <el-button :type="'crud.form.confirm.type' | optionValue('primary')"
                       :plain="'crud.form.confirm.plain' | optionValue(false)"
                       @click="submitForm" :loading="submiting">
                {{ 'crud.form.confirm.text' | optionValue('确定') }}
            </el-button>
        </template>
    </component>
</template>
<script>
    import { propsDefault, mixinOption, optionValue } from '../../../../src/options';
    import ExDrawer from '../../../drawer/src';
    import { cloneDeep } from 'lodash';

    export default {
        name: 'ExCrudForm',
        mixins: [mixinOption],
        components: { ExDrawer },
        inheritAttrs: false,
        inject: {
            CRUD: {
                from: 'CRUD',
                default: {}
            },
            INIT_FORM: {
                from: 'INIT_FORM',
                default: null
            },
            UNINIT_FORM: {
                from: 'UNINIT_FORM',
                default: null
            },
            SUBMIT_FORM: {
                from: 'SUBMIT_FORM',
                default: null
            }
        },
        props: {
            // 表单数据
            model: {
                type: Object, required: true,
                default() {
                    return {};
                }
            },
            position: {
                type: String, default: propsDefault('crud.form.position', '')
            },
            size: {
                type: String, default: propsDefault('crud.form.size', '')
            },
            labelWidth: {
                type: String, default: propsDefault('crud.form.labelWidth', '90px')
            },
            labelPosition: {
                type: String, default: propsDefault('crud.form.labelPosition', 'right')
            },
            labelSuffix: {
                type: String, default: propsDefault('crud.form.labelSuffix', '')
            },
            rules: { default: null }
        },
        data() {
            return {
                store: null,
                popupVisible: false,
                submiting: false
            }
        },
        computed: {
            cmp() {
                if (this.position === 'left') {
                    return { type: 'ex-drawer', direction: 'ltr' };
                }
                else if (this.position === 'top') {
                    return { type: 'ex-drawer', direction: 'ttb' };
                }
                else if (this.position === 'right') {
                    return { type: 'ex-drawer', direction: 'rtl' };
                }
                else if (this.position === 'bottom') {
                    return { type: 'ex-drawer', direction: 'btt' };
                }
                else {
                    return { type: 'ex-dialog', direction: '' };
                }
            },
            title() {
                if (this.CRUD.action === 'add') {
                    return optionValue('crud.add.text', '添加') + this.CRUD.name;
                }
                else if (this.CRUD.action === 'edit') {
                    return optionValue('crud.edit.text', '修改') + this.CRUD.name;
                }
                else {
                    return ''
                }
            }
        },
        watch: {
            popupVisible(v) {
                // 打开弹框时，清空验证
                if (v && this.$refs.form) {
                    this.$refs.form.clearValidate();
                }
            }
        },
        methods: {
            /**
             * 显示表单
             */
            showForm() {
                this.popupVisible = true;
                this.submiting = false;
            },

            async submitForm() {
                this.submiting = true;
                try {
                    await this.$refs.form.validate();
                }
                catch (e) {
                    return;
                }
                finally {
                    this.submiting = false;
                }

                try {
                    this.submiting = true;
                    typeof this.SUBMIT_FORM === 'function' && await this.SUBMIT_FORM(cloneDeep(this.model));
                    this.popupVisible = false;
                }
                catch (e) {
                    console.error(e);
                    this.$msg({ type: 'error', message: `保存失败：${typeof e === 'object' ? e.message : e}` });
                }
                finally {
                    this.submiting = false
                }
            }
        },
        beforeMount() {
            // 向crud中注册组件
            typeof this.INIT_FORM === 'function' && this.INIT_FORM(this);
        },
        beforeDestroy() {
            // 向crud中注销组件
            typeof this.UNINIT_FORM === 'function' && this.UNINIT_FORM();
        }
    }
</script>
