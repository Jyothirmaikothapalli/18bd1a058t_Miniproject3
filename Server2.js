const express = require('express')
const app = express()
const bodyParser=require('body-parser')
const MongoClient = require('mongodb').MongoClient
var db;
var s;

MongoClient.connect('mongodb://localhost:27017/FootWear',(err,database) =>{
    if(err) return console.log(err)
    db=database.db('FootWear')
    app.listen(3400, () => {
    console.log('listening on 3400')
    })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded( {extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    db.collection('ladies').find().toArray( (err,result) =>{
        if(err) return console.log(err)
        res.render('stock_details.ejs', {data: result})
    })
})  
app.get('/add_product', (req,res)=>{
    res.render('add_product.ejs')
}) 

app.get('/update_product', (req,res)=>{
    res.render('update_product.ejs')
})

app.get('/delete_product', (req,res)=>{
    res.render('delete_product.ejs')
})
app.get('/sstock_print', (req,res)=>{
    db.collection('ladies').find().toArray( (err,result) =>{
        if(err) return console.log(err)
        res.render('sstock_print.ejs', {data: result})
    })
})

app.get('/sales', (req, res) => {
    db.collection('ladies').find().toArray( (err,result) =>{
        if(err) return console.log(err)
        res.render('Sales_details.ejs', {data: result})
    })
}) 




app.post('/AddData',(req,res)=> {
    db.collection('ladies').save(req.body, (err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})

app.post('/UpdateData',(req,res)=> {
    db.collection('ladies').find().toArray((err,result) => {
        if(err) return console.log(err)
        var count=0;
        for(var i=0;i<result.length;i++)
        {
            if(result[i].pid==req.body.id)
            {
                s=result[i].stock
                break;
            }else{
                count=count+1;

            }
        }
        if(count==result.length)
        {
            console.log("no item ")
        }
        
    db.collection('ladies').findOneAndUpdate({pid: req.body.id},{
        $set: {stock: parseInt(s) + parseInt(req.body.stock)}}, {sort: {_id: -1}},
        (err, result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})
})

app.post('/DeleteData',(req,res)=>{
    db.collection('ladies').findOneAndDelete({pid: req.body.id},(err, result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})


app.get("/delete",(req,res)=>{
        async function del(){
                    await db.collection('ladies').deleteOne(req.query);
                    await res.redirect("/");
        }
        del();
})

