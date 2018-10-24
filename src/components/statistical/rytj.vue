<template>
	<div class="workreport common-card-wrap" style="height: 100%;">
		<el-card class="box-card" >
			<div slot="header" class="clearfix">
				<span class="card-title">人员统计</span>
			</div>
			<div class="action clear" style="margin-bottom: 30px;">
				<!-- <el-select v-model="select_value" clearable size="mini" @change="loadChange" filterable>
					<el-option :key="index" v-for="(item, index) in select" :label="item.label" :value="item.value">
					</el-option>
				</el-select> -->
				<el-select placeholder="请选择研发小组" v-model="selectArr_value" clearable size="mini" @change="loadChange" filterable>
					<el-option :key="index" v-for="(item, index) in selectArr" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
				<div class="fr" style="margin-left: 20px;">
					<div class="search i-b">
						<!-- <el-button size="mini" type="primary" @click="getPdf('问题统计')">生成报告
						</el-button> -->
            <el-button size="mini" type="primary" @click="getExcel">生成报告
						</el-button>
					</div>
				</div>
				<div class="i-b" style="float: right;">
					<el-date-picker format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="loadChange" v-model="dateRange" type="daterange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" align="right">
					</el-date-picker>
				</div>
			</div>
			<div class="text item workreport-wrapper" id="pdfDom">
				<div class="report-statistics clear">
					<el-form label-width="100px" label-position="right">
						<el-row :gutter="20">
							<el-col :span="24">
								<div id="pro-bar" style="width:100%;height: 400px;padding-bottom: 20px;"></div>
							</el-col>
						</el-row>
						<el-row :gutter="20">
							<el-col :span="24">
								<div id="work-bar" style="width:100%;height: 400px;padding-bottom: 20px;"></div>
							</el-col>
						</el-row>
						<el-row :gutter="20" v-if="ifshowPerson">
							<el-col :span="24">
								<div id="per-bar" style="width:100%;height: 400px;padding-bottom: 20px;"></div>
							</el-col>
						</el-row>
					</el-form>

					<div class="report-list" style="margin-top: 10px;">
						<el-form label-width="100px" label-position="right">
							<el-row :gutter="20">
								<el-col :span="12">
									<h5><i class="iconfont icon-iconfontzhizuobiaozhun0261 i-b"></i><span class="i-b">当前开发项目</span></h5>
								</el-col>
                <!-- 分页添加 -->
                <el-col>
                <div style="text-align:center;" class="table-pagination">
                  <el-button-group>
                    <el-button
                      size="mini"
                      @click="pageHandler('home')"
                      icon="el-icon-d-arrow-left">
                      首页
                    </el-button>
                    <el-button
                      size="mini"
                      :loading="prevIsLoad"
                      @click="pageHandler('prev')"
                      icon="el-icon-arrow-left">
                      上一页
                    </el-button>
                    <el-button
                      size="mini"
                      :loading="nextIsLoad"
                      @click="pageHandler('next')">
                      下一页
                      <i class="el-icon-arrow-right el-icon--right"></i>
                    </el-button>
                    <el-button
                      size="mini"
                      @click="pageHandler('end')">
                      末页
                      <i class="el-icon-d-arrow-right el-icon--right"></i>
                    </el-button>
                  </el-button-group>
                </div>
                </el-col>
								<!--<el-col :span="12">
									<el-form-item label="" class="search i-b" style="margin-top: 20px;">
										<el-input placeholder="请输入检索关键字" suffix-icon="icon-sousuo iconfont" v-model="keyWord" size="mini" clearable>
										</el-input>
									</el-form-item>
								</el-col>-->
							</el-row>
						</el-form>
						<div class="table-list">
							<el-table :data="showData" style="width: 100%">
								<el-table-column label="需求编号" width="200">
									<template slot-scope="scope">
										<span @click="goneeds($event,scope.row)" class="tab-opt" >{{scope.row.st_NEELID}}</span>
									</template>
								</el-table-column>
								<el-table-column prop="st_NEELNAME" label="需求名称" show-overflow-tooltip></el-table-column>
								<el-table-column prop="st_STARTDATE" label="提交日期" width="110"></el-table-column>
								<el-table-column prop="st_ENDDATE" label="期望上线日期" width="110"></el-table-column>
								<el-table-column prop="st_NEELSOURCE" label="需求来源" show-overflow-tooltip></el-table-column>
								<!--<el-table-column prop="st_DESIGNSYSTEM" label="涉及系统" show-overflow-tooltip></el-table-column>-->
								<el-table-column prop="st_RRIORITY" label="优先级" width="70"></el-table-column>
								<el-table-column prop="st_STATE" label="状态"></el-table-column>
                <el-table-column prop="st_DEPTS" label="研发小组"  show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="st_USERNAMES" label="开发/测试" show-overflow-tooltip></el-table-column> -->
								<!--<el-table-column prop="st_WORKHOURS" label="更新时间"></el-table-column>-->
								<!--<el-table-column prop="st_SCHEDULE" label="操作">
									<template slot-scope="scope" class="action-wrap">
									<el-button  @click="goDetail(scope.row,$event)" size="small" type="primary">查看
									</el-button>
								    </template>
								</el-table-column>-->
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
				select_value: "personal",
				select: [{
					label: "全部开发组",
					value: "group"
				}, {
					label: "人员统计",
					value: "personal"
				}],
				selectArr: [], //部门
				selectArr_value: "",
				date_value: "orther",
				date: [{
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
				showData: "",
				dateComp: {},
				dateRange: [], //时间区间
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
				workHoursArr: [],
				ifshowPerson:false,
        keyWord: '',
        prevIsLoad: false,
        nextIsLoad: false,
        currentPageNumber: 1,
        defaultPageSize: 10,
        maxPageNumber: null,
        total:'',
        allDeptId:''
			}
		},
		mounted() {
      this.loadDept();
      if(this.dateRange===null || this.dateRange.length == 0) {
        let end = new Date();
        let start = new Date();
        start.setDate(1);
        // moment(start).format('YYYY-MM-DD')
        // moment(end).format('YYYY-MM-DD')
        // console.log(moment().format('YYYY-MM-DD'))
        this.dateRange=[moment(start).format('YYYY-MM-DD'),moment(end).format('YYYY-MM-DD')];
      }
      // this.loadChartsData();
      // // this.loadHours()
      // this.loadData();
      // setTimeout(()=>{
      //   this.loadChartsData();
      //   // this.loadHours()
      //   this.loadData();
      // },500)
    },
    // computed:{
    //   computedDate:function(){
    //     if(this.dateRange===null || this.dateRange.length == 0) {
    //       let end = new Date();
    //       let start = new Date();
    //       start.setDate(1);
		// 			return this.dateRange=[start,end];
		// 		}
    //   }
    // },
		methods: {
      // 生成excel报告
      getExcel() {
        let params = new URLSearchParams();
        // console.log(this.selectArr_value)
        params.append("depart",this.selectArr_value);
        if (this.dateRange.length == 0) {
          params.append("startDate", moment().format('YYYY-MM-DD'));
          params.append("endDate", moment().format('YYYY-MM-DD'));
          // this.select_value = "day"
        } else {
          let startDate = this.dateRange[0]
          let endDate = this.dateRange[1]
          // this.select_value = "orther"
          // if (this.pickerOptions2.shortcuts[3].year == "year") {
          //   this.pickerOptions2.shortcuts[3].year = ""
          //   this.select_value = "year"
          //   startDate = ""
          //   endDate = ""
          // }
          params.append("startDate", startDate);
          params.append("endDate", endDate);
        }
        // console.log('生成报告', decodeURI(params.toString()));
        // console.log(`${window._options.baseUrl}/statistical/exportPFile?${decodeURI(params.toString())}&token=${this.$getToken()}`)
        window.open(`${window._options.baseUrl}/statistical/exportPFile?${decodeURI(params.toString())}&token=${this.$getToken()}`)
      },
			loadDept(){
				let params = new URLSearchParams();
//				params.append("TYPE", this.date_value);
//				params.append("selectType", this.select_value);
				this.$axios.post("/statistical/getdeptsList", params).then((res) => {
					let data = res.data;
					if(data.code == 200) {
            this.selectArr = [...this.selectArr, ...data.result];
            let arr=[];
            this.selectArr.forEach(item=>{
              arr.push(item.dept_id);
            })
            this.allDeptId=arr.join(',');
            // console.log(this.allDeptId)
            this.loadChartsData();
            this.loadData();
            // this.selectArr_value = data.result[0].dept_id;
					} else {
						this.$warn(data.message);
					}
				})
			},
			loadData(currentPageNumber) {
				this.$maskin();
				let params = new URLSearchParams();
				if(this.dateRange===null || this.dateRange.length == 0) {
          let end = new Date();
          let start = new Date();
          start.setDate(1);
					params.append("startDate", start);
					params.append("endDate", end);
					// this.date_value = "day"
				} else {
					params.append("startDate", this.dateRange[0]);
					params.append("endDate", this.dateRange[1]);
					this.date_value = "orther"
				}
				// params.append("TYPE", this.date_value);
        params.append("dept_id", this.allDeptId);
        params.append("page", this.currentPageNumber || currentPageNumber);
				params.append("pageSize", this.defaultPageSize);
				if(this.select_value=="personal" && this.selectArr_value){
					params.append("depart", this.selectArr_value);
        }
        if(this.currentPageNumber <= 0 || (this.maxPageNumber && this.maxPageNumber < this.currentPageNumber)){
          if(this.currentPageNumber <= 0)this.currentPageNumber == 1;
          this.$maskoff();
          return;
        }
				this.$axios.post("/statistical/getPersonlStatisticalLists", params).then((res) => {
          let data = res.data;
          this.total=res.data.result.total;
					if(data.code == 200) {
            // if(res.data.result.result === 0 && type){
            //   if(type === 'next'){
            //     this.currentPageNumber--;
            //     this.maxPageNumber = this.currentPageNumber;
            //   }
            //   this.$maskoff();
            //   return;
            // }
            res.data.result.result.forEach(item=>{
              item.st_RRIORITY=this.filterData(item.st_RRIORITY);
              // item.st_STATE=this.filterData(item.st_STATE);
            })
            this.$maskoff();
						this.$set(this, "showData", res.data.result.result);
					} else {
						this.$warn(data.message);
					}

				})
      },
      filterData(val) {
        let str='';
        switch(val){
          case '101':
            str='S';
          break;
          case '102':
            str='A';
          break;
          case '103':
            str='B';
          break;
          case '104':
            str='C';
          break;
          case '301':
            str='已提交';
          break;
          case '302':
            str='已撤回';
          break;
          case '303':
            str='待技术管理部审核';
          break;
          case '304':
            str='被驳回';
          break;
          case '305':
            str='待技术经理审核';
          break;
          case '306':
            str='待开发';
          break;
          case '307':
            str='开发中';
          break;
          case '308':
            str='待测试';
          break;
          case '309':
            str='测试中';
          break;
          case '310':
            str='测试验收';
          break;
          case '311':
            str='测试验收通过';
          break;
          case '313':
            str='已上线';
          break;
          case '314':
            str='暂存';
          break;
          case '315':
            str='已转接';
          break;
          case '316':
            str='转接任务';
          break;
          case '319':
            str='生产验收通过';
          break;
          case '320':
            str='已新建变更';
          break;
          case '321':
            str='已需求内变更';
          break;
          case '322':
            str='验收不通过';
          break;
          case '323':
            str='延后评审';
          break;
          case '324':
            str='无效';
          break;
          case '325':
            str='部分上线';
          break;
          case '326':
            str='上线失败';
          break;
          case '327':
            str='待上线';
          break;
          case '328':
            str='未上线';
          break;
          case '329':
            str='生产验收';
          break;
          case '330':
            str='生产验收不通过';
          break;
        }
        return str;
      },
      pageHandler(handlerType){
        // 上下页按钮点击事件
        if(handlerType === 'prev'){
          if(this.currentPageNumber>1){
            this.currentPageNumber--
          }else{
            return this.$warn('已经是第一页了呢');
          }
        }else if(handlerType === 'next'){
          if(this.currentPageNumber<Math.ceil(this.total/this.defaultPageSize)){
            this.currentPageNumber++;
          }else{
            return this.$warn('已经是最后一页了呢');
          }
        }
        if(handlerType === 'home'){
          this.currentPageNumber=1;
          // this.$maskin();
          // this.currentPageNumber=1;
          // let params = new URLSearchParams();
          // params.append('page',this.currentPageNumber)
          // params.append('pageSize',this.defaultPageSize)
          // return this.$axios.post("/work/queryAll",params).then((res)=>{
          //   let data = res.data;
          //   if(data.code == 200){
          //     this.current_user_id = data.result.current_user_id;
          //     data.result.bases.map(item => {
          //       item.isFast = item.urgent || "否";
          //     });
          //     this.$set(this.table,"tableData", data.result.bases);
          //     this.$maskoff();
          //   }
          // })
        }
        if(handlerType === 'end'){
          // this.$maskin();
          // let params = new URLSearchParams();
          this.currentPageNumber=Math.ceil(this.total/this.defaultPageSize);
          // params.append('page',this.currentPageNumber)
          // params.append('pageSize',this.defaultPageSize)
          // return this.$axios.post("/work/queryAll",params).then((res)=>{
          //   let data = res.data;
          //   if(data.code == 200){
          //     this.current_user_id = data.result.current_user_id;
          //     data.result.bases.map(item => {
          //       item.isFast = item.urgent || "否";
          //     });
          //     this.$set(this.table,"tableData", data.result.bases);
          //     this.$maskoff();
          //   }
          // })
        }
        this.loadData(handlerType);
      },
			loadChartsData() {
        this.$maskin();
        console.log('加载表格数据')
        let params = new URLSearchParams();
				if(this.dateRange===null || this.dateRange.length == 0) {
					params.append("startDate", "");
					params.append("endDate", "");
				} else {
					params.append("startDate", this.dateRange[0]);
					params.append("endDate", this.dateRange[1]);
        }
				// params.append("TYPE", this.date_value);
				// params.append("selectType", this.select_value);
        params.append("dept_id", this.allDeptId);
				if(this.select_value=="personal" && this.selectArr_value){
					params.append("depart", this.selectArr_value);
        }
        this.$axios.post("/statistical/getStatisticalProjectCount", params).then((res) => {
          let data = res.data;
          if(data.code == 200) {
            this.$maskoff();
						let legendArr = [];
						let datas = [];
            let ids = [];
            // let legendArrHour = [];
						let datasHour = [];
						if(this.select_value == "personal") {
							for(let i of data.result) {
								legendArr.push(i.user_name);
								datas.push(i.finishedProjects);
                ids.push(i.user_id);
                datasHour.push(i.totalWorkTime);
							}
            }
            // else {
						// 	for(let i of res.data.result.result) {
						// 		legendArr.push(i.deptName)
						// 		datas.push(i.count)
						// 	}
						// }
            this.loadChart(legendArr, datas, ids)
            this.loadWorkhours(legendArr, datasHour)
					} else {
						this.$warn(data.message);
					}
				})
				// this.$axios.post("/statistical/getStatisticalProjectByUser", params).then((res) => {
				// 	let data = res.data;
				// 	if(data.code == 200) {
        //     this.$maskoff();
				// 		let legendArr = []
				// 		let datas = []
				// 		let ids = []
				// 		if(this.select_value == "personal") {
				// 			for(let i of res.data.result.result) {
				// 				legendArr.push(i.userName)
				// 				datas.push(i.count)
				// 				ids.push(i.userId)
				// 			}
				// 		} else {
				// 			for(let i of res.data.result.result) {
				// 				legendArr.push(i.deptName)
				// 				datas.push(i.count)
				// 			}
				// 		}
				// 		this.loadChart(legendArr, datas, ids)
				// 	} else {
				// 		this.$warn(data.message);
				// 	}

				// })
			},
			loadHours() {
				this.$maskin();
				let params = new URLSearchParams();
				if(this.dateRange===null || this.dateRange.length == 0) {
					params.append("startDate", "");
					params.append("endDate", "");
					this.date_value = "day"
				} else {
					params.append("startDate", this.dateRange[0]);
					params.append("endDate", this.dateRange[1]);
					this.date_value = "orther"
				}
				params.append("TYPE", this.date_value);
				params.append("selectType", this.select_value);
				if(this.select_value=="personal" && this.selectArr_value){
					params.append("deptId", this.selectArr_value);
				}
				this.$axios.post("/statistical/getStatisticalWorkHours", params).then((res) => {
					let data = res.data;
					if(data.code == 200) {
            this.$maskoff();
						let legendArr = []
						let datas = []
						if(this.select_value == "personal") {
							for(let i of res.data.result.result) {
								legendArr.push(i.userName)
								datas.push(i.count)
							}
						} else {
							for(let i of res.data.result.result) {
								legendArr.push(i.deptName)
								datas.push(i.count)
							}
						}
						this.loadWorkhours(legendArr, datas)
					} else {
						this.$warn(data.message);
					}

				})
			},
			loadChange() {
				this.loadChartsData()
				// this.loadHours()
				this.loadData()
				this.ifshowPerson=false
			},
			goDetail(val, e) {
				e.cancelBubble = true;
				//TODO
			},
			loadWorkhours(legendArr, datas) {
				var echarts = require('echarts');
				let height = document.querySelector(".mainr").offsetHeight;
				let card_header_height = document.querySelector(".el-card__header").offsetHeight;
				let card_body = document.querySelector(".box-card .el-card__body");
				card_body.style.height = height - card_header_height - 36 + "px";
				var proBar = echarts.init(document.getElementById("work-bar")); //人员统计表格
				proBar.clear()
				let option = {
					title: {
						text: '工时统计',
						x: 'center'
					},
					color: ['#3398DB'],
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: legendArr,
						axisLabel: {
							rotate: -45,
						},
						axisTick: {
							alignWithLabel: true
						}
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
						name: '工时统计',
						type: 'bar',
						barWidth: '60%',
						data: datas
					}]
				};
				proBar.setOption(option);


			},
			loadChart(legendArr, datas, ids) {
				var echarts = require('echarts');
				let height = document.querySelector(".mainr").offsetHeight;
				let card_header_height = document.querySelector(".el-card__header").offsetHeight;
				let card_body = document.querySelector(".box-card .el-card__body");
				card_body.style.height = height - card_header_height - 36 + "px";
				var proBar = echarts.init(document.getElementById("pro-bar")); //人员统计表格
				proBar.clear()
				let text="人员统计"
				if(this.select_value=="personal"){
                    text="任务统计"
				}
				let option = {
					title: {
						text: text,
						x: 'center'
					},
					color: ['#3398DB'],
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: [{
						type: 'category',
						data: legendArr,
						axisLabel: {
							rotate: -45,
						},
						axisTick: {
							alignWithLabel: true
						}
					}],
					yAxis: [{
						type: 'value'
					}],
					series: [{
						name: text,
						type: 'bar',
						barWidth: '60%',
						data: datas
					}]
				};
				proBar.setOption(option);
				this.$maskoff();
				var self = this
				proBar.on('click', function(params) {
					let index = params.dataIndex
					self.getPerson(index, ids)
				});
			},
			getPerson(val, ids) {
				if(ids.length > 0) {
					let id = ids[val]
//					this.$maskin();
                    this.ifshowPerson=true
					let params = new URLSearchParams();
					params.append("selectType", "single");
					params.append("selectId", id);
					this.$axios.post("/statistical/getPersonlStatisticalDates", params).then((res) => {
						let data = res.data;
						if(data.code == 200) {
							let yaxis = []
							let start = []
							let end = []
							for(let i of data.result) {
								if(i.endTime && i.startTime) {
									yaxis.push(i.neelName)
									start.push(i.startTime)
									end.push(i.endTime)
								}
							}

							this.loadTimeChart(yaxis, start, end)
						} else {
							this.$warn(data.message);
						}

					})
				}

			},
			loadTimeChart(yaxis, start, end) {

				var echarts = require('echarts');
				let height = document.querySelector(".mainr").offsetHeight;
				let card_header_height = document.querySelector(".el-card__header").offsetHeight;
				let card_body = document.querySelector(".box-card .el-card__body");
				card_body.style.height = height - card_header_height - 36 + "px";
				var proBar = echarts.init(document.getElementById("per-bar")); //人员统计表格
				proBar.clear()
				let option = {}
				option = {
					title: {
						text: '个人工作安排'
					},
					legend: {
						data: ['过期时间']
                    },
					xAxis: {
						type: 'time'
					},
					yAxis: {
						data: yaxis
					},
                    grid:{
					    left:"160px"
					},
					tooltip: {
						trigger: 'axis',
						formatter: function(params) {
							// var res = params[0].name + "</br>"
							// var date0 = params[0].data;
							// var date1 = params[1].data;
							// date0 = date0.getFullYear() + "-" + (date0.getMonth() + 1) + "-" + date0.getDate();
							// date1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
							// res += params[0].seriesName + ":" + date0 + "</br>"
							// res += params[1].seriesName + ":" + date1 + "</br>"
							// return res;
						}
					},
					series: [

						{
							name: '开始时间',
							type: 'bar',
							stack: '总量',
							itemStyle: {
								normal: {
									color: 'rgba(0,0,0,0)'
								}
							},
							data: start
						}, {
							name: '结束时间',
							type: 'bar',
							stack: '总量',
							itemStyle: {
								normal: {
									color: '#52b4f7',
									barBorderRadius: 20,
									shadowColor: 'rgba(0, 0, 0, 0.3)',
									shadowBlur: 20
								}
							},
							data: end
						}
					]
				};
				proBar.setOption(option);
				 this.$maskoff();
			},//跳转到需求页面
			goneeds(e, val) {
				e.cancelBubble = true;
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
