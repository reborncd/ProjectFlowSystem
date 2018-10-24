// 数据字段对应, 提示与描述文字的仓库

const onlineTip = {
  main: {
    CHANGE_OBJECT_ID: '变更对象',
    OPER_TYPE_ID: '操作类型',
    BUSINESS_EFFECT_ID: '业务影响',
    CHANGE_SUPPORT_ID: '支持部门',
    CHANGE_REASON: '变更原因',
    CHANGE_DESC: '变更概述',
    RISK_ID: '风险等级',
    IS_INHERE_FUNC: '是否对原有功能无影响',
    IS_EXPECT_TARGET: '是否功能达到预期目标',
    IS_DEV_TEST_EQ: '是否测试与生成环境一致',
    RISK_CONTENT: '风险内容',
    CHANGE_SUPPORT_CONTENT: '变更支持内容',
    RISK_SOLUTION: '控制措施',
    BUSINESS_EFFECT_REMARK: '业务影响, 其它选项说明',
    CHANGE_OBJECT_REMARK: '变更对象, 其它选项说明',
    OPER_TYPE_REMARK: '操作类型, 其它选项说明',
    RISK_REMARK: '风险说明',
    CHANGE_TEST_REMARK: '变更测试结果说明',
    CHANGE_TYPE: '变更类型',
    URGENT_DESC: '紧急原因',
  },
  addedCommon: {
    MODULE: '上线模块',
    CONTENT: '上线内容',
    EXPECT_ONLINE_TIME: '预计上线时间',
    IS_TRADE: '是否暂停交易',
    EFFECT_TIME: '影响时间(分钟)',
    ATTACHMENT_ID: '上传附件',
  },
  addedFetch: {
    SYSTEM_ID: '',
    SUB_SYSTEM_ID: '',
    VERSION_ID: '',
    PROJECT_MANAGER_ID: '',
    PROJECT_MANAGER: '',
    PROD_MANAGER_ID: '',
    PROD_MANAGER: '',
    DEV_MANAGER_ID: '',
    DEV_MANAGER: '',
    TEST_MANAGER_ID: '',
    TEST_MANAGER: '',
    ID: '',
  },
  addedInput: {
    SYSTEM_DATA: '系统及子系统',
    PROJECT_MANAGER_DATA: '项目负责人',
    PROD_MANAGER_DATA: '产品负责人',
    DEV_MANAGER_DATA: '开发负责人',
    TEST_MANAGER_DATA: '测试负责人',
  },
  onlineConfirm: {
    releaseManagerData: '发布负责人',
    onlineResult: '上线结果',
    // releaseOperTime: '操作日期时间',
    releaseOperRemark: '操作说明'
  },
  onlineConfirmMust: {
    realOnlineTime: '实际上线时间',
  },
}

onlineTip.mainKeys = Object.keys(onlineTip.main);
onlineTip.addedInput = {...onlineTip.addedInput, ...onlineTip.addedCommon};
onlineTip.addedFetch = {...onlineTip.addedFetch, ...onlineTip.addedCommon};
onlineTip.addedInputKeys = Object.keys(onlineTip.addedInput);
onlineTip.addedFetchKeys = Object.keys(onlineTip.addedFetch);
onlineTip.onlineConfirmKeys = Object.keys(onlineTip.onlineConfirm);

export { onlineTip };
