const path = require('path');

const express = require('express');

const app = express();

app.get('/main', (req,res) => {
    res.sendFile(path.join(__dirname,'views','index.html'));
});

app.listen(8081,()=>console.log("Servidor en línea en el puerto 8081"));