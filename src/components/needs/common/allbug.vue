<style scoped>

</style>

<template>
    <el-dialog title="BUG清单" :visible="data.allBUGvisible" width="90%"
               append-to-body modal-append-to-body
               :before-close="closeDialog">
        <div class="table-list">
            <el-table :data="data.allBugs" border style="width: 100%">
                <el-table-column label="编号" width="190" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.base_BUG_ID">{{scope.row.base_BUG_ID}}</span>
                        <span v-if="scope.row.work_BUG_ID">{{scope.row.work_BUG_ID}}</span>
                        <span v-if="scope.row.tech_BUG_ID">{{scope.row.tech_BUG_ID}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="start_DATE" label="提交日期" width="110" show-overflow-tooltip></el-table-column>
                <el-table-column prop="start_TIME" label="提交时间" show-overflow-tooltip></el-table-column>
                <el-table-column prop="assignor_NAME" label="提交人" show-overflow-tooltip></el-table-column>
                <el-table-column prop="desired_RESULT" label="预期效果" show-overflow-tooltip></el-table-column>
                <el-table-column prop="problem_DESCRIPTION" label="问题描述" show-overflow-tooltip></el-table-column>
                <el-table-column prop="first_PERSON_NAME" label="指派人" show-overflow-tooltip></el-table-column>
                <el-table-column prop="user_NAME" label="完成人" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" width="160">
                    <template slot-scope="scope">
                        <span v-if="scope.row.bug_STATE == 0" style="color: red">处理中</span>
                        <span v-if="scope.row.bug_STATE == 2" style="color: green">已关闭</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        props:["data"],
        data(){
            return {

            }
        },
        methods: {
            closeDialog(){
                this.data.allBUGvisible = false;
            }
        }
    }
</script>
