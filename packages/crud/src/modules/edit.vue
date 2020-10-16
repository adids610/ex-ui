<script>
    import { propsDefault } from '../../../../src/options';

    export default {
        name: 'ExCrudEdit',
        render() {
            return null;
        },
        props: {
            type: { type: String, default: propsDefault('crud.edit.type', 'primary') },
            plain: { type: Boolean, default: propsDefault('crud.edit.plain', true) },
            text: { type: String, default: propsDefault('crud.edit.text', '修改') },
            icon: { type: String, default: propsDefault('crud.edit.icon', '') },
            disabled: { type: [Function, Boolean], default: false }
        },
        inject: {
            INIT_EDIT: {
                from: 'INIT_EDIT',
                default: null
            },
            UNINIT_EDIT: {
                from: 'UNINIT_EDIT',
                default: null
            }
        },
        beforeMount() {
            // 向crud中注册组件
            typeof this.INIT_EDIT === 'function' && this.INIT_EDIT(this);
        },
        beforeDestroy() {
            // 向crud中注销组件
            typeof this.UNINIT_EDIT === 'function' && this.UNINIT_EDIT();
        }
    }
</script>
