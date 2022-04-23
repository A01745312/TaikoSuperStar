// Importar librerias
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');


// Crear app
const app = express();

// Middleware
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs');

// 
app.get('/main', (req,res) => {
    res.sendFile(path.join(__dirname,'views','index.html'));
});

app.get('/login', (req,res)=>{

    // Leyendo la información 
    res.send('<h1> Mira la consola</h1><br/><h2>'+req.params.usuario+'</h2>');
    console.log(`Hola ${req.params.pais} buen día`);
    console.log("Hola " +req.params.usuario+ " buen día concatenado");
    console.log(req.params);
});


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
        personas:consulta,
        sesion: "Autorizada",
        fecha: 2021
    });
});



app.listen(8081,()=>console.log("Servidor en línea en el puerto 8081"));