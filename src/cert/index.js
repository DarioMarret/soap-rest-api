import mkcert from 'mkcert'
import path from 'path'
import 'dotenv/config'
import fs from 'fs'

const exiteCERT = fs.existsSync(path.join(__dirname, './crt.crt'))
if(!exiteCERT){
    (async () => {
        const ca = await mkcert.createCA({
            organization: 'Hello CA',
            countryCode: 'NP',
            state: 'Bagmati',
            locality: 'Kathmandu',
            validityDays: 365
        });
        const cert = await mkcert.createCert({
            domains: ['127.0.0.1', 'codigomarret.com', 'codigomarret.com'],
            validityDays: 365,
            caKey: ca.key,
            caCert: ca.cert
        });
        var filecrt = "./src/cert/crt.crt";
        fs.writeFile(filecrt, cert.cert, (err) => {
            if (err)
                console.log(err);
        })
        var fileket = "./src/cert/crt.key";
        fs.writeFile(fileket, cert.key, (err) => {
            if (err)
                console.log(err);
        })
    })()
}