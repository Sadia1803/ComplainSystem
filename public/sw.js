let cacheData = "appV1";
this.addEventListener("install",(event)=>{
    event.waitUntil(
        caches.open(cacheData).then((cache)=>{
            cache.addAll([
                '/static/js/main.chunk.js',
                '/static/js/0.chunk.js',
                '/static/js/bundle.js',
                '/static/js/bundle.js.map',
                '/index.html',
                '/static/media/PIAlogo.27a91e2e.jpeg',
                '/',
                '/Tab',
                '/viewComplain',
                '/confirmation',
                '/detailsViewComplain',
                '/logComplains',
                '/loginform',
                '/profile',
                '/viewStatus',
                '/manifest.json',
                '/logo192.png',
                'favicon.ico',
                'https://apis.google.com/js/api.js?onload=__iframefcb343783',
                'https://apis.google.com/js/api.js?onload=__iframefcb263693',
                '/sockjs-node/info?t=1633345160128',
                'https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=AIzaSyCCxJ-u3OmQcSCawYQdKuV4ShTLksSDHUQ&cb=1633345295043',
            
            ])
        })
    )
})

this.addEventListener("fetch",(event)=>{
    if(!navigator.onLine){
        event.respondWith(
            caches.match(event.request).then((resp)=>{
                if(resp){
                    return resp;
                }
            })
        )
    }
})