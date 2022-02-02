require('dotenv').config();

const Express = require('express');
const app = Express();

const controllers = require('./controllers')
const dbConnection = require('./db');

app.use(require('./middleware/headers'));

app.use(Express.json());

app.use('/log', controllers.logController);
app.use('/user', controllers.userController);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: App is listening on 4000.`)
        }); 
    })
    .catch ((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`)
    })
