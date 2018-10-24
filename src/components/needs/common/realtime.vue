<style>
    .sstabs .el-tabs__nav-scroll{
        background: white!important;
        color: black;
        width: 200px;
        text-align: center;
        float: right;
    }
    .sstabs .el-tabs__active-bar{
        height: 0;
    }
    .sstabs .el-tabs__nav-wrap::after{
        height: 0!important;
    }
</style>

<template>
    <div class="console-tab-content" style="width: 100% !important;height: 250px !important;">
        <template>
            <el-tabs v-model="sstj.activeName" @tab-click="" class="sstabs">
                <el-tab-pane label="周期" name="first">
                    <!--周期-->
                    <el-row :gutter="20">
                        <el-col :span="24" :md="24" >
                            <div id="system" style="width:1000px;height: 200px;margin: 20px 0;"></div>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="工时" name="second">
                    <el-row :gutter="20">
                        <el-col :span="24" :md="24" >
                            <ul style="margin-bottom: 10px">
                                <li v-for="(item, index) in sstj.info" style="width: 30%;display: inline-block" :key="index">
                                    {{item.DEPT_NAME}}总工时:{{item.allTime}}&nbsp;&nbsp;Bug数:{{item.bugCount}}
                                </li>
                            </ul>
                            <div id="workTimes" style="width:1000px;height: 300px;"></div>

                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>

<script>
    export default {
        props:["sstj"],
        data(){
            return {

            }
        },
        mounted(){
            this.realTime(this.sstj);
            this.workTime(this.sstj);
        },
        methods:{
            //实时统计方法
            realTime(data) {
                let echarts = require('echarts');
                let proBar = echarts.init(document.getElementById("system")); //实时统计
                proBar.clear()
                let option = {
                    legend: {
                        data: ['实时统计']
                    },
                    xAxis: {
                        type: 'time'
                    },

                    yAxis: {
                        data: data.yaxis
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function(params) {
                            let res = params[0].name + "</br>"
                            let date0 = new Date(params[0].data);
                            let date1 = new Date(params[1].data);
                            date0 = date0.getFullYear() + "-" + (date0.getMonth() + 1) + "-" + date0.getDate();
                            date1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
                            res += params[0].seriesName + ":" + date0 + "</br>"
                            res += params[1].seriesName + ":" + date1 + "</br>"
                            return res;
                        }
                    },
                    series: [
                        {
                            name: '开始时间',
                            type: 'bar',
                            stack: '开始时间',
                            itemStyle: {
                                normal: {
                                    color: '#778899',
                                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                                }
                            },
                            data: data.startTime
                        }, {
                            name: '结束时间',
                            type: 'bar',
                            stack: '开始时间',
                            itemStyle: {
                                normal: {
                                    color: '#2E91BD',
                                    barBorderRadius: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                                    shadowBlur: 20
                                }
                            },
                            data:data.endTime
                        },
                        {
                            name: '结束时间',
                            type: 'bar',
                            stack: '开始时间',
                            itemStyle: {
                                normal: {
                                    color: '#F4201B',
                                    shadowColor: 'rgba(255, 255, 255, 0.3)',
                                }
                            },
                            data:data.actualTime
                        }
                    ]
                };
                proBar.setOption(option);
            },
            workTime(data){
                let echarts = require('echarts');
                let proBar = echarts.init(document.getElementById("workTimes")); //实时统计
                proBar.clear()
                let option = {
                    title : {
                        text: '工时统计',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series : []
                };
                for(let i=0;i<data.len;i++){
                    let x=i%3-1;
                    if(x==-1){
                        x=2
                    }
                    let y=Math.floor(i/3) ;

                    let addoption={
                        name: data.deptName[i],
                        type: 'pie',
                        radius : "40%",
                        center: [20+20*x+'%', 30+60*y+'%'],
                        data:[
                            {value:data.leaveTime[i], name:'剩余工时'},
                            {value:data.requiredTime[i], name:'实际工时'}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                    option.series.push(addoption);
                }
                proBar.setOption(option);
            },
        },
    }
</script>
