
const express = require('express');
const Imap = require('imap');
const morgan = require('morgan')
const mongoose = require('mongoose')
const Students = require('./models/students');
const Records = require('./models/records');
const {check,validationResult}= require('express-validator')
const bodyParser = require('body-parser')
// const url = require('url')

// express app
const app = express();

//connect to db
const dbURI = 'mongodb+srv://welangaieric:Barz05122018@cluster0.u4u9dj9.mongodb.net/STUCIMS?retryWrites=true&w=majority'
mongoose.set('strictQuery',true)
mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result)=>{
    console.log('database connected')
    app.listen(3000)})
.catch((err)=>console.log(err))

//register view engine
app.set('view engine','ejs')



// middlewares
const urlencodedParser = bodyParser.urlencoded({extended:false})
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))

//mongoose routes
app.get('/student-record',(req,res)=>{
    Students.find()
    .then((result)=>{
        // console.log(result)
        res.send(result)
    })
    .catch((err)=>{
        console.log(err)
    })
})



//ADD clearance record
app.post('/clearance-record',(req,res)=>{
    const record =new Records(req.body);
    record.save()
    .then((result)=>{
        
       
        res.render('admin',{title:'admin'})
    })
    .catch((err)=>{
        
        // res.send(err)
        res.render('admin',{title:'admin',alert:`${err.keyValue.StdAdm} already exists`})

    });

})

// validations ===============================================
// LOGIN
app.post('/login',urlencodedParser,[
    check('username','Username is required')
        .trim()
        .exists()
        .notEmpty()
        ,
    check('Password','Password is required')
        .trim()
        .exists()
        .notEmpty(),

       
], async (req,res)=>{
    let errors = validationResult(req)
    if (!errors.isEmpty()){
        const error =errors.array(); 
    }
    else{
        try{
            const check= await Students.findOne({email:req.body.username})

            
            if(check){
                if(req.body.Password==='testuser'&& req.body.username==='admin@gmail.com'){
                   return  res.render('admin',{title:'Admin',success:'Login Successful'})
                }
                if(check.Password ===req.body.Password){
                    let userRecord =await Records.findOne({email:req.body.username})
                    if(userRecord){
                        return res.render('info',{
                            title:'student info',
                            userName:userRecord.studentName,
                            adm:userRecord.StdAdm,
                            Depart1:userRecord.Depart1,
                            Depart2:userRecord.Depart2,
                            Depart3:userRecord.Depart3
                        })
                    }
                    else{
                        return  res.render('login',{title:'login',alert:'You dont have any records'})
                    }
                   
                 
                    
                }
                else{
                    return  res.render('login',{title:'login',alert:'wrong password'})
                } 
            } 
        }
        catch(err){
            res.render('login',{title:'login',alert:'Incorrect Details',})
            // res.send(err)
        }
    }
}
)

//log out
app.get("/logout", function (req, res) {
  
        res.redirect('/login');
    
});


  
// ADD student record
app.post('/student-record',urlencodedParser,[

    check('confirmPassword','Passwords dont match')
    .custom((value, {req}) => (value === req.body.Password)),

],(req,res)=>{
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        const error =errors.array();
        res.render('signup',{error:error,title:'Signup'})
    }else{
        const student =new Students(req.body);
        student.save()
       
        .then((result)=>{
            
            // res.send(result)
            res.render('login',{title:'login'})
        })
        .catch((err)=>{
           
            res.render('signup',{title:'login',alert:`${err.keyValue.StdAdm} already exists`})
            // res.send(err)

        });
    }
  

})



// =======================================================
// search
app.get('/search/:email',async(req,res)=>{
    let data =await Records.find(
        {
            "$or":[
                {email:{$regex:req.params.email.trim()}}
            ]
        }  
    )
    res.send(data)
    console.log(req.params.email)
    })
