<template>
    <el-drawer ref="drawer" :visible.sync="vis" :wrapper-closable="closeOnClickModal" :size="size"
               :custom-class="'ex-drawer ' + ($attrs.customClass || $attrs['custom-class'] || '')"
               v-bind="$attrs" v-on="$listeners">
        <span slot="title">
            <!--隐藏el-drawer自动获得焦点-->
            <input type="text" class="hide-auto-focus"/>
            <slot name="title">{{ $attrs.title }}</slot>
        </span>
        <section class="ex-drawer__body">
            <!--隐藏el-drawer自动获得焦点-->
            <input type="text" class="hide-auto-focus"/>
            <slot></slot>
        </section>
        <footer class="ex-drawer__footer" v-if="$slots.footer">
            <slot name="footer"></slot>
        </footer>
    </el-drawer>
</template>

<script>
    import { propsDefault } from '../../../src/options';

    export default {
        name: 'ExDrawer',
        inheritAttrs: false,
        props: {
            visible: { type: Boolean, default: false },
            closeOnClickModal: { type: Boolean, default: true },
            size: { type: [Number, String], default: propsDefault('drawer.size', '30%') }
        },
        data() {
            return {
                vis: false
            }
        },
        watch: {
            visible: {
                immediate: true,
                handler(v) {
                    this.vis = v;
                }
            },
            vis(v) {
                if (v) {
                    document.activeElement && document.activeElement.blur();
                }
                this.$emit('update:visible', v);
            }
        },
        methods: {
            // removeFocus() {
            //     document.activeElement.blur();
            // }
            // 公开el-drawer方法
            closeDrawer() {
                this.$refs.drawer.closeDrawer();
            }
        }
    }
</script>
