<script>
    import { propsDefault } from '../../../../src/options';

    export default {
        name: 'ExCrudDelete',
        render() {
            return null;
        },
        props: {
            type: { type: String, default: propsDefault('crud.delete.type', 'primary') },
            plain: { type: Boolean, default: propsDefault('crud.delete.plain', true) },
            text: { type: String, default: propsDefault('crud.delete.text', '删除') },
            icon: { type: String, default: propsDefault('crud.delete.icon', '') },
            disabled: { type: Boolean, default: false }
        },
        inheritAttrs: false,
        inject: {
            INIT_DELETE: {
                from: 'INIT_DELETE',
                default: null
            },
            UNINIT_DELETE: {
                from: 'UNINIT_DELETE',
                default: null
            }
        },
        beforeMount() {
            // 向crud中注册组件
            typeof this.INIT_DELETE === 'function' && this.INIT_DELETE(this);
        },
        beforeDestroy() {
            // 向crud中注销组件
            typeof this.UNINIT_DELETE === 'function' && this.UNINIT_DELETE();
        }
    }
</script>
