let express=require('express');
let bodyParser=require('body-parser');
let cookieParser=require('cookie-parser');
let expressSession=require('express-session');
let mongoStore=require('connect-mongo')(expressSession);
let mongoose=require('mongoose');
require('./models/users_model.js');
let dbUrl='mongodb://localhost:27017/myapp';
let conn=mongoose.connect(dbUrl);
let app=express();

app.engine('.html',require('ejs').__express);
app.set('views','./views');
app.set('view engine','html');
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(expressSession({
	// 假设每次登陆，就算会话存在也重新保存一次，默认true
	resave:false,
	// 强制保存未初始化的会话到存储器，默认true
	saveUninitialized:true,
    secret:'SECRET',
    cookie:{maxAge:60*60*1000},
    store:new mongoStore({
        url:dbUrl,
		//指定持久化到mongodb数据库中的collections的名字
		collection:'sessions'
    })
}));

require('./routes.js')(app);
app.listen(3000);
