<style scoped>

</style>

<template>
    <el-table :data="data" border style="width: 100%">
        <el-table-column prop="user_NAME" label="人员" width="80"></el-table-column>
        <el-table-column prop="old_SYSTEM_NAME" label="原系统名" show-overflow-tooltip
                         width="120"></el-table-column>
        <el-table-column prop="system_NAME" label="当前系统名" show-overflow-tooltip
                         width="120"></el-table-column>
        <el-table-column prop="base_INFO_ID" label="任务编码" show-overflow-tooltip width="200">
            <template slot-scope="scope">
                <span v-if="scope.row.base_INFO_ID">{{scope.row.base_INFO_ID}}</span>
                <span v-if="scope.row.work_INFO_ID">{{scope.row.work_INFO_ID}}</span>
                <span v-if="scope.row.tech_INFO_ID">{{scope.row.tech_INFO_ID}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="end_DATE" show-overflow-tooltip
                         label="完成日期" width="120"></el-table-column>
        <el-table-column prop="old_RESPONSIBLE_MODULE" label="原负责模块" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="responsible_MODULE" label="当前负责模块" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="facility_NAME" label="难易度" show-overflow-tooltip
                         width="70"></el-table-column>
        <el-table-column prop="required_TIME" label="预计用时（小时）" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="actual_TIME" label="实际用时（小时）" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>

    </el-table>
</template>

<script>
    export default {
        props:["data"],
        data(){
            return {

            }
        },
        computed: {

        }
    }
</script>