// Get all students//////////////////////////
app.get('/student-record',(req,res)=>{
    res.find()
    .then((result)=>{
        res.send(result)
    })
    .catch((err)=>{
        console.log(err)
    })
})
// =///////////////////////////////////////
//update records
// EDIT USER POST ACTION
app.post('/clearance-record/:email', function(req, res, next) {
    // console.log(req.body)
    let query ={
        'studentName':req.body.studentName,
        'email':req.body.email,
        'StdAdm':req.body.StdAdm,
       'Depart1':req.body.Depart1,
       'Depart2':req.body.Depart2,
       'Depart3':req.body.Depart3,

    } 
        Records.findOneAndUpdate({email:req.body.email},{$set:query},function(err, data) {

                if(err){
                       
                        res.send(err);
                }
                else{
                   
                  res.render('admin',{title:'admin'});
                }
        }); 

    }
    )
// delete RECORDS
app.delete('/clearance-record/:email',(req,res)=>{
    // console.log(req.params)

    Records.findOneAndDelete({email:req.params.email},(err,data)=>{
        if (err){
            console.log(err)
        }
        else{
            res.render('admin',{title:'admin'});
            console.log("Deleted record : ", data);
        }
    })
     
    

})
//Report generation

app.get("/downloadPDF", (req, res) => {
    res.download("uploads/Resume.pdf");
});



//GET CLEARANCE RECORDS
app.get('/clearance-record',(req,res)=>{
    Records.find()
    .then((result)=>{
        // console.log(result)
        res.send(result)
    })
    .catch((err)=>{
        console.log(err)
    })
})

// send mail========================================
app.post('/send_email',(req,res)=>{
    let imap = new Imap({
        user: 'welangaieric@gmail.com',
        password: '(@)Hood(@)',
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        tlsOptions: {
          rejectUnauthorized: false
        },
        authTimeout: 3000
      });
    
    
      function openInbox(cb) {
        imap.openBox('INBOX', true, cb);
      }
      //['SUBJECT', 'Give Subject Here']]
      imap.once('ready', function() {
      openInbox(function(err, box) {
          if (err) throw err;
          var fs = require('fs'), fileStream;
          var f = imap.seq.fetch('714:715', { bodies: ['HEADER.FIELDS (FROM)','TEXT'] });
          f.on('message', function(msg, seqno) {
            // console.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
              simpleParser(stream, (err, mail) => {
                // console.log(mail.from);            
              });
             
              stream.once('end', function() {
                if (info.which !== 'TEXT')
                 {} // console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                else
                  {}// console.log(prefix + 'Body [%s] Finished', inspect(info.which));
              });
            });
            msg.once('attributes', function(attrs) {
              // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
            msg.once('end', function() {
              // console.log(prefix + 'Finished');
            });
          });
          f.once('error', function(err) {
            // console.log('Fetch error: ' + err);
          });
          f.once('end', function() {
            // console.log('Done fetching all messages!');
            imap.end();
          });
        });
    });
      
      imap.once('error', function(err) {
        res.render('contact',{title:'contact',alert:`${err.textCode}`})
      });
      
      imap.once('end', function() {
        // console.log('Connection ended');
      });
      
      imap.connect();
})
// ===============================================

app.get('/',(req,res)=>{
    res.render('index',{title:'Home'})
})
app.get('/login',(req,res)=>{
    res.render('login',{title:'Login'})
})
app.get('/contact',(req,res)=>{
    res.render('contact',{title:'Contact'})
})
app.get('/about',(req,res)=>{
    res.render('about',{title:'About'})
})
app.get('/signup',(req,res)=>{
    res.render('signup',{title:'Sign Up'})
})
// app.get('/admin',(req,res)=>{
//     res.render('admin',{title:'admin'})
// })
// app.get('/info',(req,res)=>{
//     res.render('info',{title:'info'})
// })

app.use((req,res)=>{
    res.status(404).render('404',{title:'404'});
});



