<template>
    <div id="app">
        <ex-crud :loader="loader" ref="crud" :init-model="initModel" :submit="submitModel" :delete="deleteMethod"
                 @deleted="finish">
            <ex-crud-add/>
            <ex-crud-edit/>
            <ex-crud-delete/>

            <ex-crud-search v-model="params">
                <el-form-item label="名称">
                    <el-input v-model="params.name" clearable/>
                </el-form-item>
                <template slot="more">
                    <el-form-item label="类型">
                        <el-select v-model="params.type" clearable>
                            <el-option label="测试1" value="1"/>
                            <el-option label="测试2" value="2"/>
                        </el-select>
                    </el-form-item>
                </template>
            </ex-crud-search>

            <ex-crud-table :columns="columns" :enums="enums">
                <template #operator="{}">
                    <el-link>测试</el-link>
                </template>
            </ex-crud-table>

            <ex-crud-pagination/>

            <ex-crud-form v-if="form" :model="form" size="400px">
                <el-form-item label="名称" prop="name" :rules="{required: true, message: '必填项'}">
                    <el-input v-model="form.name"/>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="form.sex">
                        <el-option v-for="item in enums.sex"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </ex-crud-form>
        </ex-crud>
    </div>

</template>

<script>
    export default {
        components: {},
        data() {
            return {
                params: {
                    name: '',
                    sn: '',
                    type: ''
                },
                enums: {
                    sex: [
                        { label: '男', value: 0 },
                        { label: '女', value: 1 }
                    ]
                },
                columns: [
                    { type: 'selection', fixed: true },
                    { type: 'index', label: '序号', fixed: true },
                    { label: '名称', width: 120, prop: 'name', fixed: true },
                    { label: '性别', width: 80, prop: 'sex', type: 'enum', format: 'sex' },
                    { label: '日期', prop: 'date', type: 'date', format: 'YYYY-MM-DD' },
                    { label: '时间戳', prop: 'unix', type: 'unix', format: 'YYYY-MM-DD' },
                    { label: '排序', prop: 'order' },
                    { label: '状态', prop: 'status', type: 'bool' },
                    { label: '操作', prop: 'operator', cell: 'operator' }
                ],
                form: null
            }
        },
        methods: {
            finish() {
                alert('ok');
            },
            loader({ index, size, params }) {
                return new Promise((resolve) => {
                    window.setTimeout(() => {
                        resolve({
                            total: 100, rows: Array.from({ length: size }).map((_, i) => {
                                return {
                                    name: `name${i}`,
                                    sex: i % 2,
                                    date: new Date().getTime(),
                                    unix: new Date().getTime() / 1000,
                                    order: i,
                                    status: i % 2
                                }
                            })
                        });
                    }, 2000);
                });
            },
            * deleteMethod(rows) {
                yield async () => {
                    try {
                        await this.$confirm('是否删除', '确认', { type: 'danger' });
                    }
                    finally {
                    }
                };
                yield async () => {
                    console.info(rows);
                };
                yield 'render';
            },
            async initModel(model, action) {
                this.form = {
                    name: '',
                    sex: 0,
                    ...model
                };
            },
            async submitModel(model, action) {
                return model
            }
        },
        mounted() {
            this.$refs.crud.query();
        }
    }
</script>

<style lang="scss">
    html, body, #app {
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        border: 0;
    }
</style>
