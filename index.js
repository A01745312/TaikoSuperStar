// Importar librerias
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');


// Crear servidor
const app = express();


// Conectar BD

/* const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'telcel'
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
}); */

// Middleware
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs');


app.get('/main', (req,res) => {
    res.sendFile(path.join(__dirname,'views','index.html'));
});

// ----------------------------------------------------------------------

    //   ******** PLANTILLAS PARA CONEXIÓN BD ***********


app.get('/plantillaEJS', (req,res)=> {
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
});


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
app.get('/destino/:id',(req,res)=>{
    const {id} = req.params;
    const consulta = `SELECT * FROM destino WHERE clave = ${id}`;
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


app.listen(8081,()=> console.log("Servidor en línea en el puerto 8081"));