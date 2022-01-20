//1 - Invocamos a express
const express = require('express');
const app = express();

//2 - Seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
//app.use(express.json);

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
app.get('/login', (req, res) => {
    res.render('login');
});

//10 - Metodo para la autenticacion
app.post('/auth', async (req, res)=> {
    const user = req.body.user;
    const pass = req.body.pass;

    try {
        let sql_get = "SELECT * FROM users WHERE user = ?";
        db.get(sql_get, [user] , async (error, data)=>{
            let granted = await bcryptjs.compare(pass, data.pass);
            if(data && granted){
                //Grant access
                req.session.loggedin = true;
                req.session.name = data.user;
                res.render('login',{
                    alert:true,
                    alertTitle:"Success",
                    alertMessage:"¡Wellcome " + data.user + "!" ,
                    alertIcon: 'success',
                    showConfirmButton:false,
                    timer:1500,
                    ruta: ''
                });
            } else {
                //Deny access
                res.render('login',{
                    alert:true,
                    alertTitle:"Error",
                    alertMessage:"Wrong user and/or password",
                    alertIcon: 'error',
                    showConfirmButton:true, 
                    timer:false,
                    ruta: 'login'
                });
            }
            res.end();
        });
    } catch (e) {
        console.log("error accedinedo a la DB");
    } finally {
    }
});

//11 - Método para controlar que está auth en todas las páginas
app.get('/', (req, res) => {
    if (req.session.loggedin) {
		res.render('index',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('index',{
			login:false,
			name:'',			
		});				
	}
	res.end();
});

//función para limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

 //Logout
//Destruye la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});

app.listen(3000, (req, res) => {
    console.log('Servidor running in localhost:3000');
});

