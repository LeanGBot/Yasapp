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
      path: '/resume/',
      url: 'resume.html',
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

var email_login;
var db, refUsuario, refCategoria, refProducto;
var categoria, idProd, precio, cSel, total;
var idExistentes = [];

$$(document).on('deviceready', function(e) {
  console.log("Inicializado: Dispositivo");

 
});

$$(document).on('page:init', function (e) {
  console.log("Inicializado: Inicio genérico");

});

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
  console.log("Inicializado: Index");
  
  window.localStorage.clear();
  idExistentes=[];

  $$('#btn_registrarse').on('click', fnRegistro);
  $$('#btn_login').on('click', fnLoginEmailPass);
  $$('#signUpGoogle').on('click', fnLoginGoogle);
  
});

$$(document).on('page:init', '.page[data-name="menu"]', function (e) {
  console.log("Inicializado: Menu");
  $$('.btn_usuario').on('click', fnUsuario);
  window.localStorage.clear();
  idExistentes=[];

});

$$(document).on('page:init', '.page[data-name="resume"]', function (e) {
  console.log("Inicializado: Categorias");
  $$("#btn_Calcular").on('click', fnCalcular);
  $$("#btn_Finalizar").on('click', fnFinalizar);
  fnResume();
});

$$(document).on('page:init', '.page[data-name="newcateg"]', function (e) {
  console.log("Inicializado: Crear Categoria");
  $$('#btn_añadirCat').on('click', fnCrearCategoria);

});

$$(document).on('page:init', '.page[data-name="list"]', function (e) {
  console.log("Inicializado: Lista");
  window.localStorage.clear();
  idExistentes=[];
  
  for (i=0; i<idExistentes.length; i++) {
    var ventas = {tot:0};
    var storage = window.localStorage;
  
    var IDaGuardar = JSON.stringify(ventas);
    storage.setItem(idExistentes[i],IDaGuardar);
  }

  fnCargaUsuario();
});

$$(document).on('page:init', '.page[data-name="register"]', function (e) {
  console.log("Inicializado: Registro");
  
  $$('#btn_registrarse').on('click', fnRegistro);
});

$$(document).on('page:init', '.page[data-name="new"]', function (e) {
  console.log("Inicializado: Nuevo Producto");

  $$('#btn_guardarDatos').on('click', fnNuevoProducto);
  $$('#selectCat').on('change', fnValorSeleccion);
  $$('#selectCat').html("");
  fnListaCategoria();
});

/*Funciones*/
function fnRegistro() {
  var registro_mail = $$('#register_mail').val();
  var registro_pass = $$('#register_pass').val();
  var mostrarError = 0;

  if ($$("#register_pass")==$$("#val_pass")) {
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
  } else {
    alert("Las contraseñas no coinciden");
  }

} //registro

