import Vue from 'vue'
import App from './App.vue'
import VueLogger from 'vuejs-logger';
import * as Keycloak from 'keycloak-js';

Vue.use(VueLogger);

let initOptions = {
  // url: 'http://127.0.0.1:8080/auth', realm: 'keycloak-demo', clientId: 'app-vue', onLoad: 'login-required'
  url: 'https://idp.sk-nemo.com/auth', realm: 'K11-ESS', clientId: 'test_app_vue', onLoad: 'login-required'
}

console.log("keycloak >>>>>>>> ")
let keycloak = null;
try{
  keycloak = Keycloak(initOptions);
}
catch (err) {}

if(keycloak == null || keycloak ==  undefined || length(keycloak) == 0){
  console.log(" !!!!! ")
  new Vue({
    el: '#app',
    render: h => h(App)
  })
}
else{
  console.log(" @@@@@ ")
  keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
    if (!auth) {
      window.location.reload();
    } else {
      Vue.$log.info("Authenticated");
  
      new Vue({
        el: '#app',
        render: h => h(App, { props: { keycloak: keycloak } })
      })
    }  
  
  //Token Refresh
    setInterval(() => {
      keycloak.updateToken(70).then((refreshed) => {
        if (refreshed) {
          Vue.$log.info('Token refreshed' + refreshed);
        } else {
          Vue.$log.warn('Token not refreshed, valid for '
            + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
        }
      }).catch(() => {
        Vue.$log.error('Failed to refresh token');
      });
    }, 6000)
  
  }).catch(() => {
    Vue.$log.error("Authenticated Failed");
  });
}





// import Vue from 'vue'
// import App from './App.vue'

// new Vue({
//   el: '#app',
//   render: h => h(App)
// })


