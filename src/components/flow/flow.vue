<style scoped>
    @import "../../static/css/console.css";

    .console-tab-wrapper {
        position: absolute;
        min-height: 280px;
        box-shadow: 1px 1px 10px #ccc;
    }

    .console-tab-content {
        padding: 30px;
    }

    .flow-btn {
        display: inline-block;
        padding: 0 15px;
        height: 40px;
        line-height: 40px;
        color: white;
        background: #5b9cd6;
        text-align: center;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
        border-radius: 50px;
        vertical-align: middle;
        margin: 10px 0;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .flow-icon {
        display: inline-block;
        vertical-align: middle;
        height: 40px;
        line-height: 40px;
        margin: 0 5px;
        color: #c5c8cd;
    }

    p.tip {
        color: #a5a5a5;
    }

    .flowWarp {
        display: inline-block;
        vertical-align: middle;
    }

    .static {
        padding: 10px;
        background: #f5f5f5;
    }

    .static .flow-btn {
        margin-right: 10px;
    }

    .activeWrap {
        min-height: 60px;
    }
</style>

<template>
    <div class="console-tab-wrapper" :style="consoleStyle">
        <el-tabs v-model="tabs.activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="业务需求" name="ywxq_flow">
                <div class="console-tab-content">
                    <p class="tip">注：拖下去某个部门节点即可删除流程节点</p>
                    <div class="activeWrap"
                         @dragenter="a_dragenterEvent">
                        <div class="flowWarp" v-for="(item, index) in ywxq_flow" :key="index">
                        <span class="flow-btn" draggable="true"
                              @dragstart="dragstartEvent($event,index)"
                              @dragend="dragendEvent"
                              @dragover="dragoverEvent"
                        >{{item.name}}</span>
                            <i :style='{opacity:index+1 == ywxq_flow.length?0:1}'
                               class="flow-icon icon-msnui-arrow-right iconfont"
                               @dragenter="i_dragenterEvent($event,index)"
                               @dragleave="i_dragleaveEvent($event,index)"
                               @dragend="i_dragoverEvent"
                               @dragover="i_dragoverEvent"
                            ></i>
                        </div>
                    </div>
                    <div class="static">
                        <p class="tip">注：把部门拖到上面两个流程中间即可添加进入流程节点</p>
                        <span v-for="(item, index) in flow_static" class="flow-btn" draggable="true" :key="index"
                              @dragstart="s_dragstartEvent($event,index)"
                              @dragend="dragendEvent"
                        >{{item.name}}</span>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="技术需求" name="jsxq_flow">
                <div class="console-tab-content">
                    <p class="tip">注：拖下去某个部门节点即可删除流程节点</p>
                    <div class="activeWrap"
                         @dragenter="a_dragenterEvent">
                        <div class="flowWarp" v-for="(item, index) in jsxq_flow" :key="index">
                        <span class="flow-btn" draggable="true"
                              @dragstart="dragstartEvent($event,index)"
                              @dragend="dragendEvent"
                              @dragover="dragoverEvent"
                        >{{item.name}}</span>
                            <i :style='{opacity:index+1 == jsxq_flow.length?0:1}'
                               class="flow-icon icon-msnui-arrow-right iconfont"
                               @dragenter="i_dragenterEvent($event,index)"
                               @dragleave="i_dragleaveEvent($event,index)"
                               @dragend="i_dragoverEvent"
                               @dragover="i_dragoverEvent"
                            ></i>
                        </div>
                    </div>
                    <div class="static">
                        <p class="tip">注：把部门拖到上面两个流程中间即可添加进入流程节点</p>
                        <span v-for="(item, index) in flow_static" :key="index" class="flow-btn" draggable="true"
                              @dragstart="s_dragstartEvent($event,index)"
                              @dragend="dragendEvent"
                        >{{item.name}}</span>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="日常任务（产品部）" name="rcrw_cpjl_flow">
                <div class="console-tab-content">
                    <p class="tip">注：拖下去某个部门节点即可删除流程节点</p>
                    <div class="activeWrap"
                         @dragenter="a_dragenterEvent">
                        <div class="flowWarp" v-for="(item, index) in rcrw_cpjl_flow" :key="index">
                        <span class="flow-btn" draggable="true"
                              @dragstart="dragstartEvent($event,index)"
                              @dragend="dragendEvent"
                              @dragover="dragoverEvent"
                        >{{item.name}}</span>
                            <i :style='{opacity:index+1 == rcrw_cpjl_flow.length?0:1}'
                               class="flow-icon icon-msnui-arrow-right iconfont"
                               @dragenter="i_dragenterEvent($event,index)"
                               @dragleave="i_dragleaveEvent($event,index)"
                               @dragend="i_dragoverEvent"
                               @dragover="i_dragoverEvent"
                            ></i>
                        </div>
                    </div>
                    <div class="static">
                        <p class="tip">注：把部门拖到上面两个流程中间即可添加进入流程节点</p>
                        <span v-for="(item, index) in flow_static" class="flow-btn" draggable="true" :key="index"
                              @dragstart="s_dragstartEvent($event,index)"
                              @dragend="dragendEvent"
                        >{{item.name}}</span>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="日常任务（技术管理部）" name="rcrw_jsjl_flow">
                <div class="console-tab-content">
                    <p class="tip">注：拖下去某个部门节点即可删除流程节点</p>
                    <div class="activeWrap"
                         @dragenter="a_dragenterEvent">
                        <div class="flowWarp" v-for="(item, index) in rcrw_jsjl_flow" :key="index">
                        <span class="flow-btn" draggable="true"
                              @dragstart="dragstartEvent($event,index)"
                              @dragend="dragendEvent"
                              @dragover="dragoverEvent"
                        >{{item.name}}</span>
                            <i :style='{opacity:index+1 == rcrw_jsjl_flow.length?0:1}'
                               class="flow-icon icon-msnui-arrow-right iconfont"
                               @dragenter="i_dragenterEvent($event,index)"
                               @dragleave="i_dragleaveEvent($event,index)"
                               @dragend="i_dragoverEvent"
                               @dragover="i_dragoverEvent"
                            ></i>
                        </div>
                    </div>
                    <div class="static">
                        <p class="tip">注：把部门拖到上面两个流程中间即可添加进入流程节点</p>
                        <span v-for="(item, index) in flow_static" class="flow-btn" draggable="true" :key="index"
                              @dragstart="s_dragstartEvent($event,index)"
                              @dragend="dragendEvent"
                        >{{item.name}}</span>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="基础建设" name="jcjs_flow">
                <div class="console-tab-content">
                    <p class="tip">注：拖下去某个部门节点即可删除流程节点</p>
                    <div class="activeWrap"
                         @dragenter="a_dragenterEvent">
                        <div class="flowWarp" v-for="(item, index) in jcjs_flow" :key="index">
                        <span class="flow-btn" draggable="true"
                              @dragstart="dragstartEvent($event,index)"
                              @dragend="dragendEvent"
                              @dragover="dragoverEvent"
                        >{{item.name}}</span>
                            <i :style='{opacity:index+1 == jcjs_flow.length?0:1}'
                               class="flow-icon icon-msnui-arrow-right iconfont"
                               @dragenter="i_dragenterEvent($event,index)"
                               @dragleave="i_dragleaveEvent($event,index)"
                               @dragend="i_dragoverEvent"
                               @dragover="i_dragoverEvent"
                            ></i>
                        </div>
                    </div>
                    <div class="static">
                        <p class="tip">注：把部门拖到上面两个流程中间即可添加进入流程节点</p>
                        <span v-for="(item, index) in flow_static" class="flow-btn" draggable="true" :key="index"
                              @dragstart="s_dragstartEvent($event,index)"
                              @dragend="dragendEvent"
                        >{{item.name}}</span>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export  default {
        data(){
            return {
                consoleStyle:{
                    width:""
                },
                ywxq_flow: [
                    {name: "产品部"},
                    {name: "技术管理部"},
                    {name: "开发部"},
                    {name: "开发/测试"},
                    {name: "产品部/需求来源方"}
                ],
                jsxq_flow: [
                    {name: "开发部"},
                    {name: "技术管理部"},
                    {name: "开发部"},
                    {name: "开发/测试"},
                    {name: "开发部/需求来源方"}
                ],
                jcjs_flow: [
                    {name: "基础开发部"},
                    {name: "技术管理部"},
                    {name: "基础开发部"},
                    {name: "开发/测试"},
                    {name: "基础开发部/需求来源方"}
                ],
                rcrw_jsjl_flow: [
                    {name: "开发部"},
                    {name: "技术负责人"},
                    {name: "系统管理部"},
                    {name: "开发"},
                    {name: "开发部/需求来源方"}
                ],
                rcrw_cpjl_flow: [
                    {name: "产品部"},
                    {name: "技术管理部"},
                    {name: "开发部"},
                    {name: "技术负责人"},
                    {name: "系统管理部"},
                    {name: "开发"},
                    {name: "产品部/需求来源方"}
                ],
                flow_static: [
                    {name: "产品部"},
                    {name: "开发部"},
                    {name: "基础开发部"},
                    {name: "技术管理部"},
                    {name: "系统管理部"},
                    {name: "技术负责人"},
                    {name: "开发"},
                    {name: "测试"},
                    {name: "开发/测试"},
                    {name: "产品部/需求来源方"},
                    {name: "开发部/需求来源方"},
                    {name: "基础开发部/需求来源方"}
                ],
                tabs: {
                    activeName: "ywxq_flow"
                },
                active_flow_name:"",//当前拖拽的
                dragType: "",//当前拖拽的组名“static”是下面的，“flow”是上面的
                flowLength: "",//拖拽的时候上面的长度，用来判断变化情况
                flowStaticLength: "",//拖拽的时候下面面的长度，用来判断变化情况
                activeTarget: "",//当前拖拽的活动的项
                activeIndex: "",//当前拖拽的活动的项的索引
            }
        },
        mounted(){
            this.calculate()
        },
        methods: {
            calculate(){
                let width = window.innerWidth;
                this.consoleStyle.width = width-224-34+"px"
            },
            handleClick(){

            },
            dragstartEvent(e, index){
                this.active_flow_name = this.tabs.activeName;
                this.flowLength = this[this.active_flow_name].length;
                this.flowStaticLength = this.flow_static.length;
                this.activeTarget = this[this.active_flow_name].splice(index, 1)[0];
                this.activeIndex = index;
                this.dragType = this.active_flow_name;
            },
            s_dragstartEvent(e, index){
                this.active_flow_name = this.tabs.activeName;
                this.flowLength = this[this.active_flow_name].length;
                this.flowStaticLength = this.flow_static.length;
                this.activeTarget = this.flow_static.splice(index, 1)[0];
                this.activeIndex = index;
                this.dragType = "static";
            },
            dragendEvent(e){
                e.preventDefault();
                if (this[this.active_flow_name].length != this.flowLength) {//当前判断上面流程有变化
//                    //当前是从下面往上拖拽，添加流程
//                    if (this.dragType == "static") {
//                        this.flow_static.splice(this.activeIndex, 0, this.activeTarget);
//                    }
                    //当前是流程自己改变顺序
                    if (this.dragType == this.active_flow_name) {
                        this.flow_static.push(this.activeTarget)
                    }
                }
                if (this[this.active_flow_name].length == this.flowLength && this.flowStaticLength != this.flow_static.length) {
                    //当前是无效的拖拽
                    this.flow_static.push(this.activeTarget)
                }
            },
            dragoverEvent(e){
                e.preventDefault();
            },
            i_dragenterEvent(e, index){
                //上面没有且要从第一个开始新增，return防止无限复制
                if (this.flowLength == 0) {
                    return;
                }
                this[this.active_flow_name].splice(index + 1, 0, this.activeTarget);
                e.preventDefault()
            },
            i_dragleaveEvent(e, index){
                this[this.active_flow_name].splice(index + 1, 1);
            },
            i_dragoverEvent(e){
                e.preventDefault();
            },
            a_dragenterEvent(){
                if (this.dragType == "static" && this[this.active_flow_name].length == 0) {
                    this[this.active_flow_name].push(this.activeTarget)
                }
            }
        }
    }
</script>