function fnLoginEmailPass() {
  email_login = $$('#login_email').val();

  var pass_login = $$('#login_pass').val();
  var mostrarError = 0;
  firebase.auth().signInWithEmailAndPassword(email_login, pass_login)
      .catch(function(error){
        mostrarError = 1;
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
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

function fnUsuario() {
mainView.router.navigate("/index/"); 
} //Devuelve a seleccion de usuario

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
  db = firebase.firestore();
  refProducto = db.collection(email_login).doc("PRODUCTOS");
  refCategoria = db.collection(email_login).doc("CATEGORIAS");
  refColProd = db.collection(email_login);

  refCategoria
  .get()
  .then(function(doc){
    if (doc.exists) {
      var categoriasCreadas = doc.data().cat;
      console.log(categoriasCreadas);
      
      for (c=0; c<categoriasCreadas.length; c++) {
        var listado_cat = "<div class='seccionCategoria' id='dyn_"+categoriasCreadas[c]+"'><strong>"+categoriasCreadas[c]+"</strong></div>";
        $$('#dyn_cat').append(listado_cat);
      };
    }
  })
  .catch(function(error){
    console.log("ErrorRef: " + error);
  });
  
        refColProd
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            idExistentes.push('#'+doc.data().id);
            
            nCategoria = "#dyn_"+doc.data().categoria;
            $$(nCategoria)
            .append(
               "<div class='seccionProducto'>" +  
                "<div class='btn_decremento'><button onclick='fnCantidad(this.id)' id='d_"+doc.data().id+"' class='col button color-red button-fill'>-</button></div>" +
                  "<img class='prodPic elevation-3 fadeListaProd' id='img_"+doc.data().id+"' src='' alt='"+doc.data().id+"'.jpg'>" +
                  "<div class='prodEspecificacion'>" +
                    "<div style='font-size:18px'>"+doc.data().nombre+"</div>" +
                    "<div id='p_"+doc.data().id+"'>"+doc.data().precio+"</div>" +
                    "<div id='"+doc.data().id+"'>0</div>" +
                    "<div id='t_"+doc.data().id+"'>0</div>" +
                  "</div>" +
                  "<div class='btn_incremento'><button onclick='fnCantidad(this.id)' id='i_"+doc.data().id+"' class='col button button-fill'>+</button></div>" +
               "</div>"
              );

              var storageRef = firebase.storage().ref().child(email_login+"/"+doc.data().id+".jpg");
              storageRef
              .getDownloadURL()
              .then(function(url) {
              
                var urlImg = url;
                $$("#img_"+doc.data().id).attr("src",urlImg);
                console.log(urlImg);
              })


            });
          })
        .catch(function(error){console.log("Error en refProducto:"+ error)});
        console.log("idExistentes: "+idExistentes);
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
      alert("Nueva categoria creada");
      mainView.router.navigate("/new/");
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

var idAux, contID = 0;
function fnCantidad(idIngreso){
  var idSplit = idIngreso.split("_");
  p0 = idSplit[0];
  p1 = idSplit[1];
  idArreglo = "#" + p1;
  precioID = "#p_" + p1;
  totalID = "#t_" + p1;
  contID = $$(idArreglo).html();
  factor1 = $$(precioID).html();

  if (p0 == "i") {
    contID++;
    $$(idArreglo).html(contID);
  }else{
    if (contID <= 0) {
      $$(idArreglo).html(0);
    } else {
      contID--;
      $$(idArreglo).html(contID);
    }
  }
  
  factor2 = $$(idArreglo).html();
  totalP = factor1 * factor2;
  $$(totalID).html(totalP);
  

  var ventas = {tot:totalP};
  var storage = window.localStorage;

  var IDaGuardar = JSON.stringify(ventas);
  storage.setItem(idArreglo,IDaGuardar);


} // Cambio de unidades de productos

function fnNuevoProducto() {

  db = firebase.firestore();
  refProducto = db.collection(email_login).doc("PRODUCTOS");
  refColProd = db.collection(email_login);  
  refIncremento = db.collection(email_login);
  
  idProd = $$('#inpProdNuevo_Nombre').val();
  precio = $$('#inpProdNuevo_Precio').val();
  categoria = document.getElementById("selectCat").value;
  idG = (fnGeneradorID(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'));

  var dataProducto = {
    nombre: idProd,
    categoria: categoria,
    precio: precio,
    id: idG,
  }
  
  refColProd.doc(idProd).set(dataProducto)
  .then(function(){

    console.log("Producto creado!");
  })
  .catch(function(error){
    console.log("error setteo dataProducto");
  })
  getImage();
  mainView.router.navigate("/menu/"); 
} //Seccion encargada de escribir las colecciones y documentos en la DB --Listo--

function fnGeneradorID(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
} //Generador de ID alfanumerico

function fnValorSeleccion(){
  var cSel = document.getElementById("selectCat").value;
  console.log(cSel);
  
} //Seccion que debe almacenar lo seleccionado en "selectCat" en /new/

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
      var listado = "<option value='"+ categoriasCreadas[i] +"'>" + categoriasCreadas[i] + "</option>";
      $$('#selectCat').append(listado);
    };
  })
  .catch(function(error){
    console.log("Error: " + error);
  });
} //Funcion que genera la lista de categorias

