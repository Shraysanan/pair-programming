var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Code = require('../models/code')

router.post('/',async(req,res)=>{
    const codeId = req.header('codeid');
    const userId = req.header('userid');
    console.log("userid",userId);
    console.log("codeid",codeId);
    User.findById(userId,function(err,user){
        if(err){
          console.log(err);
          res.status(500).send(err);
        }
        else{
          console.log("user",user);
          
          if(codeId==null){
            Code.create(req.body,function(err,code){
              console.log(req.body);
                if(err){
                    console.log(err);
                    res.status(500).send(err);
                  }
                  else{
                    code.author.id=userId;
                    // code.author.username=user.name;
                    console.log(userId)
                    code.save();
                    user.mycodes.push(code);
                    user.save();
                    res.status(200).send("coded added and linked too user");
                  }
            });
          }  
          else{
            Code.findByIdAndUpdate(codeId,req.body,(err,foundcode)=>{
              if (err){
                res.status(500).send(err);
              } 
              else {
                foundcode.save();
                res.status(200).send("code updated");
              }
            });
          }
        }
      })    
});

router.get('/mycodes',async (req,res)=>{
  const userId = req.header('userid');
  User.findById(userId).populate("mycodes").exec(function(err,user){
      if(err){
          console.log(err);
          res.status(500).send(err);
      }else{
          res.status(200).send(user.mycodes);
      }
  });
});

router.get('/mycode/:id',async (req,res)=>{
  const codeId = req.params.id;
  // console.log(req.params);
  Code.findById(codeId,function(err,code){
      //populate comments later
      if(err){
          console.log(err);
          res.status(500).send(err);
      }else{
          res.status(200).send(code);
          console.log(code);
      }
  });
  
});


module.exports = router;