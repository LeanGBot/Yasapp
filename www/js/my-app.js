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
var login_email;
var db, refUsuario;
var categoria, idProd, plantilla, catNueva, precio;

$$(document).on('deviceready', function(e) {
  console.log("Inicializado: Dispositivo");

  db = firebase.firestore();
  refUsuario = db.collection(login_email);
 
});

$$(document).on('page:init', function (e) {
  console.log("Inicializado: Inicio genérico");

});

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  console.log("Inicializado: Index");
  login_email = $$('#login_email').val()

  $$('#btn_registrarse').on('click', fnRegistro);
  $$('#btn_login').on('click', fnLogin);
});

$$(document).on('page:init', '.page[data-name="menu"]', function (e) {
  console.log("Inicializado: Menu");

 
});

$$(document).on('page:init', '.page[data-name="category"]', function (e) {
  console.log("Inicializado: Categorias");

  fnCargaUsuario();
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
  db = firebase.firestore();
  refUsuario = db.collection(login_email);
  
  $$('#btn_guardarDatos').on('click', fnNuevoProducto);
  $$('#añadirCat').on('click', fnCrearCategoria);
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
  
  



}

function fnCrearCategoria() {
  console.log("ingreso en fnCrearCategoria")

}

function fnNuevoProducto() {
  
  idProd = $$('#inpProdNuevo_Nombre').val();
  categoria = $$('#inpProdNuevo_Categoria').val();
  precio = $$('#inpProdNuevo_Precio').val();
  
  var dataProducto = {
    nombre: idProd,
    precio: precio,
    categoria: categoria,
  }
  
  refUsuario.doc(idProd).set(dataProducto);
  
  console.log("Producto añadido");
  mainView.router.navigate("/menu/");
}