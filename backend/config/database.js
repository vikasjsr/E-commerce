const mongoose = require("mongoose");


/*----- useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options.
  Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true,
   and useFindAndModify is false. Please remove these options from your code. ------*/

const connectDatabase = ( )=>{
    mongoose.connect(process.env.DB_URL).then((data)=>{
            console.log(`Mongodb is connected with server:${data.connection.host}`);
        })
        // making the function unhandled by closing catch function so that handled explicitly in server.js
        // .catch((err)=>{
        //     console.log("error can't connected to mogodb!",err);})
}

module.exports = connectDatabase