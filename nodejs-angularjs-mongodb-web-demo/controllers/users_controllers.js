let crypto=require('crypto');
let mongoose=require('mongoose');
let User=mongoose.model('User');
function hashPW(pwd){
	//hash.update(data, [input_encoding]):通过提供的数据更新哈希对象，可以通过input_encoding指定编码为'utf8'、'ascii'或者 'binary'。
	//如果没有指定编码，将作为二进制数据（buffer）处理。

	//hash.digest([encoding]):计算传入的所有数据的摘要值。encoding可以是'hex'、'binary'或者'base64'，如果没有指定，会返回一个buffer对象。
	return crypto.createHash('md5').update(pwd).digest('base64').toString();
}

//注册
exports.signup=function(req,res){
	let user=new User({username:req.body.username});
	user.set('hashed_password',hashPW(req.body.password));
	user.set('email',req.body.email);

	user.save(function(err){
		if(err){
			res.session.error=err;
			res.redirect('./signup');
		}else{
			req.session.user=user.id;
			req.session.username=user.username;
			req.session.msg='Authenticated as '+user.username;
			res.redirect('/');
		}
	})
};

//登录
exports.login=function(req,res){
	User.findOne({username:req.body.username})
		.exec(function(err,user){
			//用户不存在
			if(!user){
				err='User Not Found.';
			}else if(user.hashed_password===hashPW(req.body.password.toString())){
				// 重新生成一个新的session  
				req.session.regenerate(function(){
					req.session.user=user.id;
					req.session.username=user.username;
					req.session.msg='Authenticated as '+user.username;
					res.redirect('/');
				});
			}else{
				err='Authenticated failed.'
			}
			if(err){
				req.session.regenerate(function(){
					req.session.msg=err;
					res.redirect('./login');
				});
			}
		});
};

// /将用户信息以json格式返回
exports.getUserProfile=function(req,res){
	User.findOne({_id:req.session.user})
		.exec(function(err,user){
			if(!user){
				res.json(404,{err:'User Not Found.'});
			}else{
				res.json(user);
			}
		});
};

//更新用户信息
exports.updateUser=function(req,res){
	User.findOne({_id:req.session.user})
		.exec(function(err,user){
			user.set('email',req.body.email);
			user.set('color',req.body.color);
			user.save(function(err){
				if(err){
					res.session.error=err;
				}else{
					req.session.msg='User Updated.'
				}
				res.redirect('/user');
			});
		});
};

//删除用户
exports.deleteUser=function(req,res){
	User.findOne({_id:req.session.user})
		.exec(function(err,user){
			if(user){
				user.remove(function(err){
					if(err){
						req.session.msg=err;
					}
					req.session.destroy(function(){
						res.redirect('/login');
					});
				});
			}else{
				req.session.msg='User Not Found';
				req.session.destroy(function(){
					res.redirect('/login');
				});
			}
		});
};

