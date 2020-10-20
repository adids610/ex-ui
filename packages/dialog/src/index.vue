<template>
    <el-dialog ref="dialog" :visible.sync="vis" :fullscreen="fullscreen" :top="top" class="ex-dialog__wrap"
               :width="width" :custom-class="'ex-dialog ' + ($attrs.customClass || $attrs['custom-class'] || '')"
               v-bind="$attrs" v-on="$listeners">
        <template slot="title">
            <slot name="title">{{ $attrs.title }}</slot>
        </template>
        <template>
            <slot></slot>
        </template>
        <template slot="footer">
            <slot name="footer"></slot>
        </template>
    </el-dialog>
</template>

<script>
    import { propsDefault } from '../../../src/options';

    export default {
        name: 'ExDialog',
        inheritAttrs: false,
        props: {
            visible: { type: Boolean, default: false },
            top: { type: String, default: '15vh' },
            fullscreen: { type: Boolean, default: false },
            maxHeight: { type: String, default: '80%' },
            width: { type: String, default: propsDefault('dialog.width', '50%') }
        },
        data() {
            return {
                vis: false
            }
        },
        computed: {
            mh() {
                return this.fullscreen ? 'none' : this.maxHeight;
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
            },
            mh: {
                immediate: true, handler(v) {
                    this.$nextTick(() => {
                        if (!this.$refs.dialog && this.$refs.dialog.$el) {
                            return;
                        }
                        const dialog = this.$refs.dialog.$el.querySelector('.ex-dialog');
                        dialog.style.maxHeight = this.mh;
                    });
                }
            }
        },
        methods: {
            // removeFocus() {
            //     document.activeElement.blur();
            // }
        }
    }
</script>
