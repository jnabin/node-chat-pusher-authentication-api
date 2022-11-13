require('dotenv').config();

const Express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const initRoutes = require('./src/routes/index');

global.__basedir = __dirname;

const app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors({
    origin: ['http://localhost:4200']
}))

initRoutes(app);

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Express is running at port: ${port}`));
