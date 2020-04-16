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
        path: '/subcategory/',
        url: 'subcategory.html',
      },
      {
        path: '/list/',
        url: 'list.html',
      },
    ]
    // ... other parameters
  });

var mainView = app.views.create('.view-main');
var email_login;
var db, refUsuarios, refTiposUsuarios;

$$(document).on('deviceready', function(e) {
  console.log("Inicializado: Dispositivo");

  $$('#btn_registrarse').on('click', fnRegistro);
  $$('#btn_login').on('click', fnLogin);

});

$$(document).on('page:init', function (e) {
  console.log("Inicializado: Inicio genérico");
});

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  console.log("Inicializado: Index");
});

$$(document).on('page:init', '.page[data-name="menu"]', function (e) {
  console.log("Inicializado: Menu");
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
        mainView.router.navigate("/menu/");
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
          console.log("login incorrecto")
        } else {
          console.log("login correcto")  
        }
      });
}