<style scoped>

</style>

<template>
    <div>
    <el-dialog title="编辑拆分任务人员" :visible="changeInset.splitaddvisible" width="60%"
               append-to-body modal-append-to-body :before-close="closeDialog">
        <el-form label-width="100px">
            <el-form-item label="任务编码">
                {{changeInset.taskcode}}
            </el-form-item>
            <el-form-item label="系统名" v-if="changeInset.system_NAME">
                <el-col :span="24">
                    {{changeInset.system_NAME?'开发任务':'测试任务'}}
                    <el-select style="margin-left: 20px;" v-model="changeInset.choosesystem" filterable
                               placeholder="请选择" >
                        <el-option v-for="(item, index) in changeInset.allsystem" :label="item.system_NAME" :key="index"
                                   clearable :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="人员">
                {{changeInset.person}}
            </el-form-item>
            <el-form-item label="完成日期">
                <el-date-picker type="date" placeholder="选择日期" v-model="changeInset.finishdate"
                                style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="负责模块">
                <el-input v-model="changeInset.model" placeholder="请输入负责模块"></el-input>
            </el-form-item>
            <el-form-item label="难易度" v-if="changeInset.system_NAME">
                <el-select v-model="changeInset.levelchoosen" placeholder="请选择难易度" filterable
                           style="width: 100%">
                    <el-option v-for="(item, index) in changeInset.level" :label="item.FACILITY_NAME" :key="index"
                               :value="item.FACILITY_ID+'-'+item.FACILITY_NAME"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预计用时">
                <el-col :span="24">
                    <el-input v-model="changeInset.usetime" placeholder="请输入现预计用时（小时）"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="原实际用时">
                <el-col :span="24">
                    <el-input v-model="changeInset.truetime" placeholder="请输入预计用时（小时）"></el-input>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="changeInset.splitaddvisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="changeInsetPersonSub" size="mini">确定</el-button>
        </div>
    </el-dialog>

    <div class="table-list">
        <el-table :data="changeInset.tableData" border style="width: 100%">
            <el-table-column prop="user_NAME" label="人员"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="system_NAME" label="系统名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="base_INFO_ID" label="任务编码" show-overflow-tooltip width="200">
                <template slot-scope="scope">
                    <span v-if="scope.row.base_INFO_ID">{{scope.row.base_INFO_ID}}</span>
                    <span v-if="scope.row.work_INFO_ID">{{scope.row.work_INFO_ID}}</span>
                    <span v-if="scope.row.tech_INFO_ID">{{scope.row.tech_INFO_ID}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="end_DATE" :formatter="changeInsetMatter" label="完成日期" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="responsible_MODULE" label="负责模块" show-overflow-tooltip></el-table-column>
            <el-table-column prop="facility_NAME" label="难易度" show-overflow-tooltip></el-table-column>
            <el-table-column prop="required_TIME" label="原预计用时（小时）" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="old_REQUIRED_TIME" label="现预计用时（小时）" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="work_TIME" label="原实际用时（小时）" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="old_ACTUAL_TIME" label="现实际用时（小时）" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="actual_TIME" label="总工时" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" v-if="scope.row.state_ID !=319"
                               @click="editChangeInset(scope.$index, scope.row)">编辑
                    </el-button>
                    <span v-if="scope.row.state_ID ==319" style="color: red">已完成任务</span>
                </template>
            </el-table-column>
        </el-table>
        <div style="text-align: center;margin-top: 20px;">
            <el-button style="float: none" type="primary" size="mini" @click="subChangeInset">确认变更</el-button>
        </div>
    </div>
    </div>
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
