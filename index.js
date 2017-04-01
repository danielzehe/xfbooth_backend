const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')

const app = express()
app.set('views',__dirname + '/views')
app.set('view engine','pug')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let api_router = express.Router();
let web_router = express.Router();

app.use('/boothpic',express.static(__dirname + '/uploads'));
app.use('/static',express.static(__dirname + '/static'));


api_router.get('/',function(req,res){
	res.status(200).send("all API Endpoints");
});

let uploading = multer({
  dest: __dirname + '/tmpuploads/',
  limits: {fileSize: 10000000, files:1},
})


api_router.post('/upload',  uploading.single('avatar'), function(req, res,next) {
	console.log("file received");
	console.log(req.file.originalname);
	console.log(req.file);
	fs.rename(req.file.path,__dirname+'/uploads/'+req.file.originalname,(err)=>{
		if(err){
			console.log(err)
		}
		else{
			res.sendStatus(200)
		}
	});
})

web_router.get('/overview',function(req,res){
	// let pics = ['hallo','welt','heute']

	fs.readdir(__dirname+'/uploads', (err,files)=>{
		res.render('overview',{pics:files});
	});
})

web_router.get('/singlepic/:picname',function(req,res){
	let picname = req.params.picname;
	res.render('singlepic',{val:picname});
})


app.use('/api',api_router);
app.use('/web',web_router);


app.listen(3333,function(){
	console.log('listening on 3333');
});