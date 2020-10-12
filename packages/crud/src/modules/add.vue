<script>
    import { propsDefault } from '../../../../src/options';

    export default {
        name: 'ExCrudAdd',
        render() {
            return null;
        },
        props: {
            type: { type: String, default: propsDefault('crud.add.type', 'primary') },
            plain: { type: Boolean, default: propsDefault('crud.add.plain', false) },
            text: { type: String, default: propsDefault('crud.add.text', '添加') },
            icon: { type: String, default: propsDefault('crud.add.icon', '') }
        },
        inject: {
            INIT_ADD: {
                from: 'INIT_ADD',
                default: null
            },
            UNINIT_ADD: {
                from: 'UNINIT_ADD',
                default: null
            }
        },
        beforeMount() {
            // 向crud中注册组件
            typeof this.INIT_ADD === 'function' && this.INIT_ADD(this);
        },
        beforeDestroy() {
            // 向crud中注销组件
            typeof this.UNINIT_ADD === 'function' && this.UNINIT_ADD();
        }
    }
</script>
