<style scoped>
	@import "../../static/css/table.css";
	@import "../../static/css/console.css";
	/*头部*/

	.report-header .name {
		font-weight: bold;
		font-size: 20px;
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
		<el-card class="box-card" id="pdfDom">
			<div slot="header" class="clearfix">
				<span class="card-title">工作报告</span>
			</div>
			<div class="text item workreport-wrapper">
				<div class="report-header clear" style="margin-bottom: 30px;">
					<el-select v-model="selectValueUs" @change="loadData" clearable size="mini" filterable>
						<el-option v-for="item in optionsUs" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-select v-model="selectValueOnI" v-if="selectValueUs=='group'" placeholder="请选择部门" @change="loadData" clearable size="mini" filterable>
						<el-option v-for="item in optionsOn" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
						</el-option>
					</el-select>
					<el-select v-model="selectValueOn" v-if="selectValueUs=='personal'" filterable placeholder="请选择部门" @change="getUser(selectValueOn)" clearable size="mini">
						<el-option v-for="item in optionsOn" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
						</el-option>
					</el-select>
					<el-select v-model="pValueOn" v-if="selectValueUs=='personal'" placeholder="请选择人员" @change="loadData" clearable size="mini" filterable>
						<el-option v-for="item in pArr" :key="item.user_ID" :label="item.user_NAME" :value="item.user_ID">
						</el-option>
					</el-select>
					<!--<div class="fr" style="margin-left: 20px;">
						<div class="search i-b">
							<el-button size="mini" type="primary" @click="getPdf('工作报告')">生成报告
							</el-button>
						</div>
					</div>-->
					<div class="i-b" style="float: right;">
						<el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="loadData" v-model="dateRange" type="daterange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" align="right">
						</el-date-picker>
					</div>

					<p class="group" v-if="selectValueUs=='personal' && showData.name2" style="margin-top: 25px;">
						<span>所在组别：</span>
						<span>{{showData.name2}}</span>
					</p>
					<p class="group" v-if="selectValueUs=='personal' && showData.name1">
						<span>职位：</span>
						<span>{{showData.name1}}</span>
					</p>
				</div>
				<div class="clear"></div>
				<div class="report-statistics clear">
					<el-form label-width="100px" label-position="right">
						<el-row :gutter="20">
							<el-col :span="12">
								<el-row :gutter="20">
									<el-col :span="24">
										<h5><i class="iconfont icon-wancheng i-b"></i><span class="i-b">完成任务统计</span></h5>
									</el-col>
									<el-col :span="6">
										<el-form-item label="业务需求"><span style="color: red;">{{showData.completeBus}}</span></el-form-item>
									</el-col>
                                    <el-col :span="6">
                                        <el-form-item label="技术需求"><span style="color: red;">{{showData.completeTech}}</span></el-form-item>
                                    </el-col>
									<el-col :span="6">
										<el-form-item label="基础建设"><span style="color: red;">{{showData.completeBase}}</span></el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="日常任务"><span style="color: red;">{{showData.completeDaliy}}</span></el-form-item>
									</el-col>

									<!--<el-col :span="6">
										<el-form-item label="问题管理"><span style="color: red;">{{showData.faultSize}}</span></el-form-item>
									</el-col>-->
									<el-col :span="24">
										<h5><i class="iconfont icon-biaozhungongshizhidinghefenxi i-b"></i><span class="i-b">工时统计</span></h5>
									</el-col>
                                    <el-col :span="6">
                                        <el-form-item label="业务需求"><span style="color: red;">{{showData.Workcount}}</span></el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="技术需求"><span style="color: red;">{{showData.Techcount}}</span></el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="基础建设"><span style="color: red;">{{showData.Basecount}}</span></el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="日常任务"><span style="color: red;">{{showData.Daliycount}}</span></el-form-item>
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
							<el-table :data="showData.resuletMapList" border style="width: 100%" @row-click="goneeds">
								<el-table-column prop="ST_NEELID" label="需求编号" width="200"></el-table-column>
								<el-table-column prop="ST_NEELNAME" label="需求名称" show-overflow-tooltip></el-table-column>
								<el-table-column prop="name2" label="项目组" width="110"></el-table-column>
								<el-table-column prop="name1" label="人员" width="110"></el-table-column>
								<el-table-column prop="RETURNTYPENAME" label="所属需求" show-overflow-tooltip></el-table-column>
								<el-table-column prop="ST_expectedStartTime" label="预计开始日期" width="110"></el-table-column>
								<el-table-column prop="ST_expectedEndtTime" label="预计结束日期" width="110"></el-table-column>
								<el-table-column prop="ST_STATE" label="状态"></el-table-column>
							</el-table>
						</div>
					</div>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				selectValueUs: "personal",
				optionsUs: [{
					label: "个人报告",
					value: "personal"
				}, {
					label: "开发组报告",
					value: "group"
				}],
				select_value: "orther",
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
				selectValueOn: "",
				optionsOn: [], //请选择开发组
				pValueOn: "",
				pArr: [], //人员
				dateRange: [], //时间区间
				dateComp: {}, //时间区间
				selectValueOnI: "", //按照组来排序
				showData: "",
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
				}
			}
		},
		mounted() {
			this.loadData()
			this.loadDept()
		},
		methods: {
			loadData() {
				let params = new URLSearchParams();
				if(this.selectValueUs == 'group') {
					if(!this.selectValueOnI) {
						return
					}
					params.append("deptId", this.selectValueOnI);
				} else {
					params.append("userId", this.pValueOn);
				}
				this.$maskin();
				if(this.dateRange.length == 0) {
					params.append("startDate", "");
					params.append("endDate", "");
					this.select_value = "day"
				} else {
					params.append("startDate", this.dateRange[0]);
					params.append("endDate", this.dateRange[1]);
					this.select_value = "orther"
				}
				params.append("selectType", this.selectValueUs);
				params.append("TYPE", this.select_value);

				this.$axios.post("/statistical/getWorkReportLists", params).then((res) => {
					let data = res.data;
					if(data.code == 200) {
						this.$set(this, "showData", data.result);
						this.loadChart()
					} else {
						this.$warn(data.message);
					}
					this.$maskoff();
				})
			},
			loadDept() { //获取部门列表
				let params = new URLSearchParams();
				this.$axios.post("/statistical/getdeptsList", params).then((res) => {
					let data = res.data;
					if(data.code == 200) {
						this.optionsOn = data.result
					} else {
						this.$warn(data.message);
					}
				})
			},
			getUser(val) { //根据部门id取user
				let params = new URLSearchParams();
				params.append("deptId", val);
				this.$axios.post("/statistical/getUsersList", params).then((res) => {
					let data = res.data;
					if(data.code == 200) {
						this.pArr = data.result
					} else {
						this.$warn(data.message);
					}
				})
			},
			loadChart() {
				var echarts = require('echarts');
				let height = document.querySelector(".mainr").offsetHeight;
				let card_header_height = document.querySelector(".el-card__header").offsetHeight;
				let card_body = document.querySelector(".box-card .el-card__body");
				card_body.style.height = height - card_header_height - 36 + "px";
				let chart = document.getElementById("mychart");
				var myChart = echarts.init(document.getElementById("mychart"));
				myChart.clear()
				let option = {
					title: {
						left: 'center',
						text: '工作汇报统计',
						subtext: '外圈是完成任务统计，内圈是工时统计',
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b}: {c} ({d}%)"
					},
					legend: {
						orient: 'vertical',
						x: 'left',
                        data: ['日常任务', '业务需求', '技术需求', '基础建设','日常任务', '业务需求', '技术需求', '基础建设']
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
                                    value: this.showData.Daliycount,
                                    name: '日常任务'
                                },
                                {
                                    value: this.showData.Workcount,
                                    name: '业务需求'
                                },
                                {
                                    value: this.showData.Techcount,
                                    name: '技术需求'
                                },
                                {
                                    value: this.showData.Basecount,
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
									value: this.showData.completeDaliy,
									name: '日常任务'
								},
								{
									value: this.showData.completeBus,
									name: '业务需求'
								},
								{
									value: this.showData.completeTech,
									name: '技术需求'
								},
								{
									value: this.showData.completeBase,
									name: '基础建设'
								}
							]
						}
					]
				};
				myChart.setOption(option);
			},
			calculate() {
				let height = document.querySelector(".mainr").offsetHeight;
				let card_body = document.querySelector(".box-card .el-card__body");
				card_body.style.height = height - 36 + "px";
				//表格高度
				this.calculateTableHeight(this.tabs.consoleWrapperVisible);
				//tab高度
				if(this.tabs.consoleWrapperVisible) {
					this.calculateTabsHeight();
				}
				//控制台的内容区域高度
			},
			tabClick(val) {
				this.calculateTabsHeight();
			},//跳转到需求页面
            goneeds(val) {
                // e.cancelBubble = true;
                let path = "";
                if(val.st_RETURNTYPE == "TECH") {
                    path = "技术需求"
                }
                if(val.st_RETURNTYPE == "WORK") {
                    path = "业务需求"
                }
                if(val.st_RETURNTYPE == "BASE") {
                    path = "基础建设"
                }
                if(val.st_RETURNTYPE == "DALIY") {
                    path = "日常任务"
                }

                this.$go("", "", {
                    "neelId": val.st_NEELID
                }, path);
            }

		}
	}
</script>
