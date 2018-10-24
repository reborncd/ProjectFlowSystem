<template>
	<div class="workreport common-card-wrap" style="height: 100%;">
		<el-card class="box-card" >
			<div slot="header" class="clearfix">
				<span class="card-title">积分统计</span>
			</div>
			<div class="action clear" style="margin-bottom: 30px;">
				<el-select v-model="selectArr_value"  placeholder="请选择部门" clearable size="mini" @change="loadCharData" filterable>
					<el-option v-for="item in selectArr" :label="item.dept_name" :value="item.dept_id" :key="item.dept_id">
					</el-option>
				</el-select>
        <!-- <el-select v-model="select_value"  placeholder="请选择统计方式" clearable size="mini" @change="loadCharData" filterable>
          <el-option v-for="item in select" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select> -->
				<div class="fr" style="margin-left: 20px;">
					<div class="search i-b">
						<el-button size="mini" type="primary" @click="getExcel('积分统计')">生成报告
						</el-button>
					</div>
				</div>
				<div class="i-b" style="float: right;">
					<el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="loadCharData" v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" align="right">
					</el-date-picker>
				</div>
			</div>
			<div class="text item workreport-wrapper" id="pdfDom">
				<div class="report-statistics clear">
					<el-form label-width="100px" label-position="right">
						<el-row :gutter="20">
							<el-col :span="24" style="border: 1px solid #ebeef5;">
								<div id="system" style="width:100%;height: 400px;margin: 20px 0;"></div>
							</el-col>
						</el-row>
					</el-form>
					<div class="report-list" style="margin-top: 10px;">
						<el-form label-width="100px" label-position="right">
							<el-row :gutter="20">
								<el-col :span="12">
									<h5><i class="iconfont icon-iconfontzhizuobiaozhun0261 i-b"></i><span class="i-b">积分列表</span></h5>
								</el-col>
							</el-row>
						</el-form>
						<div class="table-list">
              <div class="fl" style="margin-bottom: 10px;">
                <div style="text-align:center;font-size:20px;font-weight:bold;">月平均数据</div>
                <el-form label-width="150px" :inline="true" class="demo-form-inline">
                  <el-form-item style="font-weight:bold;" label="平均项目个数">
                    {{all.averageNumber}}
                  </el-form-item>
                  <el-form-item style="font-weight:bold;" label="本月平均工时数">
                    {{all.averageNumberHours}}
                  </el-form-item>
                  <el-form-item style="font-weight:bold;" label="投入最大工时数">
                    {{all.maxWorkHours}}
                  </el-form-item>
                  <el-form-item style="font-weight:bold;" label="最高绩效得分">
                    {{all.maximumPerformanceScore}}
                  </el-form-item>
                  <el-form-item style="font-weight:bold;" label="基础分">
                    {{all.basicPoints}}
                  </el-form-item>
                </el-form>
              </div>
              <el-table :data="showData" style="width: 100%" :default-sort = "{prop: 'deptName', order: 'ascending'}">
								<el-table-column prop="name" label="姓名" ></el-table-column>
								<el-table-column prop="deptName" label="部门" ></el-table-column>
								<el-table-column prop="finishedProjects" label="完成项目个数" ></el-table-column>
								<el-table-column prop="overTimeProjects" label="逾期项目个数" width="110"></el-table-column>
								<el-table-column prop="workingHoursMonth" label="本月投入工时(天)" width="110"></el-table-column>
								<el-table-column prop="effectiveWorkingHoursMonth" label="按月22天换算有效投入工数" ></el-table-column>
								<el-table-column prop="superiorEvaluation" label="上级评定(≤10)"></el-table-column>
								<el-table-column prop="calculateTheScoreMonth" label="本月计算得分"></el-table-column>
								<el-table-column prop="performanceScoreMonth" label="本月绩效分数"></el-table-column>
							</el-table>
						</div>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
  import cloneDeep from "lodash/cloneDeep";
  import moment from 'moment';
	export default {
		data() {
			return {
        all:'',
				select_value: "week",
				select: [
          {
            label: "自定义",
            value: "orther"
          },
          {
					label: "周积分",
					value: "week"
				}, {
					label: "月积分",
					value: "month"
				}, {
					label: "年积分",
					value: "year"
				}],
				showData: [],
        originShowData:[],
				dateComp: {},
				selectArr: [], //部门
				selectArr_value: "",
				dateRange: [], //时间区间
				pickerOptions2: {
					shortcuts: [{
						text: '日统计',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '周统计',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * start.getDay());
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '月统计',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setDate(1);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '年统计',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setDate(1);
							start.setMonth(0);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				workHoursArr: [],
        keyword: ''
			}
		},
		mounted() {
      let start=new Date();
      let end=new Date();
      start.setDate(1);
      this.dateRange=[moment(start).format('YYYY-MM-DD'),moment(end).format('YYYY-MM-DD')];
			this.loadCharData();
			this.loadDept();
		},
		methods: {
      // 生成excel报告
      getExcel() {
        let params = new URLSearchParams();
        params.append("deptId",this.selectArr_value);
        if (this.dateRange.length == 0) {
          params.append("startDate", moment().format('YYYY-MM-DD'));
          params.append("endDate", moment().format('YYYY-MM-DD'));
          // this.select_value = "day"
        } else {
          let startDate = this.dateRange[0];
          let endDate = this.dateRange[1];
          params.append("startDate", startDate);
          params.append("endDate", endDate);
        }
        // console.log('生成报告', decodeURI(params.toString()));
        // console.log(`${window._options.baseUrl}/statistical/exportSFile?${decodeURI(params.toString())}&token=${this.$getToken()}`)
        window.open(`${window._options.baseUrl}/statistical/exportSFile?${decodeURI(params.toString())}&token=${this.$getToken()}`)
      },
		    searchPerson(){
		        if(this.keyword){
              let arr = [];
              console.log(this.originShowData)
              for(let i of this.originShowData){
                if(i.userName == this.keyword){
                  arr.push(i)
                }
              }
              this.showData = arr;
            }else{
              this.showData = this.originShowData
            }

        },
			loadDept(){
				let params = new URLSearchParams();
				this.$axios.post("/statistical/getdeptsList", params).then((res) => {
					let data = res.data;
					if(data.code == 200) {
            this.selectArr = cloneDeep(data.result);
            // this.selectArr_value = data.result[0].dept_id;
					} else {
						this.$warn(data.message);
					}
				})
			},
			loadCharData() {
				// this.$maskin();
        let params = new URLSearchParams();
				 if(this.dateRange.length == 0) {
				 	params.append("startDate", "");
				 	params.append("endDate", "");
				 } else {
				 	params.append("startDate", this.dateRange[0]);
				 	params.append("endDate", this.dateRange[1]);
				 }
				params.append("deptId", this.selectArr_value);
        // params.append("TYPE", this.select_value);
				this.$axios.post("/statistical/getIntegralStatisticalData", params).then((res) => {
					let data = res.data;
					if(data.code == 200) {
						// let xaxis = [];
						// let efficiency = [];
						// let promptness = [];
						// let saturation = [];
						// let integral=[];
						// for(let i of data.result.result2) {
						// 	xaxis.push(i.userName)
						// 	efficiency.push((i.efficiency)*100)
						// 	promptness.push((i.promptness)*100)
						// 	saturation.push((i.saturation)*100)
						// 	integral.push(i.integral)
						// }
						// this.loadsystemChart(xaxis, efficiency, promptness, saturation,integral)
						this.$set(this, "showData", data.result.data1);
            this.$set(this, "originShowData", data.result.data1);
            this.all=data.result.data2;
            this.setComplete(data.result.data1);
					}
				})
      },
      completeOption(data){
        let person = [];//放置所有人员
        let finishedProjects = [];//完成项目的数组
        let overTimeProjects = [];//逾期项目的数组
        let point = [];//本月积分的数组
        for (let i of data) {
          person.push(i.name);
          finishedProjects.push(i.finishedProjects);
          overTimeProjects.push(i.overTimeProjects);
          point.push(i.calculateTheScoreMonth);
        }
        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: {      // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'    // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ['完成项目个数', '逾期项目个数', '本月积分']
          },
          dataZoom:[
            {
              show: true,
              yAxisIndex: 0,
              filterMode: 'empty',
              width: 30,
              height: '80%',
              start:70,
              end:100,
              showDataShadow: false,
              left: '93%'
            }

          ],
          grid: {
            left: '3%',
            right: '10%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            data: person
          },
          series: [{
            name: '完成项目个数',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
              //  show: true,
                position: 'insideRight',
              }
            },
            itemStyle : {
                normal : {
                    color:'#40CCFF',
                }
            },
            data: finishedProjects
          }, {
            name: '逾期项目个数',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
              //  show: true,
                position: 'insideRight'
              }
            },
            data: overTimeProjects
          }, {
            name: '本月积分',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
               show: true,
                position: 'insideRight'
              }
            },
            itemStyle : {
                normal : {
                    color:'#E6A23C',
                }
            },
            data: point
          }]
        }
      },
      //应用完成状态的配置
      setComplete(data){
        let complete = this.$echarts.init(document.getElementById("system"));
        let height = document.querySelector(".mainr").offsetHeight;
				let card_header_height = document.querySelector(".el-card__header").offsetHeight;
				let card_body = document.querySelector(".box-card .el-card__body");
				card_body.style.height = height - card_header_height - 36 + "px";
        complete.clear();
        complete.setOption(this.completeOption(data));
      },
			loadsystemChart(xaxis, efficiency, promptness, saturation,integral) {

				var echarts = require('echarts');
				let height = document.querySelector(".mainr").offsetHeight;
				let card_header_height = document.querySelector(".el-card__header").offsetHeight;
				let card_body = document.querySelector(".box-card .el-card__body");
				card_body.style.height = height - card_header_height - 36 + "px";
				var proBar = echarts.init(document.getElementById("system")); //项目统计表格
				let option = {}
				option = {
					title: {
						text: "积分统计",
						left: 'center'
					},
					tooltip: {
						trigger: 'axis',
						formatter: function(params, ticket, callback) {
							var res = params[0].name;
							for(var i = 0, l = params.length; i < l; i++) {
								if(params[i].seriesType === 'line') {
									res += '<br/>' + params[i].seriesName + ' : ' + (params[i].value ? params[i].value : '0') + '';
								} else {
									res += '<br/>' + params[i].seriesName + ' : ' + (params[i].value ? params[i].value : '0') + '%';
								}
							}
							return res;
						}
					},
					grid: {
						containLabel: true
					},
					legend: {
						bottom: 20,
						x: 'center',
						data: ['饱和度', '效率', '及时率',"积分"]
					},
					xAxis: [{
						type: 'category',
						axisLabel: {
							rotate: -45,
						},
						axisTick: {
							alignWithLabel: true
						},
						data: xaxis
					}],

					yAxis: [
					{
						type: 'value',
						name: '百分比',
						min: 0,
						position: 'left',
						axisLabel: {
							formatter: '{value}%'
						}
					}
					,{
						type: 'value',
						name: '个数',
						min: 0,
						position: 'right',
						axisLabel: {
							formatter: '{value}个'
						}
					}
				],
					series: [{
						name: '工作效率',
						type: 'bar',
						yAxisIndex: 0,
						label: {
							normal: {
								show: false,
								position: 'top',
							}
						},
						// lineStyle: {
						// 	normal: {
						// 		width: 3,
						// 		shadowColor: 'rgba(0,0,0,0.4)',
						// 		shadowBlur: 10,
						// 		shadowOffsetY: 10
						// 	}
						// },
						data: efficiency
					}, {
						name: '任务完成及时率',
						type: 'bar',
						yAxisIndex: 0,
						label: {
							normal: {
								show: false,
								position: 'top',
							}
						},
						data: promptness
					}, {
						name: '工作饱和度',
						type: 'bar',
						yAxisIndex: 0,
						label: {
							normal: {
								show: false,
								position: 'top'
							}
						},
						data: saturation
					}
					, {
						name: '积分',
						type: 'line',
						yAxisIndex: 0,
						label: {
							normal: {
								show: true,
								position: 'top'
							}
						},
						data: integral
					}
					]
				};
				proBar.setOption(option);
				// this.$maskoff();
			}

		}
	}
</script>
<style scoped>
	@import "../../static/css/table.css";
	@import "../../static/css/console.css";
	/*头部*/

	.report-header .name {
		font-weight: bold;
		font-size: 20px;
	}

	.report-header .el-select {
		float: right;
	}

	.report-header .group {
		color: #9f9f9f;
		margin: 5px 0;
		font-size: 15px;
	}
	/*统计部分*/

	.report-left {
		width: 300px;
		margin-top: 10px;
	}

	.report-statistics h5 {
		font-size: 16px;
		font-weight: 400;
		margin: 5px 0;
	}

	.report-statistics .iconfont {
		color: #5fccac;
		font-size: 20px;
		margin-right: 5px;
	}

	.statistics-content {
		padding-left: 24px;
	}

	.statistics-content p {
		float: left;
		width: 50%;
		line-height: 24px;
	}

	.statistics-content p .key {
		color: #626262;
	}

	.statistics-content p .value {
		color: #dd544e;
	}

	.el-textarea textarea {
		min-height: 80px!important;
	}

	.el-form-item__label {
		width: 120px !important;
	}

	.el-form-item {
		margin-bottom: 0;
	}

	h5 {
		padding-top: 20px;
	}

	.search {
		float: right;
	}
</style>
