import { optionValue } from '../options';

export default {
    install: (Vue) => {
        Vue.prototype.$msg = (opt) => {
            let type = optionValue('global.message.type', 'message');
            const option = optionValue('global.message.option', {});

            if (typeof Vue.prototype['$' + type] !== 'function') {
                type = 'message';
            }

            opt = { ...option, ...opt };

            if (!opt.title) {
                switch (opt.type) {
                    case 'success':
                        opt.title = '成功';
                        break;
                    case 'error':
                        opt.title = '错误';
                        break;
                    case 'warning':
                        opt.title = '警告';
                        break;
                    case 'info':
                        opt.title = '消息';
                        break;
                    default:
                        opt.title = '提示';
                        break;
                }
            }

            Vue.prototype['$' + type](opt);
        }
    }
};
