module.exports = {
 adninOrUser: function(a){
    return a ? 'admin' : 'user'
  //  if (a === 0){
  //    return 'user'
  //  }else if(a === 1){
  //    return 'admin'
  //  }
 },
 setAsUserOrAdmin:function(b){
  return b ? 'set as user':'set as admin'
  //  if (b === 0) {
  //    return 'set as admin'
  //  } else if (b === 1) {
  //    return 'set as user'
  //  }
 }
}