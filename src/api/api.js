import { postXwww, postForm, postJson, get } from './axios.js'

// 雇员中心
export const start = params => get('/sys/worker/check/exam/start', params) // 雇员认证-实名合格
export const answer = params => postXwww('/sys/worker/check/answer', params) // 雇员认证-实名合格操作答题
export const auditInfoList = params => get('/sys/worker/skill/list', params) // 雇员认证-理论测试-档案审核-未通过 /专家中心测评列表/培训中列表
export const modifyPid = params => postXwww('/sys/worker/check/modifyPid', params) // 雇员认证-更改答题类型- 育婴月嫂等
export const lookAnswer = params => postXwww('/sys/worker/exam/answer', params) // 雇员认证-查看答题卡(talentAudit--lookDg())
export const reAnswer = params => postXwww('/sys/worker/check/reAnswer', params) // 雇员认证-查看答题卡重新测试(talentAudit--lookDg())
export const auditInfo = params => postJson('/sys/worker/check/info', params) // 雇员认证-档案审核-操作
export const drill = params => get('/sys/worker/check/drill', params) // 雇员认证-档案审核-培训
export const delWorkExp = params => postXwww('/sys/worker/check/del', params) // 雇员认证-档案审核-删除阿姨工作经历
export const addList = params => get('/sys/worker/photo/list', params) // 新增审核列表
export const checkImg = params => get('/sys/worker/photo/check', params) // 新增审核列表-通过-不通过
export const fail = params => postXwww('/sys/worker/check/exam/fail', params) // 雇员认证-右侧考试未通过-平台进行设置的未通过
export const summaryList = params => postXwww('/sys/worker/list', params) // 雇员总表所有状态
export const modifyStatus = params => postXwww('/sys/worker/modifyStatus', params) // 雇员总表更改状态
export const modifySalary=params =>postForm('/sys/worker/modifySalary', params) // 雇员认证-调整薪资
// export const seek = params => postJson('/common/worker/seek/get', params) // 雇员总表-筛选条件 --未开始


// 元数据-detail详细信息
export const auditInterface = params => get('/sys/worker/check/list', params) // 初审(delete)
export const techInterface = params => get('/sys/metadata/list', params) // 获取所有元数据（认证技能）
export const getDetail = params => postJson('/sys/worker/getDetail', params) // 阿姨详细信息

export const employee = params => get('/sys/employee/get', params) // 获取审核人员列表
export const dispathEmployee = params => get('/sys/worker/dispatch', params) // 分配给员工审核把此阿姨

// 专家中心
export const addAnswer = params => postJson('/sys/worker/assessor/addAnswer', params) // 专家测评-打分
export const questionList = params => postXwww('/sys/service/question/get', params) // 服务反馈列表
export const replyAnswer = params => postXwww('/sys/service/question/addAnswer', params) // 服务反馈-回复内容
export const updateQuestionList = params => postXwww('/sys/service/question/update', params) // 转为专家处理

// 人才测评--题库 
export const exam = params => postXwww('/sys/exam/get', params) // 获取理论测试题
export const delExam = params => postForm('/sys/exam/delete', params) // 删除理论测试题
export const addExam = params => postForm('/sys/exam/add', params) // 添加理论测试题
export const updateExam = params => postForm('/sys/exam/update', params) // 更改理论测试题
export const modifySmallType = params => postXwww('/sys/metadata/modifyServiceSmType', params) // 更改服务类型小类型信息
export const modifySmallBatch = params => postJson('/sys/metadata/modifyServiceSmTypeBatch', params) // 出题规则
export const updateSmallBatch = params => postJson('/sys/metadata/update', params) // 出题规则
export const importExcell = params => postForm('/sys/exam/upload', params) // 导入题库

// 员工端登录
export const toLogin = params => postXwww('/sys/user/login', params)

// 文件统一上传

export const del = params => postXwww('/worker/visa/del', params) //删除 - 签证、通行证证件
// export const uploadFiles = params => postForm('/fileup/photo', params) //单传模式

