var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); // una vez instalada la dependencia npm i express-session poner esta linea y la linea 9


require('dotenv').config(); // una vez que creamos el .inv y le pasamos los datos que esta en el archivo es necesario generar esta linea y de la linea26 a la 30

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'lavalle1914', //clave de acceso
  resave: false,
  saveUninitialized: true
}));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

//
app.get('/', function(req, res){
  var conocido = Boolean(req.session.nombre);

  res.render('index', {
    title: 'sesiones en express.js',
    conocido: conocido, // almacena el dato nombre que le pase ingrese
    nombre: req.session.nombre

  });
});

//captura los datos 
app.post('/ingresar', function(req, res){
  if(req.body.nombre){
    req.session.nombre = req.body.nombre 
  }
res.redirect('/');
});

// para destruir la sesion y desloguear

app.get('/salir', function(req, res){
  req.session.destroy();
  res.redirect('/');

});

//MIDLEWARE

app.use(function(req,res,next){

  if(!req.session.vistas){
    req.session.vistas = {};
  }

    if(!req.session.vistas[req.originalUrl]){
      req.session.vistas[req.originalUrl] = 1;

    } else{
      req.session.vistas[req.originalUrl]++;
    }
    console.log(req.session.vistas);

    next();

});

app.get('/nosotros', function(req,res){
  res.render('pagina',{
    nombre: 'nosotros',
    vistas: req.session.vistas[req.originalUrl]
  });
});


app.get('/contacto', function(req,res){
  res.render('pagina',{
    nombre: 'contacto',
    vistas: req.session.vistas[req.originalUrl]
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
