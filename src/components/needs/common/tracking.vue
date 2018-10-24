<style>

</style>

<template>
    <div>
        <ul class="tracking-wrapper clear">
            <li class="fl clear" v-for="(item, index) in tracking.data" :key="index"
                @mouseover="tracking.hoverIndex = index;" @mouseleave="tracking.hoverIndex = ''"
                :class="{'not':item.view_TYPE == 2}">
                <div class="content fl">
                    <p class="action">{{item.view_SUBJECT}}</p>
                    <p class="date">{{item.view_DATE}}</p>
                    <div class="info-wrapper">
                        <p style="text-align:left;" class="info" v-for="(_item, index) in item.view_DESC" :title="_item" :key="index">
                            <span v-html="$options.filters.replace(_item)"></span>
                        </p>
                        
                    </div>
                </div>
                <div class="fl icon-wrapper"><i class="iconfont icon-right-arrow" v-if="index != tracking.data.length-1"></i></div>
                <!--<div v-if="index == tracking.hoverIndex && tracking.hoverIndex != ''" class="hover-wrap">-->
                    <!--<p  class="genzong" v-for="_item in item.infos"><span style="display: inline-block;width: 30px;">{{index+1}}.</span> {{_item}}</p>-->
                <!--</div>-->
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        props:["tracking"],
        data(){
            return {

            }
        },
        filters:{
          replace(val){
            return val.replace(/,/g,"<br />");
          },
        },
        methods: {

        }
    }
</script>
