var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', async(req , res, next) => { // ES ASYNC PORQUE NOSE CUANDO EL USUARIO PUEDE INGRESAR ESTOS DATOS

  console.log(req.body) //captura de datos

  var nombre = req.body.nombre;
  var apellido = req.body.apellido;
  var email = req.body.email;
  var tel = req.body.tel;
  var mensaje = req.body.mensaje;

  var obj = {

    to: 'juampa.alvarez@hotmail.com',
    subject: 'contacto desde la web',
    html: nombre + " " + apellido + " se contacto y quiere mas info a traves de este correo: " + email + ".<br> ademas hizo el siguiente comentario: " + mensaje + ".<br> su tel es: " + tel 
  } //cierra el obj

  var transporter = nodemailer.createTransport({
  
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  }) // CIERRE DE TRANSPORTER

  var info = await transporter.sendMail(obj);

  res.render('index', {

    message: 'mensaje enviado correctamente',

  })


}) // cierre de router.post 



module.exports = router;
