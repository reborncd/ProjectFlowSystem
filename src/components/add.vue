<style>

</style>

<template>
    <div>
        <el-select v-model="value" placeholder="请选择" filterable>
            <el-option
                    v-for="item in options"
                    :key = "item.menu_id"
                    :label="item.menu_name"
                    :value="item.menu_id">
            </el-option>
        </el-select>
        <el-input v-model="input" placeholder="请输入页面名称或者操作名称"></el-input>
        <el-input v-model="url" placeholder="请输入路由"></el-input>
        <el-radio v-model="radio" label="0">操作</el-radio>
        <el-radio v-model="radio" label="1">页面</el-radio>
        <el-button type="primary" @click="tjiao">提交</el-button>
    </div>
</template>

<script>
export default {
    data(){
        return {
            options:[],
            input:"",
            url:"",
            value:"",
            radio:""
        }
    },
    mounted(){
        let params = new URLSearchParams();
        this.$axios.post("role/allMenu",params).then((res)=>{
            this.options = res.data.result
        })
    },
    methods:{
        tjiao(){
            let params = new URLSearchParams();
            params.append("menu_fid",this.value);
            params.append("menu_name",this.input);
            params.append("menu_url",this.url);
            params.append("menu_action",this.radio);
            this.$axios.post("role/addMenu",params).then((res)=>{
                if(res.data.code == 200){
                    this.$success("成功")
                }else{
                    this.$err("失败")
                }
            })
        }
    }
}
</script>
