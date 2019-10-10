const express = require('express')
const router=express.Router();


//bring in article models
let article = require('../models/article');

//User models
let User = require('../models/user')


//Add route
router.get('/add',ensureAutheticated,function(req,res){
    res.render('add_article',{
        title: 'Add Article'
    })
})

//Add submit post Route
router.post('/add',function(req,res){
    req.checkBody('title','Title is required').notEmpty();
    //req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();
    
    //get Errors
    let errors = req.validationErrors();

    if(errors){
        res.render('add_article',{
            title:'Add Article',
            errors:errors
        })
    }
    else{
        let Article = new article();
        Article.title=req.body.title;
        Article.author=req.user._id;
        Article.body=req.body.body;
    
        Article.save(function(err){
            if(err){
                console.log(err);
                return;
            }else{
                req.flash('success','Article Added');
                res.redirect('/');
            }
        });
    }

})

//load article form
router.get('/edit/:id',ensureAutheticated,function(req,res){
    article.findById(req.params.id,function(err,articles){
        if(articles.author != req.user._id){
            req.flash('danger','Not Authorized')
            res.redirect('/');
        }
        res.render('edit_article',{
            title:'Edit Article',
            articles:articles
        })
    })
})

//update submit
//Add submit post Route
router.post('/edit/:id',function(req,res){
    let Article = {}
    Article.title=req.body.title;
    Article.author=req.body.author;
    Article.body=req.body.body;
    
    let query = {_id:req.params.id}

    article.update(query,Article,function(err){
        if(err){
            console.log(err);
            return;
        }else{
            req.flash('success','Article updated');
            res.redirect('/');
        }
    });
})

//Deleting the article
router.delete('/:id',function(req,res){
    if(!req.user._id){
        req.status(500).send();
    }
    let query ={_id:req.params.id}
    article.findById(req.params.id,function(err,articl){
        if(articl.author != req.user._id){
            req.status(500).send();
        }
        else{
            article.deleteOne(query,function(err){
                if(err){
                    console.log(err);
                }
                req.flash('success','Article Deleted')
                res.send('success');
            })
        }
    })
})

//get single article
router.get('/:id',function(req,res){
    article.findById(req.params.id,function(err,articl){
        User.findById(articl.author,function(err,user){
            res.render('article',{
                articles:articl,
                author: user.name
            })
        })
        
    })
})

//Access Control
function ensureAutheticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('danger','Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;