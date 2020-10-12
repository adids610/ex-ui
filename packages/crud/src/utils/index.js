/**
 * 判断方法是否为生成器方法
 * @param {Function} fn
 * @return {Boolean}
 */
export const isGenerator = (fn) => {
    return typeof fn === 'function' && fn.constructor && fn.constructor.name === 'GeneratorFunction';
};
