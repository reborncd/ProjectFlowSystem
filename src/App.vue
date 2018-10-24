<style>
    ::-webkit-scrollbar {
        width: 5px;
        height: 10px;
    }

    ::-webkit-scrollbar-track-piece {
        background-color: #f7f7f7;
    }

    ::-webkit-scrollbar-thumb:vertical {
        height: 5px;
        background-color: #b8bfc7;
        -webkit-border-radius: 6px;
    }

    /*定义滚动条的轨道，内阴影及圆角*/
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
        border-radius: 10px;
        background-color: #f7f7f7;
    }

    /*定义滑块，内阴影及圆角*/
    ::-webkit-scrollbar-thumb {
        /*width: 10px;*/
        height: 20px;
        border-radius: 10px;
        background-color: #b8bfc7;
    }
    .el-date-table td.today span{
        color: #fff;
        background: #409EFF;
    }
</style>

<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data(){
          return {

          }
        },
        mounted(){

        },
        methods: {

        }
    }
</script>