// 雇主中心 订单处理 - 未发布、发布及备注、智能匹配
export const demandList = params => postJson('/sys/order/demand/list', params) // 订单处理-未发布、处理中 列表
export const updateStatus = params => postJson('/sys/order/status/update', params) // 修改订单状态-设为无效、设为丢单、终止订单、解约
export const updateExitOrder = params => postJson('/sys/order/agreement/deto/addOrModify', params) // 添加及修改-出户单合同
export const publish = params => postJson('/sys/order/demand/publish', params) // 订单处理-发布
export const match = params => postJson('/sys/order/demand/match', params) // 订单处理-智能匹配
export const remark = params => postJson('/sys/order/demand/remark', params) // 订单处理-备注信息
export const workers = params => postJson('/sys/order/worker/workers', params) // 订单处理-添加雇员列表
export const addWorkers = params => postJson('/sys/order/worker/addOrModify', params) // 订单处理-添加雇员
export const service = params => postJson('/sys/order/worker/service', params) // 订单处理-雇员信息与列表
export const interviewList = params => postJson('/sys/order/interview/list', params) // 订单处理-面试列表
export const addInterview = params => postJson('/sys/order/interview/add', params) // 订单处理-添加面试
export const delInterview = params => postJson('/sys/order/interview/del', params) // 订单处理-删除面试
export const getAgreement = params => postJson('/sys/order/agreement/get', params) // 订单处理-获取订单合同展示添加信息 - 左侧滑出的
export const addOrModify = params => postJson('/sys/order/agreement/addOrModify', params) // 订单处理-添加及修改合同
export const addOrModifyRenew = params => postJson('/sys/order/agreement/addOrModifyRenew', params) // 订单处理-续签合同
export const getInvoice = params => postJson('/sys/order/mail/invoice/get', params) // 订单发票
export const modifyInvoice = params => postJson('/sys/order/mail/invoice/modify/status', params) // 更改发票状态

/**环信聊天 */
export const getUserInfo= params => get('/rim/user/get', params) 
export const getUserNickName= params => postForm('/user/getHXInfo', params) 

/**订单出路模块 */

export const allotAdvisor = params => postJson('/sys/order/demand/adddocumentary', params)//分配顾问
export const serchOrder = params => postJson('/sys/order/demand/search', params)//订单处理搜索
export const getPays = params => postJson('/sys/order/pay/get', params)//获取订单处理详情支付信息
export const getOperats = params => postJson('/sys/order/operatehistory/get', params)//获取订单操作日志


/**财务报表模块 */
export const getTrainFreeList=params=> postJson('/sys/finance/list',params)//财富报表，获取培训费列表
export const getIncomes=()=> postJson('/sys/finance/income')//财富报表，获取收入数据
export const refund=(params)=> postJson('/sys/finance/refund',params)//财富报表，申请退款
export const getAudit=(params)=> postJson('/sys/finance/audit',params)//财富报表，订单审核列表
export const getSpend=(params)=> postJson('/sys/finance/spend',params)//财富报表，支出审核列表
export const agreeBack=(params)=> postJson('/sys/finance/agree',params)//财富报表，支出审核同意退款
export const checkOut=(params)=> postJson('/sys/finance/settle',params)//财富报表，支出审核工资结算
export const getSettleTody=(params)=> postJson('/sys/finance/settle/today',params)//今日员工工资结算
export const getSettleSeven=(params)=> postJson('/sys/finance/settle/seven',params)//七日内员工工资结算
export const payOut=(params)=> postJson('/sys/finance/payok',params)//员工工资结算已支付

/*系统管理模块*/
export const getUserList=(params)=>get('/sys/user/list',params)//获取系统管理用户列表
export const addUserList=(params)=>postJson('/sys/user/add',params)//添加系统管理用户列表
export const editUserList=(params)=>postJson('/sys/user/modify',params)//修改系统管理用户列表
export const modifyUserStatus=(params)=>postJson('/sys/user/modifyStatus',params)//修改系统管理用户状态
export const modifyUserPwd=(params)=>postJson('/sys/user/modifyPwd',params)//修改系统管理用户密码
export const getRoles=()=>get('/sys/role/list')//获取管理员用户角色列表
export const getPowers=()=>get('/sys/menu/list')//获取管理员用户菜单权限列表
export const addRoles=(params)=>postJson('/sys/role/add',params)//添加管理员用户角色
export const editRoles=(params)=>postJson('/sys/role/modify',params)//修改管理员用户角色
export const getMenuById=(params)=>get('/sys/role_menu/list',params)//根据角色id获取对应的菜单
