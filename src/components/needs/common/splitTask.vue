<style scoped>

</style>

<template>
    <div class="table-list">
        <el-table :data="data" height="280" border style="width: 100%">
            <el-table-column prop="user_NAME" label="人员" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column label="任务类型" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div style="text-align: center">
                        <span v-if="!scope.row.system_NAME && scope.row.user_NAME != '合计'">测试任务</span>
                        <span v-if="scope.row.system_NAME && scope.row.user_NAME != '合计'">开发任务</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="system_NAME" label="系统名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="base_INFO_ID" label="任务编码" width="190" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.base_INFO_ID">{{scope.row.base_INFO_ID}}</span>
                    <span v-if="scope.row.work_INFO_ID">{{scope.row.work_INFO_ID}}</span>
                    <span v-if="scope.row.tech_INFO_ID">{{scope.row.tech_INFO_ID}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="end_DATE" :formatter="splitDataFormatter"
                             show-overflow-tooltip label="完成日期"></el-table-column>
            <el-table-column prop="responsible_MODULE" label="负责模块" show-overflow-tooltip></el-table-column>
            <el-table-column prop="facility_NAME" label="难易度" width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="old_REQUIRED_TIME" label="原预计用时（小时）" width="100"></el-table-column>
            <el-table-column prop="required_TIME" label="现预计用时（小时）" width="100"></el-table-column>
            <el-table-column prop="old_ACTUAL_TIME" label="原实际用时（小时）" width="100"></el-table-column>
            <el-table-column prop="work_TIME" label="现实际用时（小时）" width="100"></el-table-column>
            <el-table-column prop="actual_TIME" label="总工时" width="100"></el-table-column>
            <el-table-column prop="test_RESULT" label="完成结果" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="fail_REAMRK" label="超时原因" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" width="120" show-overflow-tooltip>
                <template slot-scope="scope">

                    <div v-if="tabs.state_ID != 320">
                        <span v-if="scope.row.sign == 0" style="color: red">已挂起</span>
                        <span v-if="scope.row.state_ID ==307 && scope.row.sign == 1" style="color: red">开发中</span>
                        <span v-if="scope.row.state_ID ==309 && scope.row.sign == 1" style="color: red">测试中</span>
                        <span v-if="scope.row.state_ID ==319  && scope.row.sign == 1" style="color: green">已完成</span>
                        <span v-if="scope.row.state_ID == 319 && scope.row.sign == 2" style="color: red">已转接</span>
                        <span v-if="scope.row.state_ID == 321" style="color: red">已需求内变更</span>
                    </div>
                    <span v-if="tabs.state_ID == 320" style="color: red">已新建变更</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        props:["data","tabs"],
        data(){
            return {

            }
        },
        methods: {
            splitDataFormatter(row, col){
                if(row.end_DATE){
                    let date = this.$format(row.end_DATE);
                    return `${date.year}-${date.mouth}-${date.day}`
                }
            },
        }
    }
</script>