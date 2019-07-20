const Authentication = require('./controllers/AuthenticationController');

//export module functions.
//typical get request function. 
module.exports = function(app) {
	//for debug
     app.get('/', function(req, res, next) {
         res.send(['Mike','Spike','Like']);
     });
	//Router configurations
    app.post('/signup', Authentication.signup);
    app.post('/login', Authentication.login);
    app.post('/reqOneTimePassword', Authentication.reqOneTimePassword);
}
