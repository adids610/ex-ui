import { merge } from 'lodash';
// 默认配置
import DEFAULT from './options';

// 消息
import message, { Message } from './prototype/message';

// 批量引入组件
const files = require.context('../packages', true, /\.\/[^/]+\/index\.js$/);

// 组件列表
const modules = files.keys().map((key) => {
    return files(key).default;
});

const install = (Vue, opts = {}) => {
    Vue.prototype.$exOptions = merge(DEFAULT, opts);
    Vue.use(message);
    modules.forEach((m) => {
        Vue.use(m);
    });
};

export default {
    install,
    ...modules
};

export { Message };
