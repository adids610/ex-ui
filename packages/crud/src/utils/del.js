import { isGenerator } from './index';

/**
 * 删除确认
 * @param vm crud实例
 * @param {Array} checked 删除的数据
 * @return {Promise<*>}
 */
async function confirm(vm, checked) {
    return await vm.$confirm(`此操作将删除${checked.length === 1 ? '此' : checked.length}行数据, 是否继续`, '提示', {
        type: 'danger'
    });
};

/**
 * 请求执行删除操作（数据请求）
 * @param vm crud实例
 * @param {Array} checked 删除的数据
 * @return {Promise<void>}
 */
async function request(vm, checked) {
    vm.loading = true;
    const result = await vm.delete(checked);
    vm.loading = false;
    return result;
};

/**
 * 调用数据刷新操作
 * @param vm crud实例
 * @return {Promise<void>}
 */
async function refresh(vm) {
    vm.refresh();
};

/**
 * 删除操作执行完成
 * @param vm crud实例
 * @return {Promise<void>}
 */
async function complete(vm) {
    vm.$emit('deleted');
};

/**
 * 本地删除后数据渲染
 * @param vm crud实例
 * @param checked 删除的数据
 * @return {Promise<void>}
 */
async function render(vm, checked) {
    // 从实例数据中移除数据
    checked.forEach((c) => {
        const index = vm.rows.indexOf(c);
        index > -1 && vm.rows.splice(index, 1);
    });
    // 本页被全部删除，退回上一页
    if (vm.rows.length === 0) {
        vm.currentPageChange(Math.max(1, vm.currentPage - 1));
    }
};

/**
 * 判断vm.delete 是否为一个生成函数，如果不是，结合内部 二次确认和更新等函数转换生成函数
 * @param vm crud实例
 * @return function(): Generator<Promise<*>|Promise<boolean>|Promise<void>, undefined, ?>
 */
const genDelete = (vm) => {
    if (isGenerator(vm.delete)) {
        return vm.delete;
    }
    return function * (checked) {
        try {
            yield confirm(vm, checked);
        }
        catch (e) {
            return;
        }
        try {
            const result = yield request(vm, checked);
            if (result === false) {
                return;
            }
            vm.$msg({ type: 'success', message: '删除成功。' });
            // 返回true调用刷新方法
            if (result === true) {
                yield refresh(vm);
            }
            // 默认移除选中行，本地更新数据
            else {
                yield render(vm, checked);
            }
            yield complete(vm);
        }
        catch (e) {
            vm.loading = false;
            console.error(e);
            vm.$msg({ type: 'error', message: `删除失败：${typeof e === 'object' ? e.message : e}` });
        }
    };
};

/**
 * 转换Promise
 * @param {Promise|Function|String } fn
 * @param vm crud 示例
 * @param checked 需要删除的数据
 * @return {Promise|Promise<unknown>|Promise<void>|Promise<*>}
 */
const toPromise = (fn, vm, checked) => {
    // 如果已经是 Promise，直接返回
    if (fn instanceof Promise) {
        return fn;
    }
    // 如果是function，转换成Promise
    else if (typeof fn === 'function') {
        return new Promise((resolve, reject) => {
            try {
                resolve(fn());
            }
            catch (e) {
                reject(e);
            }
        });
    }
    // 调用内置二次全确认
    else if (fn === 'confirm') {
        return confirm(vm, checked);
    }
    // 调用内部远端刷新
    else if (fn === 'refresh') {
        return refresh(vm);
    }
    // 调用本地渲染数据方法
    else if (fn === 'render') {
        return render(vm, checked);
    }
    // 调用内部删除完成
    else if (fn === 'complete') {
        return complete(vm);
    }
    // 其他格式转换出错
    else {
        return new Promise((resolve, reject) => {
            reject(new Error('程序运行错误，yield 数据不正确。'));
        });
    }
};

/**
 * 自动执行删除迭代
 * @param vm crud实例
 * @param {Array} checked 删除数据
 */
export const runDelete = (vm, checked) => {
    const run = (ite) => {
        // 迭代完成，跳出
        if (ite.done) {
            return;
        }
        // 转换promise
        const prms = toPromise(ite.value, vm, checked);
        prms.then((r) => {
            // 执行下一个迭代
            run(gen.next(r));
        }).catch((e) => {
            // 抛出异常
            gen.throw(e);
        });
    };

    // 获得删除生成函数，调用获得迭代器
    const gen = genDelete(vm)(checked);

    // 执行迭代
    run(gen.next());
};
