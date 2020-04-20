var $$ = Dom7;

var app = new Framework7({
  root: '#app',
  name: 'My App',
  id: 'com.myapp.test',
  panel: {
    swipe: 'left',
  },
  routes: [
    {
      path: '/index/',
      url: 'index.html',
    },
    {
      path: '/menu/',
      url: 'menu.html',
    },
    {
      path: '/category/',
      url: 'category.html',
    },
    {
      path: '/new/',
      url: 'new.html',
    },
    {
      path: '/list/',
      url: 'list.html',
    },
    {
      path: '/register/',
      url: 'register.html',
    },
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');
var email_login;
var db, refProducto;
var categoria, nombre, precio;

$$(document).on('deviceready', function(e) {
  console.log("Inicializado: Dispositivo");

  db = firebase.firestore();
  refProducto = db.collection("PRODUCTO");
 
});

$$(document).on('page:init', function (e) {
  console.log("Inicializado: Inicio genérico");
});

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  console.log("Inicializado: Index");

  $$('#btn_registrarse').on('click', fnRegistro);
  $$('#btn_login').on('click', fnLogin);
});

$$(document).on('page:init', '.page[data-name="menu"]', function (e) {
  console.log("Inicializado: Menu");
  $$('#btn_guardarDatos').on('click', fnNuevoProducto);
});

$$(document).on('page:init', '.page[data-name="category"]', function (e) {
  console.log("Inicializado: Categorias");
});

$$(document).on('page:init', '.page[data-name="subcategory"]', function (e) {
  console.log("Inicializado: SubCategoria");
});

$$(document).on('page:init', '.page[data-name="list"]', function (e) {
  console.log("Inicializado: Lista");
});

$$(document).on('page:init', '.page[data-name="register"]', function (e) {
  console.log("Inicializado: Registro");

  $$('#btn_registrarse').on('click', fnRegistro);
});

$$(document).on('page:init', '.page[data-name="new"]', function (e) {
  console.log("Inicializado: Nuevo Producto");
});


/*Funciones*/
function fnRegistro() {
  var registro_mail = $$('#register_mail').val();
  var registro_pass = $$('#register_pass').val();

  var mostrarError = 0;

  firebase.auth().createUserWithEmailAndPassword(registro_mail, registro_pass)
  
  .catch(function(error) {       
    var errorCode = error.code;
    var errorMessage = error.message; 
    
    console.log(errorCode);
    console.log(errorMessage);
  })

  .then(function(){
      if(mostrarError == 0){
        console.log('Registro exitoso');
        mainView.router.navigate("/index/");
      }
  });
}

function fnLogin() {

  email_login = $$('#login_email').val();
  var pass_login = $$('#login_pass').val();
  console.log(email_login);
  console.log(pass_login);
  var mostrarError = 0;
      
  firebase.auth().signInWithEmailAndPassword(email_login, pass_login)
      .catch(function(error){
          mostrarError = 1;
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
          console.log(errorCode);
          
          
        })
        
      .then(function(){
        if (mostrarError == 1) {
          switch (errorCode) {
            case "auth/wrong-password":
              console.log("Usuario o contraseña incorrecta");
              break;
            default:
              break;
          }  
          console.log("login incorrecto");
      } else {
        console.log("login correcto");
        mainView.router.navigate("/menu/");
      }
    });
}

function fnCargaUsuario() {
  //datos de carga de usuario
}

function fnNuevoProducto() {
  categoria = $$('#inpProdNuevo_Categoria').val();
  nombre = $$('#inpProdNuevo_Nombre').val();
  precio = $$('#inpProdNuevo_Precio').val();
  
  var data_prodNuevo = {
    categoria: categoria,
    nombre: nombre,
    precio: precio,
  }

  refProducto.doc(email_login)
    .set(data_prodNuevo);

  console.log("Producto ingresado");
  mainView.router.navigate("/menu/");
}