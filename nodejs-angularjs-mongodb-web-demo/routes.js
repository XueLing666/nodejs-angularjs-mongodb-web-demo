let crypto=require('crypto');
let express=require('express');
module.exports=function(app){
	let users=require('./controllers/users_controllers');
	app.use('/static',express.static('./static'))
		.use('/lib',express.static('./lib'));

	//主页路由，检测是否登录
	app.get('/',function(req,res){
		if(req.session.user){
			res.render('index',{username:req.session.username,msg:req.session.msg});
		}else{
			req.session.msg='Access denied 1';
			res.redirect('/login');
		}
	});

	//user路由
	app.get('/user',function(req,res){
		if(req.session.user){
			res.render('user',{msg:req.session.msg});
		}else{
			req.session.msg='Access denied 2';
			res.redirect('/login');
		}
	});

	//注册路由,get请求
	app.get('/signup',function(req,res){
		if(req.session.user){
			res.redirect('/');
		}
		res.render('signup',{msg:req.session.msg});
	});

	//登录
	app.get('/login',function(req,res){
		if(req.session.user){
			res.redirect('/');
		}
		res.render('login',{msg:req.session.msg});
	});

	//退出登录
	app.get('/logout',function(req,res){
		//退出前销毁当前会话
		req.session.destroy(function(err){
			if(err){
				console.log(err);
			}
			res.redirect('/login');
		});
	});

	//使用google账号登录
	app.get('/passport-google',function(req,res){
		
	});

	//注册路由，post请求
	app.post('/signup',users.signup);
	app.post('/user/update',users.updateUser);
	app.post('/user/delete',users.deleteUser);
	app.post('/login',users.login);
	app.get('/user/profile',users.getUserProfile);
};