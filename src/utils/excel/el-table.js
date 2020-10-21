import { get } from 'lodash';
import XLSX from 'xlsx-populate';

/**
 * sheet单元格类
 */
class Cell {
    constructor(text, style) {
        this.text = text;
        this.style = style || {};
    }
}

/**
 * 获得列对齐方式
 * @param {Object} col 列定义
 * @param {Boolean} header 是否为表头
 * @return {string}
 */
const getColAlign = (col, header = false) => {
    const v = (header ? (col.headerAlign || col.align) : col.align) || 'left';
    return v.replace('is-', '');
};

/** 计算标头excel数据
 *  @param {Array} originCols 原始列数据
 *  @param {Array} cols 数据列
 *  @return {Object} {data, merge}
 */
const getHeaderRows = (originCols, cols) => {
    let rowCount = 0; // 标头行数
    const colData = [];

    // 计算表头行数，汇总单元格数据
    const findCol = (cls, list, deepth) => {
        cls.forEach((c) => {
            const cinfo = {
                label: c.label, children: [], colSpan: 0, lv: deepth, align: getColAlign(c, true)
            };
            // 递归子列
            if (c.children) {
                findCol(c.children, cinfo.children, deepth + 1);
                // 合计列合并
                cinfo.colSpan = cinfo.children.reduce((total, { colSpan }) => {
                    return total + colSpan;
                }, 0);
                cinfo.align = 'center';
            }
            else if (cols.indexOf(c) > -1) {
                // 为数据列，列合并为1
                cinfo.colSpan = 1;
            }

            if (cinfo.colSpan > 0) {
                list.push(cinfo);
                rowCount = Math.max(rowCount, cinfo.lv + 1);
            }
        });
    }

    findCol(originCols, colData, 0);

    // 初始化表头数据矩阵
    const data = Array.from({ length: rowCount }).map(() => {
        return [];
    });
    // 单元格合并
    const merge = [];

    // 填充数据
    const fillCell = (cls) => {
        cls.forEach((c) => {
            const { lv, label, children, colSpan } = c;
            const rowSpan = children.length === 0 ? (rowCount - lv) : 1;
            // 单元格合并
            if (rowSpan > 1 || colSpan > 1) {
                merge.push({
                    s: { r: lv, c: data[lv].length },
                    e: { r: lv + rowSpan - 1, c: data[lv].length + colSpan - 1 }
                });
            }
            for (let i = lv; i < lv + rowSpan; i++) {
                for (let j = 0; j < colSpan; j++) {
                    data[i].push(new Cell(label, { horizontalAlignment: c.align }));
                }
            }
            fillCell(children);
        });
    };

    fillCell(colData);

    return { data, merge };
};

/**
 * 获取单元格数据
 * @param {Object} row 行数据
 * @param {Object} col 列数据
 * @param {Number} index 序号
 * @return
 */
const getCellValue = (row, col, index) => {
    let value = null;
    if (col.property) {
        value = get(row, col.property);
    }

    if (col.type === 'index') {
        value = typeof col.index === 'function' ? col.index(index) : (index + 1);
    }
    else if (typeof col.formatter === 'function') {
        value = col.formatter(row, col, value, index);
    }

    return value;
}

/**
 * 导出excel
 * @param {Object} vm el-table实例
 * @param {String} fileName 文件名
 * @param {Array} rows 导出行数据
 */
export const exportExcel = async (vm, fileName, rows) => {
    const states = vm.store.states;
    const cols = states.columns.filter((c) => {
        return c.type !== 'expand' && c.type !== 'selection';
    })
    const { data, merge } = getHeaderRows(states.originColumns, cols);

    let allRows = [];
    // 树表处理参数
    const treeOpt = { indents: [], indentCol: null };

    if (vm.treeProps && vm.treeProps.children) {
        treeOpt.indentCol = cols.find((c) => {
            return c.type !== 'index';
        });
        // 树表数据处理
        const proc = (rs, lv) => {
            (rs || []).forEach((r) => {
                allRows.push(r);
                treeOpt.indents.push(lv);
                proc(r[vm.treeProps.children], lv + 1);
            });
        };
        proc(rows || states.data, 0);
    }
    else {
        allRows = rows || states.data;
    }

    allRows.forEach((r, i) => {
        const row = cols.map((c) => {
            const text = getCellValue(r, c, i);
            if (c === treeOpt.indentCol) {
                return new Cell(text, { indent: treeOpt.indents[i] || 0 });
            }
            return text;
        });
        data.push(row);
    });

    // 创建表格
    const book = await XLSX.fromBlankAsync();
    const sheet = book.sheets().length > 0 ? book.sheet(0) : book.addSheet('Sheet1');

    // 列设置
    cols.forEach((c, i) => {
        // 宽度
        sheet.column(i + 1).width((c.width || c.minWidth || 200) / 4);
        // 高度
        sheet.column(i + 1).style({ horizontalAlignment: getColAlign(c) });
    });

    // 数据写入
    data.forEach((r, y) => {
        r.forEach((c, x) => {
            const cell = sheet.cell(y + 1, x + 1);
            let style = { verticalAlignment: 'center', border: 'thin', borderColor: '#000000' };
            if (c instanceof Cell) {
                cell.value(c.text);
                style = { ...style, ...c.style };
            }
            else {
                cell.value(c);
            }
            cell.style(style);
        });
    });

    // 合并单元格
    merge.forEach(({ s, e }) => {
        sheet.range(s.r + 1, s.c + 1, e.r + 1, e.c + 1).merged(true);
    });

    // 下载
    const blob = await book.outputAsync();
    const name = `${fileName || '导出数据'}.xlsx`;
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // IE
        window.navigator.msSaveOrOpenBlob(blob, name);
    }
    else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }
};
