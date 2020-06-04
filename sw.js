console.log('service sw')


// implementando estrategias de cache
var STATIC='cache-estatico-v1';
var DINAMIC='cache-dinamico-v1';

let app_shell_cacheStatic=[
    'https://code.jquery.com/jquery-3.4.1.slim.min.js',
    'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
    '//cdn.jsdelivr.net/npm/pouchdb@7.1.1/dist/pouchdb.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js',
    'styles.css',
    'app/db.js',
    'app/app.js',
    'index.html',
    '404.html',

];


self.addEventListener('install',e=>{

    var cacheStatic=caches.open(STATIC).then(cache=>{
        return cache.addAll(app_shell_cacheStatic);
    });

    e.waitUntil(Promise.all([cacheStatic]));

});

self.addEventListener('activate', e => {
    console.log('axtivated..')
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key != STATIC && key.includes('static')) {
                return caches.delete(key);
            }
            if (key != DINAMIC && key.includes('dinamic')) {
                return caches.delete(key);
            }

        });
    });
    e.waitUntil(respuesta);
});



self.addEventListener('fetch', e => {
    let respuesta;
    // let respuesta = fetch(e.request).then(resp => {
    //     return resp.clone();
    // });


    // 1- guardo en cache los request
    // let respuesta=caches.open(DINAMIC).then(cache=>{
    //     console.log('open cache')
    //     return fetch(e.request).then(red=>{
    //         console.log('guardando en el cache dinamico');
    //         cache.put(e.request,red.clone());
    //         return  red.clone();// cache.match(e.request);
    //     });
    // });

    // 2- red y cache
    respuesta=fetch(e.request).then(red=>{
        if(!red.ok){
            return caches.match(e.request);
        }else{
            caches.open(DINAMIC).then(cache=>{
               cache.put(e.request,red.clone());
            });
            return red.clone();
        }
    })

    // 3-cache y red casi seria para aplicaciones solo en cache
    // respuesta=caches.match(e.request).then(local=>{
    //     if(local){
    //         return local;
    //     }else{
    //         return fetch(e.request).then(red=>{
    //            caches.open(DINAMIC).then(cache=>{
    //               cache.put(e.request,red.clone());
    //            });
    //            return red.clone();
    //         });
    //     }
    // });


    // 4-solo cache
     //respuesta=caches.match(e.request);


    //
    // 5-mi variacion busco en cache todo lo estatico si lo tengo lo doy si es dinamico busco en red y actualizo cache
    // si falla en red busco en cache


   // respuesta=fetch(e.request);

    e.respondWith(respuesta);
})