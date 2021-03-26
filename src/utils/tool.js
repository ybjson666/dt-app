export const createPassword=(min,max)=> {
    //可以生成随机密码的相关数组
    var num = ["0","1","2","3","4","5","6","7","8","9"];
    var english = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
    var ENGLISH = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    var special = ["-","_","#"];
    var config = num.concat(english).concat(ENGLISH).concat(special);
    
    //先放入一个必须存在的
    var arr = [];
    arr.push(getOne(num));
    arr.push(getOne(english));
    arr.push(getOne(ENGLISH));
    arr.push(getOne(special));
    
    //获取需要生成的长度
    var len = min + Math.floor(Math.random()*(max-min+1));
    
    for(var i=4; i<len; i++){
     //从数组里面抽出一个
     arr.push(config[Math.floor(Math.random()*config.length)]);
    }
    
    //乱序
    var newArr = [];
    for(var j=0; j<len; j++){
     newArr.push(arr.splice(Math.random()*arr.length,1)[0]);
    }
    
    //随机从数组中抽出一个数值
    function getOne(arr) {
     return arr[Math.floor(Math.random()*arr.length)];
    }
    
    return newArr.join("");
}