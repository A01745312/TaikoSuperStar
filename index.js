// Importar librerias
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcryptjs = require('bcryptjs');


// Crear servidor
const app = express();


//Conectar BD

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'taiko_super_star'
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});

// Middleware
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs');


app.get('/main', (req,res) => {
    res.sendFile(path.join(__dirname,'views','index.html'));
});


app.get('/mainPas', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'index2.html'));
});

// ------ PÁGINA REGISTER ---------

app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','register.html'));
});

app.get('/myspace',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','myspace.html'));
});

app.get('/about-us',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','aboutUs.html'));
});

app.get('/videogame',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','videogame.html'));
});

app.get('/world-score',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','worldScore.html'));
});

app.get('/contact',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','contact.html'));
});


    // Subir datos a la BD ** Registra al usuario **

app.post("/register", (req,res) => {
    const name = req.body.nameUsuario;
    const user = req.body.userUsuario;
    const gender = req.body.genderUser;
    const email = req.body.emailUsuario;
    const age = req.body.ageUsuario;
    const country = req.body.country;
    const type = req.body.userType;
    const password = req.body.passwordUsuario;
    const confirmPass = req.body.passwordConfirmarUsuario;
    if (password == confirmPass){
        connection.query('INSERT INTO login SET ?', {
            userName: name,
            userUser: user,
            gender: gender,
            birth: age,
            userType: type,
            country:country,
            email:email, 
            password:password
        }, (error,results) => {
            if(error){
                console.log(error);
            }else{
                if(type == 'PAS'){
                    res.render ('register.html' , {
                        alert: true,
                        alertTitle: "Registration",
                        alertMessage: "Successful Registration",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: 'mainPAS'
                    })
                }else{
                    res.render ('register.html' , {
                        alert: true,
                        alertTitle: "Registration",
                        alertMessage: "Successful Registration",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: 'main'
                    })
                }
            }
        });
    }else{
        console.log("Las contraseñas no coinciden");
        res.render ('register.html' , {
            alert: true,
            alertTitle: "Password does not match",
            alertMessage: "",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 0,
            ruta: 'register'
        })
    }   
});

// ----------- PÁGINA LOGIN ---------

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','login.html'));
});

    // Valida al usuario ** Loggea al usuario **

app.post("/login", (req,res) => {
    const email = req.body.emailUsuario;
    const password = req.body.passwordUsuario;
    if(email && password){
        connection.query('SELECT * FROM login WHERE email = ?', [email], (error,results) =>{
            const pass = results[0].password; 
            if(password != pass){
                res.render ('login.html' , {
                    alert: true,
                    alertTitle: "Incorrect user / password",
                    alertMessage: "",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                })
                console.log('Usuario incorrecto');
            }else{
                console.log('Usuario correcto');
                res.render ('login.html' , {
                    alert: true,
                    alertTitle: "Login",
                    alertMessage: "Successful",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: 'main'
                })
            }
        })
    }
                
    });

app.listen(8081,()=> console.log("Servidor en línea en el puerto 8081"));


// ----------------------------------------------------------------------

    //   ******** PLANTILLAS PARA CONEXIÓN BD ***********


// Consulta a BD MySQL

    // Por tabla
    app.get('/destino',(req,res)=>{
        const consulta = 'SELECT * FROM destino';
        connection.query(consulta,(error,results) => {
          if (error) throw error;
          if (results.length > 0){
              res.json(results);
          }else{
              res.send('No hay resultados');
          }
        });
    });
    
    
        //Por ID
    app.get('/usuario/:id',(req,res)=>{
        const {id} = req.params;
        const consulta = `SELECT * FROM login WHERE clave = ${id}`;
        connection.query(consulta,(error,results) => {
            if (error) throw error;
            if (results.length > 0){
                res.json(results);
            }else{
                res.send('No hay resultados');
            }
        });
    });
    
    // -----------------------------------------------------------------------