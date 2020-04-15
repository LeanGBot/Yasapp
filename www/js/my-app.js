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

$$(document).on('deviceready', function(e) {
  console.log("Inicializado: Dispositivo");
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