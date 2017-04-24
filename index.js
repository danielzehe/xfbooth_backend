const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const fs = require('fs')
const thumb = require('node-thumbnail').thumb;
const app = express()
app.set('views',__dirname + '/views')
app.set('view engine','pug')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let api_router = express.Router();
let web_router = express.Router();

app.use('/boothpic',express.static(__dirname + '/uploads'));
app.use('/thumbs',express.static(__dirname + '/thumbs'));
app.use('/static',express.static(__dirname + '/static'));

app.get('/',function(req,res){
	var files = fs.readdirSync(__dirname+'/uploads');
	files.sort(function(a, b) {
               return fs.statSync(__dirname+'/uploads/' + a).mtime.getTime() - 
                      fs.statSync(__dirname+'/uploads/' + b).mtime.getTime();
           });
	console.log(files);
	res.render('overview',{pics:files});
})
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

			thumb({
			  source: __dirname+'/uploads/'+req.file.originalname, // could be a filename: dest/path/image.jpg 
			  destination: __dirname+'/thumbs/',
			  concurrency: 2,
			  overwrite: true,
			  width: 800,
			  suffix: ''
			}, function(err2, stdout, stderr) {
				// console.log([err,stdout,stderr]);
			  	console.log('All done!');
			  	res.sendStatus(200);
			});
		}
	});
})

web_router.get('/overview',function(req,res){
	// let pics = ['hallo','welt','heute']

	var files = fs.readdirSync(__dirname+'/uploads');
	files.sort(function(a, b) {
               return fs.statSync(__dirname+'/uploads/' + a).mtime.getTime() - 
                      fs.statSync(__dirname+'/uploads/' + b).mtime.getTime();
           });
	console.log(files);
	res.render('overview',{pics:files});
	// fs.readdir(__dirname+'/uploads', (err,files)=>{
	// 	res.render('overview',{pics:files});
	// });
})

web_router.get('/singlepic/:picname',function(req,res){
	let picname = req.params.picname;
	res.render('singlepic',{val:picname});
})


app.use('/api',api_router);
app.use('/web',web_router);


app.listen(64888,function(){
	console.log('listening on 64888');
});