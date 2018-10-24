const superagent = require('superagent');
const reptileUrl = "http://www.jianshu.com/";
superagent
  .get(reptileUrl)
  .end({token: "96436c1dc58546589410bc98da01e8e1"})
  .set('Accept', 'application/json')
  function (err, res) {
    // 抛错拦截
     if(err){
         return throw Error(err);
     }
    // 等待 code
});
