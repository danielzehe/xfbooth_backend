const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var api_router = express.Router();


api_router.get('/',function(req,res){
	res.status(200).send("all API Endpoints");
});

var uploading = multer({
  dest: __dirname + 'uploads/',
  limits: {fileSize: 10000000, files:1},
})



api_router.post('/upload',  uploading.single('avatar'), function(req, res,next) {
	console.log("file received");
	console.log(req.file.originalname);
	res.sendStatus(200);
})

app.use('/api',api_router);


app.listen(3333,function(){
	console.log('listening on 3333');
});