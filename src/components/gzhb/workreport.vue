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
</style>

<template>
	<div class="workreport common-card-wrap" style="height: 100%;">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<span class="card-title">工作汇报</span>
			</div>
			<div class="text item workreport-wrapper">
				<div class="report-header">
					<strong class="name">{{showData.USERNAME}}</strong>
					<!--<el-select v-model="select_value" clearable @change="loadData">
						<el-option v-for="item in select" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>-->
					<div class="i-b" style="float: right;">
						<el-date-picker
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']"
              @change="loadData"
              v-model="dateRange"
              type="daterange"
              :picker-options="pickerOptions2"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              align="right"
            >
						</el-date-picker>
					</div>
					<p class="group">
						<span>所在组别：</span>
						<span>{{showData.DEPT}}</span>
					</p>
					<p class="group">
						<span>角色：</span>
						<span>{{showData.ROLE}}</span>
					</p>
				</div>
				<div class="report-statistics clear">
					<el-form label-width="100px" label-position="right">
						<el-row :gutter="20">
							<el-col :span="12">
								<el-row :gutter="20">
									<el-col :span="24">
										<h5><i class="iconfont icon-wancheng i-b"></i><span class="i-b">完成任务统计</span></h5>
									</el-col>
									<el-col :span="6">
										<el-form-item label="业务需求"><span style="color: red;">{{showData.busiSize}}</span></el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="基础建设"><span style="color: red;">{{showData.baseSize}}</span></el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="日常任务"><span style="color: red;">{{showData.daliySize}}</span></el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="技术需求"><span style="color: red;">{{showData.techSize}}</span></el-form-item>
									</el-col>
									<!--<el-col :span="6">-->
										<!--<el-form-item label="问题管理"><span style="color: red;">{{showData.faultSize}}</span></el-form-item>-->
									<!--</el-col>-->
									<el-col :span="24">
										<h5><i class="iconfont icon-biaozhungongshizhidinghefenxi i-b"></i><span class="i-b">工时统计</span></h5>
									</el-col>
									<el-col :span="6">
										<el-form-item label="业务需求"><span style="color: red;">{{showData.busiTime}}</span></el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="基础建设"><span style="color: red;">{{showData.baseTime}}</span></el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="日常任务"><span style="color: red;">{{showData.daliyTime}}</span></el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="技术需求"><span style="color: red;">{{showData.techTime}}</span></el-form-item>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="12">
								<div id="mychart" style="width: 500px;height: 350px;"></div>
							</el-col>
						</el-row>

					</el-form>
					<div class="report-list" style="margin-top: 10px;">
						<el-row :gutter="20">
							<el-col :span="24">
								<h5><i class="iconfont icon-iconfontzhizuobiaozhun0261 i-b"></i><span class="i-b">完成任务明细</span></h5>
							</el-col>
						</el-row>
						<div class="table-list">
							<el-table :data="showData.workList" border style="width: 100%"  @row-click="goneeds">
								<el-table-column prop="ID" label="需求编号" width="200"></el-table-column>
								<el-table-column prop="TASK_NAME" label="需求名称" show-overflow-tooltip></el-table-column>
								<el-table-column prop="SYSTEM_NAME" label="涉及系统" show-overflow-tooltip></el-table-column>
								<el-table-column prop="TASK_FINAL" label="负责模块" show-overflow-tooltip></el-table-column>
								<el-table-column prop="START_DATE" label="开始时间" width="110"></el-table-column>
								<el-table-column prop="REALY_DATE" label="完成时间" width="110"></el-table-column>
								<el-table-column prop="USER_NAME" label="人员" show-overflow-tooltip></el-table-column>
								<el-table-column prop="TYPE" label="需求类型" width="100"></el-table-column>
								<!--<el-table-column prop="DESCRIPTION" label="故障描述"></el-table-column>
								<el-table-column prop="SOLUTION" label="解决方案"></el-table-column>-->
							</el-table>
						</div>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
  import moment from 'moment';
	export default {
		data() {
			return {
				select_value: "other",
				select: [{
					label: "日报",
					value: "day"
				}, {
					label: "周报",
					value: "week"
				}, {
					label: "月报",
					value: "month"
				}, {
					label: "年报",
					value: "year"
				}],
				dateRange: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')], //时间区间
				pickerOptions2: {
					shortcuts: [{
						text: '日报',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '周报',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * start.getDay());
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '月报',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setDate(1);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '年报',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setDate(1);
							start.setMonth(0);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
				showData: ""
			}
		},
		mounted() {
			this.loadData()

		},
		methods: {
			loadData() {
				this.$maskin()
				let params = new URLSearchParams();
				params.append("TYPE", this.select_value);
				if(this.dateRange.length==0){
					params.append("START_DATE","");
					params.append("END_DATE", "");
				}else{
					params.append("START_DATE", this.dateRange[0]);
				    params.append("END_DATE", this.dateRange[1]);
				}

				this.$axios.post("/user/userWorkReport", params).then((res) => {
					let data = res.data;
					if(data.code == 200) {
						this.$set(this, "showData", data.result);
						this.loadChart()
					} else {
						this.$warn(data.message);
					}
					this.$maskoff()
				})
			},
			FormatDate(strTime) {
				var date = new Date(strTime);

				return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
			},
			loadChart() {
				var echarts = require('echarts');
				let height = document.querySelector(".mainr").offsetHeight;
				let card_header_height = document.querySelector(".el-card__header").offsetHeight;
				let card_body = document.querySelector(".box-card .el-card__body");
				card_body.style.height = height - card_header_height - 36 + "px";
				let chart = document.getElementById("mychart");
				var myChart = echarts.init(document.getElementById("mychart"));
				//          let asset_chart = this.$echarts.init(chart);
				let option = {
					title: {
						left: 'center',
						text: '工作汇报统计',
						subtext: '外圈是工作量统计，内圈是对应的时间统计',
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
					legend: {
						orient: 'vertical',
						x: 'left',
						data: ['日常任务', '业务需求', '技术需求', '基础建设', '日常任务', '业务需求', '技术需求', '基础建设']
					},
					series: [{
							name: '工时统计',
							type: 'pie',
							selectedMode: 'single',
							radius: [0, '30%'],

							label: {
								normal: {
									position: 'inner'
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data: [{
									value: this.showData.daliyTime,
									name: '日常任务'
								},
								{
									value: this.showData.busiTime,
									name: '业务需求'
								},
								{
									value: this.showData.techTime,
									name: '技术需求'
								},
								{
									value: this.showData.baseTime,
									name: '基础建设'
								}
							]
						},
						{
							name: '完成任务统计',
							type: 'pie',
							radius: ['40%', '55%'],
							label: {},
							data: [{
									value: this.showData.daliySize,
									name: '日常任务'
								},
								{
									value: this.showData.busiSize,
									name: '业务需求'
								},
								{
									value: this.showData.techSize,
									name: '技术需求'
								},
								{
									value: this.showData.baseSize,
									name: '基础建设'
								},
								{
									value: this.showData.faultSize,
									name: '问题管理'
								}
							]
						}
					]
				};
				myChart.setOption(option);
			},//跳转到需求页面
			goneeds(val) {
				this.$go("", "", {
					"neelId": val.ID
				}, val.TYPE);
			}

		}
	}
</script>
