import Vue from 'vue'
import App from './App.vue'
import VueLogger from 'vuejs-logger';
import * as Keycloak from 'keycloak-js';

Vue.use(VueLogger);

let initOptions = {
  // url: 'http://127.0.0.1:8080/auth', realm: 'keycloak-demo', clientId: 'app-vue', onLoad: 'login-required'
  // url: 'https://idp.sk-nemo.com/auth',
  url: 'https://idp.sk-nemo.com',
  realm: 'K11-ESS',
  clientId: 'test_app_vue',
  onLoad: 'login-required'
}

console.log("keycloak >>>>>>>> ")
let keycloak = null;
try{
  console.log("call keycloak")
  keycloak = Keycloak(initOptions);
  console.log("result is ... ")
  console.log(keycloak)  
}
catch (err) {
  console.log("keycloak connection error!! T-T")
  console.log(err)
}

if(keycloak == null || keycloak ==  undefined){
  console.log(" keycloak is not connected...T-T ")
  new Vue({
    el: '#app',
    render: h => h(App)
  })
}
else{
  console.log(" Keycloak is connected ~~ !!! ")
  keycloak.init({ 
    onLoad: initOptions.onLoad 
  }).then((auth) => {
    if (!auth) {
      console.log(" <><><> no auth.. <><><> ")
      window.location.reload();
    } else {
      console.log(" <><><> Authenticated <><><> ")
      Vue.$log.info("Authenticated");
      
      new Vue({
        el: '#app',
        render: h => h(App, { props: { keycloak: keycloak } })
      })
    }  
  
    //Token Refresh
    setInterval(() => {
      console.log(" <><><> start interval <><><> ")
      keycloak.updateToken(70).then((refreshed) => {
        if (refreshed) {
          Vue.$log.info('Token refreshed' + refreshed);
        } else {
          Vue.$log.warn('Token not refreshed, valid for '
          + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
        }
      }).catch(() => {
        console.log(" <><><> error : fail refresh token <><><> ")
        Vue.$log.error('Failed to refresh token');
      });
    }, 6000)
    
  }).catch(() => {
    console.log(" <><><> error : authentication faile <><><> ")
    Vue.$log.error("Authenticated Failed");
  });
}





// import Vue from 'vue'
// import App from './App.vue'

// new Vue({
//   el: '#app',
//   render: h => h(App)
// })


