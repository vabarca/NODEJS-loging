//1 - Invocamos a express
const express = require('express');
const app = express();

//2 - Seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
//app.use(express.json);

//3 - Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path: './env/.env'});

//4 - Seteamos el directorio public
//app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5 - Establecemos el motor de pantallas ejs
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//6 - Invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//7 - Invocamos la sesion
const session = require('express-session');
app.use(session({
    secret: 'power',
    resave: true,
    saveUninitialized: true,
}));

//8 - Invocamos al módulo de conexión de la BD
const db = require('./db/db');
const { Console } = require('console');

//9 - Establecinedo las rutas
app.get('/', (req, res) => {
    res.render('index', {msg: 'ESTO ES UN MENSAJE DESDE NODE'});
});

app.get('/login', (req, res) => {
    res.render('login');
});

//10 - Implementamos el metodo post del login
app.post('/auth', async (req, res)=> {
    const user = req.body.user;
    const pass = req.body.pass;

    if(!user || !pass){
        return console.log('Undefined field');
    }

    let sql_get = "SELECT * FROM users WHERE user = ?";
    db.get(sql_get, [user] , (error, result)=>{
        if(error){
            return console.log("Error accediendo a la base de datos")
        }
 
        if(result){
            console.log(result.user, result.pass);

            let rslt = true;//await bcryptjs.compare(result.pass, pass); 

            if(rslt){
                //Grant access
                req.session.name = result.user;
                res.render('login',{
                    alert:true,
                    alertTitle:'Conexión correcta',
                    alertMessage:'LOGIN CORRECTO',
                    alertIcon: 'success',
                    showConfirmButton:false,
                    timer:1500,
                    ruta: ''
                });
            }
            else{
                //Deny access
                res.render('login',{
                    alert:true,
                    alertTitle:'Error',
                    alertMessage:'Usuario y/o password incorrectas',
                    alertIcon: 'error',
                    showConfirmButton:true,
                    timer:false,
                    ruta: 'login'
                });
            }
        }
        else{
            if(user == 'pe'){
                let passHash = await(bcryptjs.hash(pass, 8))
                //create password
                return db.serialize(function(){
                    let sql_insert = 'INSERT INTO users(user,pass) VALUES(?,?)';
                    db.run(sql_insert,[user, passHash], (error)=>{
                        if(error){
                            return console.log(error.message);
                        }
                        
                        return console.log("User 'pe' added");
                    });
                });
            }
            else{

            }
        }        
    });
});


app.listen(3000, (req, res) => {
    console.log('Servidor running in localhost:3000');
});