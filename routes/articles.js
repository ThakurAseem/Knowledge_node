const express = require('express')
const router=express.Router();


//bring in article models
let article = require('../models/article');


//Add route
router.get('/add',function(req,res){
    res.render('add_article',{
        title: 'Add Article'
    })
})

//Add submit post Route
router.post('/add',function(req,res){
    req.checkBody('title','Title is required').notEmpty();
    req.checkBody('author','Author is required').notEmpty();
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
        Article.author=req.body.author;
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
router.get('/edit/:id',function(req,res){
    article.findById(req.params.id,function(err,articles){
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
    let query ={_id:req.params.id}

    article.deleteOne(query,function(err){
        if(err){
            console.log(err);
        }
        req.flash('success','Article Deleted')
        res.send('success');
    })
})

//get single article
router.get('/:id',function(req,res){
    article.findById(req.params.id,function(err,articl){
        res.render('article',{
            articles:articl
        })
    })
})

module.exports = router;