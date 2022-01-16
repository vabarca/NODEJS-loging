//1 - Invocamos a express
const express = require('express');
const app = express();

//2 - Seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json);

//3 - Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path: './env/.env'});

//4 - Seteamos el directorio public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5 - Establecemos el motor de pantallas ejs
app.set('view engine', 'ejs');

//6 - Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//7 - Invocamos la sesion
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

app.get('/', (req, res) => {
    res.send('hola amegos!!');
});

app.listen(3000, (req, res) => {
    console.log('Servidor running in localhost:3000');
});