<style scoped>
.el-form-item{
    margin: 0;
}
</style>

<template>
    <el-form label-width="120px">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="分析结果">{{data.ANALYSIS_RESULT}}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="分析时间">{{data.ANALYSIS_TIME | date_y_m_d}}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label=" 预期开始时间">{{data.EXPECT_START | date_y_m_d}}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label=" 预期结束时间">{{data.EXPECT_END | date_y_m_d}}</el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label=" 风险点">{{data.TASK_RISK}}</el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
    export default {
        props:["data"],
        data(){
            return {}
        },
        methods: {

        },
        filters: {
            date(time) {
                let d = new Date(time);
                let year = d.getFullYear();
                let month = (d.getMonth() + 1)<10?'0' + (d.getMonth()+1) : '' + d.getMonth()+ 1;
                let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
                let hour = d.getHours()< 10 ? '0' + d.getHours() : '' + d.getHours();
                let minutes = d.getMinutes() <10 ? '0' + d.getMinutes() : '' + d.getMinutes();
                let seconds = d.getSeconds() <10 ? '0' + d.getSeconds() : '' + d.getSeconds();
                return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
            },
            date_y_m_d(time){
                let d = new Date(time);
                let year = d.getFullYear();
                let month = (d.getMonth() + 1)<10?'0' + (d.getMonth()+1) : '' + d.getMonth()+ 1;
                let day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate();
                return year + '-' + month + '-' + day
            }
        },
    }
</script>