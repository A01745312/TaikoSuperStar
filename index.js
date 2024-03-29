// Import libraries
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// create serverr
const app = express();


// Connect Database

const connection = mysql.createConnection({
    host: "sql304.main-hosting.eu",
    database: 'u621336810_taiko',
    password: 'M@ckup2022_',
    user: 'u621336810_taiko'
});

connection.connect((error) => {
  if (error) throw error;
  console.log("Connected to database " );
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

// ------ REGISTER PAGE ---------

app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','register.html'));
});


app.get('/videogame',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','videogame.html'));
});

app.get('/world-score',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','worldScore.html'));
});

app.get('/contact',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','tlou.html'));
});

app.get('/downloadGame',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','dvgame.html'));
});


    // Upload data to the DB ** Register the user **

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
    if(user && email){
        connection.query('SELECT * FROM jugador WHERE Username = ? OR Correo = ?', [user, email], (error,results) =>{
            console.log(results);
            if (results != 0){
                const us_name = results[0].Username; 
                const mail = results[0].Correo;
                if(user == us_name){
                    res.render ('register.html' , {
                        alert: true,
                        alertTitle: "User already in use, choose other",
                        alertMessage: "",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'register'
                    })
                    console.log('User taken');
                }else if(email == mail){
                    res.render ('register.html' , {
                        alert: true,
                        alertTitle: "Email has been registered, please login",
                        alertMessage: "",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'register'
                    })
                    console.log('Email already registered');
                }
            }else{
                if (password == confirmPass){
                    const tam = password.length;
                    if (tam >= 8){
                        connection.query('INSERT INTO jugador SET ?', {
                            Nombre: name,
                            Username: user,
                            Genero: gender,
                            FechadeNacimiento: age,
                            TipoDeUsuario: type,
                            Nacionalidad:country,
                            Correo:email, 
                            Contraseña:password
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
                        console.log("Passwords less than 8 digits");
                        res.render ('register.html' , {
                            alert: true,
                            alertTitle: "ERROR",
                            alertMessage: "Password must be of at least 8 digits",
                            alertIcon: 'error',
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'register'
                        })            
                    }
                }else{
                    console.log("Passwords do not match");
                    res.render ('register.html' , {
                        alert: true,
                        alertTitle: "ERROR",
                        alertMessage: "Password does not match",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'register'
                    })
                } 
            }
        }
    )}
      
});

// ----------- LOGIN PAGE ---------

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','login.html'));
});

    // Validate the user ** Log the user **

app.post("/login", (req,res) => {
    const correo = req.body.emailUsuario;
    const password = req.body.passwordUsuario;
    if(correo && password){
        connection.query('SELECT * FROM jugador WHERE Correo = ?', [correo], (error,results) =>{
            console.log(results);
            if (results==0){
                res.render ('login.html' , {
                    alert: true,
                    alertTitle: "Email not registered",
                    alertMessage: "",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                })
            }
            else{

            

            const pass = results[0].Contraseña;


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
                const type = results[0].TipoDeUsuario;
                if(type == 'PAS'){
                    res.render ('login.html' , {
                        alert: true,
                        alertTitle: "Login",
                        alertMessage: "Successful  Welcome PAS member",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: 'mainPAS'
                    })
                }else{
                    res.render ('login.html' , {
                        alert: true,
                        alertTitle: "Login",
                        alertMessage: "Successful Welcome!",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: 'main'
                    })
                }
            }}
                
        })
    }
                
});

app.listen(8081,()=> console.log("Servidor en línea en el puerto 8081"));


// ----------------------------------------------------------------------