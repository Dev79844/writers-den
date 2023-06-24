const app = require('./app')
require('dotenv').config()
const mongoose = require('mongoose')

// console.log(process.env.DB);

mongoose.connect(process.env.DB)
.then(() => {
    console.log('DB Connected');
    app.listen(process.env.PORT, () =>{
        console.log(`Server started on ${process.env.PORT}`);
    })
})