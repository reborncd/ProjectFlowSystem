<style>
    .schedule-box {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    #schedule-box {
        /*width: 320px;*/
        margin: 0 auto;
        padding: 12px 10px;
        font-size: 14px;
    }

    .schedule-box .schedule-hd {
        display: flex;
        justify-content: space-between;
        padding: 0 15px;
        line-height: 40px;
    }

    .schedule-box .today {
        flex: 1;
        text-align: center;
    }

    .schedule-box .ul-box {
        overflow: hidden;
    }

    .schedule-box .ul-box > li {
        float: left;
        width: 14.28%;
        text-align: center;
        padding: 5px 0;
    }

    .schedule-box .other-month {
        color: #999999;
    }

    .schedule-box .current-month {
        color: #333333;
    }

    .schedule-box .today-style {
        border-radius: 50%;
        background: #58d321;
    }

    .schedule-box .arrow {
        cursor: pointer;
    }

    .schedule-box .dayStyle {
        display: inline-block;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        text-align: center;
        line-height: 25px;
        cursor: pointer;
    }

    .schedule-box .current-month > .dayStyle:hover {
        background: #00BDFF;
        color: #ffffff;
    }

    .schedule-box .today-flag {
        background: #00C2B1;
        color: #fff;
    }

    .schedule-box .boxshaw {
        box-shadow: 2px 2px 15px 2px #e3e3e3;
    }

    .schedule-box .selected-style {
        background: #00BDFF;
        color: #ffffff;
    }

    .schedule-box .task-style {
        background: #f15b34;
        color: #ffffff;
    }

    .schedule-box #h3Ele {
        text-align: center;
        padding: 10px;
    }
    .anticon{
      color: #777;
    }
</style>

<template>
    <div id='schedule-box' class="schedule-box">
      <div class="schedule-hd">
          <i title="上一年" class="anticon icon-doubleleft" @click="prevYearFun"></i>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <i title="上一月" class="anticon icon-left" @click="prevMonthFun"></i>
        <div class="today">{{nowDate}}</div>
          <i title="下一月" class="anticon icon-right" @click="nextMonthFun"></i>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <i title="下一年" class="anticon icon-doubleright" @click="nextYearFun"></i>
      </div>
      <ul class="week-ul ul-box"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul>
      <ul class="schedule-bd ul-box">
        <li :class="item.liclass" v-for="(item, index) in showData" :key="index" @click="selectDate(item.fullValue)">
          <span :title="item.fullValue" :class="item.spanclass">{{item.value}}</span>
        </li>
      </ul>
    </div>
</template>

<script>
    import moment from 'moment';
    export default {
        data(){
            return {
              year: '',
              month: '',
              day: '',
              currentYear: '',
              currentDay: '',
              currentMonth: '',
              nowDate: '',
              showData: [] // liclass, spanclass, value
            }
        },
        props: {
          todoTaskDateList: []
        },
        mounted() {
          this.init();
          this.initData();
        },
        watch: {
          todoTaskDateList: function(){
            this.initData();
          }
        },
        methods: {
          init(){
            let nowdate = moment();
            this.year = this.currentYear = nowdate.year();
            this.month = this.currentMonth = nowdate.month();
            this.day = this.currentDay = nowdate.date();
          },
          initData(){
            this.nowDate = moment((new Date(this.year, this.month, this.day)).getTime()).format('YYYY-MM-DD');
            let fullDay = new Date(this.year, this.month + 1, 0).getDate(), //当月总天数
                startWeek = new Date(this.year, this.month, 1).getDay(), //当月第一天是周几
                total = (fullDay + startWeek) % 7 == 0 ? (fullDay + startWeek) : fullDay + startWeek + (7 - (fullDay + startWeek) % 7),//元素总个数
                lastMonthDay = new Date(this.year, this.month, 0).getDate(), //上月最后一天
                eleData = [];
            for (let i = 0; i < total; i++) {
                if (i < startWeek) {
                  eleData.push({
                    liclass: 'other-month',
                    spanclass: 'dayStyle',
                    value: lastMonthDay - startWeek + 1 + i,
                    fullValue: this.month === 0?
                      this.formartDate(this.year - 1, 12, lastMonthDay - startWeek + 1 + i, '-')
                      :this.formartDate(this.year, this.month, lastMonthDay - startWeek + 1 + i, '-')
                  });
                } else if (i < (startWeek + fullDay)) {
                    let addClass = '', selectedDate;
                    let fullValue = this.formartDate(this.year, this.month + 1, (i + 1 - startWeek), '-')
                    this.year == this.currentYear && this.month == this.currentMonth && i + 1 - startWeek == this.currentDay && (addClass = 'today-flag');
                    i + 1 - startWeek == this.day && (addClass = 'selected-style');
                    this.todoTaskDateList.indexOf(fullValue) > -1 && (addClass = 'task-style');
                    eleData.push({
                      liclass: 'current-month',
                      spanclass: `currentDate dayStyle ${addClass}`,
                      value: i + 1 - startWeek,
                      fullValue
                    });
                } else {
                  eleData.push({
                    liclass: 'other-month',
                    spanclass: 'dayStyle',
                    value: (i + 1 - (startWeek + fullDay)),
                    fullValue: this.month === 11?
                      this.formartDate(this.year + 1, 1, (i + 1 - (startWeek + fullDay)), '-')
                      :this.formartDate(this.year, this.month + 2, (i + 1 - (startWeek + fullDay)), '-')
                  });
                }
            }
            console.log(eleData)
            this.showData = eleData;
          },
          formartDate(y, m, d, symbol) {
              symbol = symbol || '-';
              m = (m.toString())[1] ? m : '0' + m;
              d = (d.toString())[1] ? d : '0' + d;
              return y + symbol + m + symbol + d
          },
          nextMonthFun() {
              if (this.month + 1 > 11) {
                  this.year += 1;
                  this.month = 0;
              } else {
                  this.month += 1;
              }
              this.initData();
          },
          nextYearFun() {
              this.year += 1;
              this.initData();
          },
          prevMonthFun() {
              if (this.month - 1 < 0) {
                  this.year -= 1;
                  this.month = 11;
              } else {
                  this.month -= 1;
              }
              this.initData();
          },
          prevYearFun() {
              this.year -= 1;
              this.initData();
          },
          selectDate(data){
            let selectData = moment(data, 'YYYY-MM-DD');
            this.year = selectData.year();
            this.month = selectData.month();
            this.day = selectData.date();
            this.initData();
          }
        }
    }
</script>
