const express = require('express');
const port = 8000;
const app = express();
const fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.get('/',(req,res)=>{
    res.send("hello world");
});
// add data in json----------
app.use(express.json());
const arr = [];
app.post('/adduser',(req,res)=>{
    const userData = req.body;
    console.log("hi",userData.email);
    
    if(userData.name == null || userData.email == null || userData.id == null || userData.mobile == null){
        return res.status(401).send({error: true, msg: 'Missing details'});
    }
    console.log("hi",userData.email);
    const existUsers = fs.readFileSync('student.json','utf8');
    const parseUsers = JSON.parse(existUsers);
    if(existUsers.email === userData.email){
        return res.status(401).send({error: true, msg: 'user exist'});
    }
    
    
    const stringifyData = JSON.stringify(userData);
    const p = JSON.parse(stringifyData)
    arr.push(p);

    const n=JSON.stringify(arr);
    fs.writeFileSync('student.json',n);
    res.send({success: true, msg: 'User data added successfully'});
});

//read data----
app.get('/readdata',(req,res)=>{
    const existUsers = fs.readFileSync('student.json','utf8');
    const stringifyUser = JSON.parse(existUsers);
    
    res.send(stringifyUser);
})
//delete data-------------------
app.delete('/deletedata/:id', (req, res) => {
    const userData = fs.readFileSync('student.json','utf8');
    const p=JSON.parse(userData);
    const newArr = [];
    let fl = false;
    for(let i=0;i<p.length;i++){
        if(req.params.id!=p[i].id){
            newArr.push(p[i]);
            fl = true;
        }
    }
    
    if(newArr.length>=1){
        const s = JSON.stringify(newArr);
       fs.writeFileSync('student.json',s);
    }
    if(!fl){
        return res.status(401).send({error: true, msg: 'User Not found'});
    }
    else{
    return res.send({success: true, msg: 'User data deleted successfully'});
    }
})
//update user-----
app.put('/update/:name/:updatedName',(req,res)=>{
    const userData = fs.readFileSync('student.json','utf8');
    console.log("op",req.params.fin);
    const p=JSON.parse(userData);
    let f = false;
    for(let i=0;i<p.length;i++){
        if(req.params.name==p[i].name){
            console.log('right')
            p[i].name = req.params.updatedName;
            f = true;
            break;
        }
    }
    if(!f){
        return res.status(401).send({error: true, msg: 'User not found'});
    }
    const updatedArr = JSON.stringify(p);
    console.log(updatedArr)
    fs.writeFileSync('student.json',updatedArr);
    res.send({success: true, msg: 'User data added successfully'});
})    

app.listen(port, () => {
    console.log('Server runs on port port');
})