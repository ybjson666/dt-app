import store from '../store/index'
// 省市
const arr = ["北京", "天津", "上海", "重庆", "河北", "山西", "辽宁", "吉林", "黑龙江", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南", "广东", "海南", "四川", "贵州", "云南", "陕西", "甘肃", "青海", "台湾", "内蒙古", "广西", "西藏", "宁夏", "新疆", "香港",
"澳门", "国外"]
// 生肖
const arr2 = ["猴", "鸡", "狗", "猪", "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊"]
// 元数据对应的id name
const arr3 = JSON.parse(localStorage.getItem('tabKey'))
// 获取所有元数据
const list = store.getters.getSysMetaData
// console.log(list)
const errorimg = 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'
export default {
    errorimg,
    arr,
    arr2,
    list,
    province: function (idx) {
        for(var i = 0; i<arr.length; i++){
            if(idx === i){
                return arr[i]
            }
        }
    },
    chineseZodiac: function (idx) {
        for(var i = 0; i<arr.length; i++){
            if(idx === i){
                return arr2[i]
            }
        }
    },
    tabKey: function (idx) {
        let Arr = (idx+'').split(',')
        let newArr = Arr.map(item =>{
            return arr3[item]
        })
        return newArr+''
    },
    // 根据id获取名字
    getName: function (idx) {
        for(var i = 0; i < store.getters.getSysMetaData.length; i++){
            if(idx == store.getters.getSysMetaData[i].id){
                return store.getters.getSysMetaData[i].name
            }
        }
    },
    // 根据名字获取id
    getId: function (name) {
        for(var i = 0; i < store.getters.getSysMetaData.length; i++){
            if(name == store.getters.getSysMetaData[i].name){
                return store.getters.getSysMetaData[i].id
            }
        }
    },
    // 获取题目小类名字
    getSubName: function (idx1,idx2) {
        for(var i = 0; i<store.getters.getSysMetaData.length; i++){
            if(idx1 == store.getters.getSysMetaData[i].id){
                // var name1 = list[i].name
                var chld = store.getters.getSysMetaData[i].smData
                // if(list[i].smData != 'null'){
                if(chld){
                    for(var j = 0; j<store.getters.getSysMetaData[i].smData.childType.length; j++){
                        if(idx2 == store.getters.getSysMetaData[i].smData.childType[j].id){
                            return store.getters.getSysMetaData[i].smData.childType[j].name
                        }
                    }
                }
            }
        }
    },
    // 获取题目小类id
    getSubId: function (name1,name2) {
        for(var i = 0; i<store.getters.getSysMetaData.length; i++){
            if(name1 == store.getters.getSysMetaData[i].name){
                // var name1 = list[i].name
                var chld2 = store.getters.getSysMetaData[i].smData
                // if(list[i].smData != 'null'){
                if(chld2){
                    for(var j = 0; j<store.getters.getSysMetaData[i].smData.childType.length; j++){
                        if(name2 == store.getters.getSysMetaData[i].smData.childType[j].name){
                            return store.getters.getSysMetaData[i].smData.childType[j].id
                        }
                    }
                }
            }
        }
    },
    // 012-abc
    getLetter: function (idx) {
        let letterArr = (idx+'').split(',')
        let letters = {'0':'A','1':'B','2':'C','3':'D','4':'E','5':'F','6':'G'}
        let newArr = letterArr.map(item =>{
            return letters[item]
        })
        return newArr.sort().join(',')
    },
    // abc-012
    getLetterNum: function (idx) {
        let letterArr = idx
        let letters = {'A':'0','B':'1','C':'2','D':'3','E':'4','F':'5','G':'6'}
        let newArr = letterArr.map(item =>{
            return letters[item]
        })
        return newArr+''
    },
    // 时间格式化
    formatDateTime: function (date) {
        const dt = new Date(date)
        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1 + '').padStart(2, '0')
        const d = (dt.getDate() + '').padStart(2, '0')
        const hh = (dt.getHours() + '').padStart(2, '0')
        const mm = (dt.getMinutes() + '').padStart(2, '0')
        const ss = (dt.getSeconds() + '').padStart(2, '0')
        return `${y}.${m}.${d} ${hh}:${mm}:${ss}`
    },
    // 时间戳转换
    timestampToTime: function (timestamp) {
        const dt = new Date((timestamp+'').length > 10 ?timestamp:timestamp*1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1 + '').padStart(2, '0')
        const d = (dt.getDate() + '').padStart(2, '0')
        const hh = (dt.getHours() + '').padStart(2, '0')
        const mm = (dt.getMinutes() + '').padStart(2, '0')
        const ss = (dt.getSeconds() + '').padStart(2, '0')
        return `${y}年${m}月${d}日 ${hh}:${mm}`
    },
    // 本周 周一start 周末end
    showdate: function () {
        var now=new Date();
        var start=new Date();
        var end=new Date();
        var n=now.getDay();
        start.setDate(now.getDate()-n+1);
        end.setDate(now.getDate()-n+7);
        start = start.getFullYear() + "-" + (start.getMonth()+1) + "-" + start.getDate();
        end = end.getFullYear() + "-" + (end.getMonth()+1) + "-" + end.getDate();
        return start
    },
    showdate2: function () {
        var now=new Date();
        var start=new Date();
        var end=new Date();
        var n=now.getDay();
        start.setDate(now.getDate()-n+1);
        end.setDate(now.getDate()-n+7);
        start = start.getFullYear() + "-" + (start.getMonth()+1) + "-" + start.getDate();
        end = end.getFullYear() + "-" + (end.getMonth()+1) + "-" + end.getDate();
        return end
    },
    emojiToHTML : function(emojiContent){
        return RongIMLib.RongIMEmoji.emojiToHTML(emojiContent,18);
        // return RongIMLib.RongIMEmoji.symbolToEmoji(emojiContent);
    },
    // 聊天时间
    showTimePipe: function (unix_stamp) { // unix_stamp 精确到微秒
        var _today_obj = new Date(),
            _today_date = {
              y : _today_obj.getFullYear(),
              m : ( _today_obj.getMonth() + 1 < 10 ? '0' + ( _today_obj.getMonth() - - 1 ) : (_today_obj.getMonth() - - 1) ),
              d : ( _today_obj.getDate() < 10 ? '0' + _today_obj.getDate() : _today_obj.getDate() )
            }
      
        var _today_stamp = Date.parse(_today_date.y + '/' + _today_date.m + '/' + _today_date.d + ' 00:00:00')
          
        var stamp = []
        stamp[0] = _today_stamp + 86400000
        stamp[1] = _today_stamp
        stamp[2] = _today_stamp - 86400000
        stamp[3] = _today_stamp - 172800000
      
        stamp[4] = _today_stamp - 518400000 // 7天
      
        stamp[5] = _today_stamp - 31536000000 // 365天
      
        var _compare_obj = new Date()
        _compare_obj.setTime(unix_stamp)
      
        var return_str
      
        if (unix_stamp >= stamp[1] && unix_stamp < stamp[0] ) {
            if(Math.abs(_today_stamp - unix_stamp) < 300000 ){
                return_str = '' 
            } else{
                return_str = (_compare_obj.getHours() < 10 ? '0' + _compare_obj.getHours() : _compare_obj.getHours()) + ':' +  ( _compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes() )
            }
        } else if (unix_stamp >= stamp[2] && unix_stamp < stamp[1]) {
          var yesterdayText = '昨天'
          return_str = yesterdayText  + ' ' + (_compare_obj.getHours() < 10 ? '0' + _compare_obj.getHours() : _compare_obj.getHours()) + ':' +
            ( _compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes() )
        } else if (unix_stamp >= stamp[3] && unix_stamp < stamp[2]) {
          var daynames = ['天', '一', '二', '三', '四', '五', '六']
          var dathStr = '星期' + daynames[_compare_obj.getDay()]
      
          var SundayText = '星期天'
          var MondayText = '星期一'
          var TuesdayText = '星期二'
          var WednesdayText = '星期三'
          var ThursdayText = '星期四'
          var FridayText = '星期五'
          var SaturdayText = '星期六'
      
          var dathStr2
      
          switch (dathStr) {
            case '星期天':
              dathStr2 = SundayText
              break
            case '星期一':
              dathStr2 = MondayText
              break
            case '星期二':
              dathStr2 = TuesdayText
              break
            case '星期三':
              dathStr2 = WednesdayText
              break
            case '星期四':
              dathStr2 = ThursdayText
              break
            case '星期五':
              dathStr2 = FridayText
              break
            case '星期六':
              dathStr2 = SaturdayText
              break
            default:
              dathStr2 = dathStr
              break
          }
      
          return_str = dathStr2 + ' ' + (_compare_obj.getHours() < 10 ? '0' + _compare_obj.getHours() : _compare_obj.getHours()) + ':' +
            ( _compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes() )
        } else {
          var yearText = '年'
          var monthText = '月'
          var dayText = '日'
          return_str = _compare_obj.getFullYear() + yearText + (_compare_obj.getMonth() - (-1)) +
            monthText + _compare_obj.getDate() + dayText + ' ' + (_compare_obj.getHours() < 10 ? '0' + _compare_obj.getHours() : _compare_obj.getHours()) + ':' +
            ( _compare_obj.getMinutes() < 10 ? '0' + _compare_obj.getMinutes() : _compare_obj.getMinutes() )
        }
        return return_str
      },
}