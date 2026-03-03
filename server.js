let express = require('express');
let app = express();
let cors = require('cors');

app.use(cors());
app.use(express.json());
require("dotenv").config();
require('./src/models/user');

const connectMongo = require("./src/config/mongoDB");
const  sequelize  = require('./src/config/database');

const authRoute = require('./src/routes/auth');
app.use('/api/auth',authRoute);

sequelize.authenticate().then(()=> {
    console.log("Connection has been established successfully.")
     return sequelize.sync();
}).then(async ()=> {
    console.log('database synced successfully');
    await connectMongo();
    app.listen(3000, ()=> console.log('server is running on 3000 port'));
});








