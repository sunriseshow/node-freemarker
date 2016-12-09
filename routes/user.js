
/*
 * GET users listing.
 */

exports.list = function(req, res){
  console.log(111);
  var arraylist=[];

  var data={}
  data.product="123";
  data.OK="456";
  arraylist.push(data);
  data={};
  data.product="1299993";
  data.OK="yyyy";
  arraylist.push(data);


  //res.send(list);
  //console.log(arraylist);

  var fm = res.app.get('view engine');
  fm.render('index.ftl', {
    "lists" : arraylist,"title":"test"
  }, function(err, html, output) {
    // console.log(html);
    //console.log(err);
    //console.log(output);
      res.send(html);
  });
};