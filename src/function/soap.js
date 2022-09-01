const { base64encode, base64decode } = require('nodejs-base64');
const base64 = require('base64topdf');
var soap = require('soap');
const fs = require('fs');
const path = require('path');

async function consultarExamenes(tipoConsulta, usuario, clave) {
    return new Promise((resolve, reject) => {
        const security = new soap.BasicAuthSecurity(process.env.username, process.env.password);
        const wsdl_headers = {};
        security.addHeaders(wsdl_headers);
        soap.createClientAsync(process.env.WSDL, {
            wsdl_headers,
            wsdl_options: {
                rejectUnauthorized: false,
                strictSSL: false
            }
        }).then((value) => {
            value.setSecurity(security);
            let args = {
                "tipoConsulta": tipoConsulta,
                "usuario": usuario,
                "clave": clave,
            }
            value.Examenes.ExamenesSoap.consultarExamenes(args, function (err, response) {
                if (err) {
                    console.log("error", err);
                } else {
                    resolve(response);
                }
            })
        }).catch((err) => {
            console.log("error", err);
        })

    })
}

async function informeExamen(idExamenConsulta) {
    return new Promise((resolve, reject) => {
        const security = new soap.BasicAuthSecurity(process.env.username, process.env.password);
        const wsdl_headers = {};
        security.addHeaders(wsdl_headers);
        soap.createClientAsync(process.env.WSDL, {
            wsdl_headers,
            wsdl_options: {
                rejectUnauthorized: false,
                strictSSL: false
            }
        }).then((value) => {
            value.setSecurity(security);
            let args_ = {
                "idExamenConsulta": idExamenConsulta,
            }
            value.Examenes.ExamenesSoap.informeExamen(args_, function (err, response) {
                if (err) {
                    console.log("error", err);
                } else {
                    if (response != null) {
                        base64.base64Decode(response.pdf, path.join(__dirname, `../public/pdf/${idExamenConsulta}.pdf`))
                        resolve({
                            "pdf": `${process.env.host}${idExamenConsulta}.pdf`
                        });
                    }else{
                        resolve("error");
                    }
                }
            })
        }).catch((err) => {
            console.log("error", err);
        })
    })
}

function isKeyExists(obj, key) {
    return key in obj;
}
module.exports = {
    consultarExamenes,
    informeExamen
}