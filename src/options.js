import { get } from 'lodash';

import Vue from 'vue';

export default {
    global: {
        message: {
            type: 'message',
            option: { showClose: true }
        }
    },
    dialog: {
        width: '50%'
    },
    drawer: {
        size: '30%'
    },
    talbe: {},
    crud: {
        loaderFormat: null, // 查询数据结构统一转换，(res)=> {retrun {total: res.total, rows: res.rows};}
        beginWith0: false, // 数据加载时，页码是否从0开始
        pagination: {
            pageSize: 20,
            pageSizes: [20, 50, 100, 200],
            layout: 'total, sizes, prev, pager, next, jumper'
        },
        export: {
            type: 'primary',
            plain: true,
            text: '导出',
            icon: 'fa fa-download'
        },
        table: {},
        search: {
            popSize: '',
            labelWidth: '90px',
            button: {
                type: 'primary',
                plain: false,
                text: '查询',
                icon: 'fa fa-search'
            },
            more: {
                type: 'primary',
                plain: true,
                text: '高级筛选',
                icon: 'fa fa-filter'
            },
            confirm: {
                type: 'primary',
                plain: false,
                text: '确定'
            },
            cancel: {
                type: '',
                plain: false,
                text: '取消'
            }
        },
        add: {
            type: 'primary',
            plain: false,
            text: '添加',
            icon: 'fa fa-plus'
        },
        edit: {
            type: 'primary',
            plain: true,
            text: '修改',
            icon: 'fa fa-pencil'
        },
        delete: {
            type: 'primary',
            plain: true,
            text: '删除',
            icon: 'fa fa-trash'
        },
        form: {
            position: 'center',
            labelWidth: '90px',
            labelPosition: 'right',
            labelSuffix: '',
            confirm: {
                type: 'primary',
                plain: false,
                text: '确定'
            },
            cancel: {
                type: '',
                plain: false,
                text: '取消'
            }
        }
    }
};

/**
 * 创建vue组件props 默认值方法
 * @param {String} field 配置属性路径
 * @param value 默认值
 * @retun {Function} 默认值方法
 */
export const propsDefault = (field, value) => {
    return () => {
        return optionValue(field, value);
    }
};

/**
 * 获得默认配置
 * @param {String} field 配置属性路径
 * @param value 默认值
 * @retun 配置
 */
export const optionValue = (field, value) => {
    return get(Vue.prototype.$exOptions, field, value);
};

/**
 * vue 默认配置mixin
 */
export const mixinOption = {
    filters: {
        optionValue(v, dv) {
            return optionValue(v, dv);
        }
    }
};
