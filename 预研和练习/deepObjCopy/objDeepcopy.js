;(function(window){
  var DeepCopy = function(obj){
   var newObj = obj.constructor === Array ? [] : {};
      newObj.constructor = obj.constructor;
      if(typeof obj !== "object"){
          return ;
      }else if(window.JSON){
          //若需要考虑特殊的数据类型，如正则，函数等，需把这个else if去掉即可
          newObj = JSON.parse(JSON.stringify(obj));
      }else{
            for(var prop in obj){
              if(obj[prop].constructor === RegExp ||obj[prop].constructor === Date){
                newObj[prop] = obj[prop];
              }else if(typeof obj[prop] === 'object'){
                //递归
                newObj[prop] = DeepCopy(obj[prop]);
              }else{
                newObj[prop] = obj[prop];
              }
          }
      }
    return newObj;
  }
  window.DeepCopy = DeepCopy;
})(window);