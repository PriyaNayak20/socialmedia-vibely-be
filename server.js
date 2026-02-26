let express = require('express');
let app = express();
const  sequelize  = require('./src/config/database');
require('./src/models/user');
sequelize.authenticate().then(()=> {
    console.log("Connection has been established successfully.")
     return sequelize.sync();
}).then(()=> {
    console.log('database synced successfully');
    app.listen(3000, ()=> console.log('server is running on 3000 port'));
})
app.get('/',(req, res)=> res.send('hello world'));


