const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');

const port = process.env.PORT||5000;
const userRouter = require('./routes/userRouter');
const scoreRouter = require('./routes/scoreRouter');

require('dotenv').config();
// Support both MONGO_URI (used in .env) and ATLAS_URI (older config)
const uri = process.env.MONGO_URI || process.env.ATLAS_URI;
if (!uri) {
  console.error('MongoDB connection string is missing. Set MONGO_URI or ATLAS_URI in your .env');
  process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('mongodb database connected'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });


app.use(cors());
app.use(express.json());
app.use(cookieParser());
const path = require('path')
// const query =  ;
// const options = {
//   sort: {score:1},
//   projection: {
//     _id:0,
//     score:1,
//     username:1
//   }
// };
 app.use(express.static('public'))

 app.use('/user',userRouter);
 app.use('/score',scoreRouter);
 

 app.get('*',(req,res)=>{
   res.sendFile(path.resolve(__dirname,'public','index.html'))
 })





app.listen(port,() => console.log('Server is running'))
