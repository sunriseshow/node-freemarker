/**
 * author:  lirong on 16/4/27.
 * description:
 */


exports.index = function(req, res) {
    //console.log("hello");
    // res.render('index', {
    // title : 'Express'
    // });
    var fm = res.app.get('view engine');
    fm.render('index.ftl', {
        "title" : "hello world!"
    }, function(err, html, output) {
        console.log(output);
        console.log(html);
        res.send(html);
    });
};