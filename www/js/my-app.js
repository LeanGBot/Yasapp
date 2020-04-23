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
    {
      path: '/newcateg/',
      url: 'newcateg.html',
    },
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');

var email_login, e;
var db, refUsuario, refCategoria, refProducto;
var categoria, idProd, catNueva, precio;


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

$$(document).on('page:init', '.page[data-name="newcateg"]', function (e) {
  console.log("Inicializado: Crear Categoria");
  $$('#btn_añadirCat').on('click', fnCrearCategoria);

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

  $$('#btn_guardarDatos').on('click', fnNuevoProducto);
  $$('#selectCat').on('change', fnSelectedValue);
 

  fnListaCategoria();
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
} //registro

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
} //login con email y pass

function fnLoginGoogle() {
  /*console.log("Ingreso en fnLoginGoogle")
  var provider = new firebase.auth.GoogleAuthProvider();
 
  firebase.auth()
    .signInWithPopup(provider)
    .then(function(result) {
    var token = result.credential.accessToken;
    var user = result.user;
    console.log("logueado con google")
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(Cod: errorCode);
    console.log(Msj: errorMessage);
    var email = error.email;
    var credential = error.credential;
  });
 */
} //login con google (probar cambio de versiones)

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
   
        
        console.log("Ingreso en fnCargaUsuario");
        console.log(email_login);
        db = firebase.firestore();
        refUsuario = db.collection('USUARIOS');



var mailRef = db.collection(email_login);
var query = mailRef.where("precio", ">", 1);
console.log(query);



/*        
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
*/
} //Seccion que se ejecuta en la carga de productos segun su categoria

function fnCrearCategoria() {
  db = firebase.firestore();
  refCategoria = db.collection(email_login).doc("CATEGORIAS");
  var nuevaCategoria = $$('#inpNuevaCategoria').val();
  
  refCategoria.get()
  .then(function(doc) {
    if (doc.exists) {
      refCategoria.update({
        cat: firebase.firestore.FieldValue.arrayUnion(nuevaCategoria)
      });
      console.log("Nuevo ingreso creado")
      fnListaCategoria();
    } else {
      refCategoria.set({
        cat: [nuevaCategoria],
      })
      .then(function() {
        console.log("Documento creado");
        fnListaCategoria();
      })
      .catch(function(error) {
        console.log("Error: ", error);
      });
    }
  }).catch(function(error) {
    console.log("Error:", error);
  });

} //Seccion que se ejecuta al crear una categoria nueva en "/new/"

function fnListaCategoria() {
  db = firebase.firestore();
  refCategoria = db.collection(email_login).doc("CATEGORIAS");

  refCategoria.get()
  .then(function(doc){
    if (doc.exists) {
      var categoriasCreadas = doc.data().cat;
      console.log(categoriasCreadas);
    }
    for (i=0; i<categoriasCreadas.length; i++) {
      $$('#selectCat').append('<option value="'+ categoriasCreadas[i] +'">'+ categoriasCreadas[i] +'</option>');
      console.log('<option value="'+ categoriasCreadas[i] +'">'+ categoriasCreadas[i] +'</option>');
    };
  })
  .catch(function(error){
    console.log("Error: " + error);
  });
} //Funcion que genera la lista de categorias

function fnNuevoProducto() {

  db = firebase.firestore();
  refProducto = db.collection(email_login).doc("PRODUCTOS");

  idProd = $$('#inpProdNuevo_Nombre').val();
  precio = $$('#inpProdNuevo_Precio').val();
  categoria = $$('#inpProdNuevo_Categoria').val();
  
  var dataProducto = {
    nombre: idProd,
    categoria: categoria,
    precio: precio,
  }

  refProducto.set(dataProducto)
  .then(function(){
    console.log("Data ingresada con exito!");
  })
  .catch(function(error){
    console.log("error setteo dataProducto");
  })
  
  console.log("Producto añadido");
  mainView.router.navigate("/menu/");
} //Seccion encargada de escribir las colecciones y documentos en la DB

function fnFoto(){

} //Seccion de captura de imagenes

function fnSelectedValue(){
  var e = $$('#selectCat').value;
  var e = $$('#selectCat_n').value;
  console.log(e + " 1");
  console.log(e + " 2");
} //Seccion que debe almacenar lo seleccionado en "selectCat" en /new/