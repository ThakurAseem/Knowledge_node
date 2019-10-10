const express = require('express')
const path = require('path')
const mongoose=require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const config  = require('./config/database')


mongoose.connect(config.database);
let db =mongoose.connection;

//check connection
db.once('open',function(){
    console.log("Connected to mongodb");
})


//check for db errors
db.on('error',function(err){
    console.log(err);
})

//INIT app
const app = express()

//bring in models
let article = require('./models/article');

//load view
app.set('views',path.join(__dirname, 'views'));
app.set('view engine','pug');

//Body parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//set pubic folder
app.use(express.static(path.join(__dirname,'public')));

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));


//Express message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express Validator Middleware
// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));


//  passport config
require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.get('*',function(req,res,next){
  res.locals.user = req.user || null;
  next();
})

//Home route
app.get('/',function(req,res){
    article.find({},function(err,articles){
        if(err){
            console.log(err);
        }else{
        res.render('index',{
            title: 'Articles',
            articles: articles
        });
    }
    })
})


let articles = require('./routes/articles')
let users = require('./routes/user')
app.use('/article',articles)
app.use('/users',users)

//start Server
app.listen(4000,function(){
    console.log('Server start at localhost 3000...');
})