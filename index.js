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


app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','login.html'));
});

app.post('/pruebaDatos',(req,res)=>{
    console.log('Pase por prueba datos');
    console.log(req.body);
    res.redirect('/main');
});

// Para subir datos a la BD
app.post("/login", async(req,res) => {
    const email = req.body.emailUsuario;
    const password = req.body.passwordUsuario;
    const confirmPass = req.body.passwordConfirmarUsuario;
  
    let passwordHaash = await bcryptjs.hash(password,8);
    connection.query('INSERT INTO login SET ?', {email:email, password:passwordHaash, 'confirm password':passwordHaash }, async(error,results) => {
      if(error){
          console.log(error);
      }else{
          res.send("Alta exitosa");
      }
    });
});

app.listen(8081,()=> console.log("Servidor en línea en el puerto 8081"));


// ----------------------------------------------------------------------

    //   ******** PLANTILLAS PARA CONEXIÓN BD ***********


/* app.get('/plantillaEJS', (req,res)=> {
    // Simular una consulta a la BS
    const consulta = [
        {usuarioUsuario: 'Maria', password: "efewf", edad:18},
        {usuarioUsuario: 'Juan', password: "jsked", edad:18},
        {usuarioUsuario: 'Maria', password: "efewf", edad:18},
        {usuarioUsuario: 'Juan', password: "jsked", edad:18},
        {usuarioUsuario: 'Maria', password: "efewf", edad:18},
        {usuarioUsuario: 'Juan', password: "jsked", edad:18}

    ];
    res.render('ejemploEJS.html',{
        personas: consulta,
        sesion: "Autorizada",
        fecha: 2021
    });
}); */


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