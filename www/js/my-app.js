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
var db, refUsuario, refCategoria, refProducto;
var categoria, idProd, plantilla, catNueva, precio;


$$(document).on('deviceready', function(e) {
  console.log("Inicializado: Dispositivo");

 
});

$$(document).on('page:init', function (e) {
  console.log("Inicializado: Inicio genérico");

});

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  console.log("Inicializado: Index");
  
  $$('#btn_registrarse').on('click', fnRegistro);
  $$('#btn_login').on('click', fnLoginEmailPass);
  $$('#signUpGoogle').on('click', fnLoginGoogle);
});

$$(document).on('page:init', '.page[data-name="menu"]', function (e) {
  console.log("Inicializado: Menu");
});

$$(document).on('page:init', '.page[data-name="category"]', function (e) {
  console.log("Inicializado: Categorias");
});

$$(document).on('page:init', '.page[data-name="list"]', function (e) {
  console.log("Inicializado: Lista");
  fnCargaUsuario();

});

$$(document).on('page:init', '.page[data-name="register"]', function (e) {
  console.log("Inicializado: Registro");
  
  $$('#btn_registrarse').on('click', fnRegistro);
});

$$(document).on('page:init', '.page[data-name="new"]', function (e) {
  console.log("Inicializado: Nuevo Producto");

 
  /*
  refUsuario = db.collection(email_login);
  refCategoria = db.collection("USUARIOS").doc(email_login).collection("CATEGORIAS").doc(categoria);
  refProducto = db.collection("USUARIOS").doc(email_login).collection("PRODUCTOS").doc(idProd);
  */

  console.log(email_login);
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

function fnLoginEmailPass() {

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
          console.log("login incorrecto");
        } else {
          console.log("login correcto");
          mainView.router.navigate("/menu/");
        }
      });
}

function fnLoginGoogle() {
  /*console.log("Ingreso en funcion loginGoogle")
  var provider = new firebase.auth.GoogleAuthProvider();
 
  firebase.auth().signInWithPopup(provider).then(function(result) {

    var token = result.credential.accessToken;
    var user = result.user;
 
  }).catch(function(error) {
 
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("logueado con google")

    var email = error.email;
    var credential = error.credential;
  });
 */
}

function fnCargaUsuario() {

      // Referencia a la coleccion de ciudades
 //     db = firebase.firestore();
   //   var refProductos = db.collection(login_email).doc("productos");
   
      //("productos");

      
      /* 
      TRAER TODAS LAS CAT
      db.collection('USUARIOS').doc(email).collection('CATEGORIAS').get()
          -> query snapshot 
              -> forEACH {
                    por cada categoria
                    cat = EL NOMBRE DE LA CAT....

                    db.collection('USUARIOS').doc(email).collection('PRODCUTOS').where('categoria','==', cat).limit(1)
              }    
      */
/*
     var db = firebase.firestore();
         //pruebas *
         refCategorias = db.collection('USUARIOS').doc(email_login).collection('CATEGORIAS').doc(categorias)
         refProductos = db.collection('USUARIOS').doc(email_login).collection('PRODUCTOS ').doc(idProd)
         //pruebas *
         */     
        
        console.log("Ingreso en fnCargaUsuario");
        console.log(email_login);
        db = firebase.firestore();
        refUsuario = db.collection('USUARIOS');
        
        refUsuario.get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
           console.log("data:" + doc.data());
           console.log("dsakdlallll");
          });
        })
        .catch(function(error) {
          console.log("Error: ", error);
        });

}

function fnCrearCategoria() {
  console.log("ingreso en fnCrearCategoria")

}

function fnNuevoProducto() {
  
  idProd = $$('#inpProdNuevo_Nombre').val();
  precio = $$('#inpProdNuevo_Precio').val();
  categoria = $$('#inpProdNuevo_Categoria').val();
  
  var dataProducto = {
    nombre: idProd,
    precio: precio,
    categoria: categoria,
  }
 
  db = firebase.firestore();
  db.collection('USUARIOS').doc(email_login).collection(categoria).doc(idProd).set(dataProducto);
  
  console.log("Producto añadido");
  mainView.router.navigate("/menu/");
}