function fnListaProductos() {
  db = firebase.firestore();
  refProducto = db.collection(email_login).doc("PRODUCTOS");
  refCategoria = db.collection(email_login).doc("CATEGORIAS");
  refColProd = db.collection(email_login);

  refCategorias.get()
  .then(function(doc){
    if (doc.exists) {
      var categoriasCreadas = doc.data().cat;
      console.log(categoriasCreadas);
    }
    for (c=0; c<categoriasCreadas.length; c++) {
      var listado_cat = "<div id='"+ categoriasCreadas[i] +"'></div>";
      $$('#dyn_cat').append(listado_cat);
      refColProd.get()
      for (p=0; c<productosCreados.length; p++) {
        var productosCreados = doc.data().cat;
        var listado_prod = refProducto.where("cat","==", categoriasCreadas[i]);
        $$("#dyn_"+ categoriasCreadas[i]).append(listado_prod);
      }

      
    };
  })
  .catch(function(error){
    console.log("Error: " + error);
  });
} //Funcion que genera la lista visual de productos ingresados en /list/

function fnValidacionNumerica(numero) {
  var out = '';
  var filtro = '1234567890';
  for (var i=0; i<numero.length; i++)
    if (filtro.indexOf(numero.charAt(i)) != -1) 
    out += numero.charAt(i);
  return out;
} //Funcion para eliminar espacios, y limitar a numeros y letras

function fnValidacionAlfanumerica(palabra) {
  var out = '';
  var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890';
  for (var i=0; i<palabra.length; i++)
    if (filtro.indexOf(palabra.charAt(i)) != -1) 
    out += palabra.charAt(i);
  return out;
} //Funcion para eliminar espacios, y limitar a numeros y letras

function fnResume() {
  total = 0;
  console.log(idExistentes.length);
  console.log(idExistentes);
  
  for (i=1; i<idExistentes.length; i++) {
    console.log("id ex: "+idExistentes[i]);

    var storage = window.localStorage;
    var vta = storage.getItem(idExistentes[i]);
    vta = JSON.parse(vta);

    subt = vta.tot;
    console.log("1 "+subt);
    total = total + subt;
    console.log("2 "+total);

    $$("#rTotal").html(total);
  }

} //Resumen final

function fnCalcular() {
  pago = $$('#rPago').val();
  total = $$('#rTotal').html();
  vuelto =total - pago;
  $$('#rVuelto').html(vuelto);
} //Calculo de vuelto

function fnFinalizar(){
  mainView.router.navigate("/menu/"); 
}

function getImage() {  
	navigator.camera.getPicture(onSuccess,onError,	{
	    quality: 80,
	    destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      targetWidth: 150,
      targetHeight: 150,
	});
}

function selImage() {     
	navigator.camera.getPicture(onSuccess,onError,	{
	    quality: 50,
	    destinationType: Camera.DestinationType.FILE_URI,
	    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
	});
}

function onError() {
  console.log("error camara");
}

function onSuccess(imageData) {
    var storageRef = firebase.storage().ref();
    var getFileBlob = function(url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.addEventListener('load', function() {
            cb(xhr.response);
        });
        xhr.send();
    };

    var blobToFile = function(blob, name) {
        blob.lastModifiedDate = new Date();
        blob.name = name;
        return blob;
    };

    var getFileObject = function(filePathOrUrl, cb) {
        getFileBlob(filePathOrUrl, function(blob) {
            cb(blobToFile(blob, idG+".jpg"));
        });
    };

    getFileObject(imageData, function(fileObject) {
        var uploadTask = storageRef.child(email_login+"/"+idG+".jpg").put(fileObject);

        uploadTask.on('state_changed', function(snapshot) {
            console.log(snapshot);
        }, function(error) {
            console.log(error);
        }, function() {
            var downloadURL = uploadTask.snapshot.downloadURL;
            console.log(downloadURL);
            alert(downloadURL);
            return;
        });
    });
}