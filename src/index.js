const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
require('./function/soap');
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const { consultarExamenes, informeExamen } = require('./function/soap');


const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.json({
    limit: '150mb',
    extended: true
}));
app.use(express.urlencoded({
    limit: '150mb',
    extended: true
}));

app.use("/pdf", express.static(path.join(__dirname, './public/pdf/')))

app.post('/api/solca', async (req, res) => {
    const { tipoConsulta, usuario, clave } = req.body;
    const results = await consultarExamenes(tipoConsulta, usuario, clave)
    res.json(results);
});

app.post('/api/solca_pdf', async (req, res) => {
    const { idExamenConsulta } = req.body;
    const result = await informeExamen(idExamenConsulta)
    res.json(result);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
})