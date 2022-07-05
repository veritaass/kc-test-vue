import Vue from 'vue'
import App from './App.vue'
import VueLogger from 'vuejs-logger';
// import * as Keycloak from 'keycloak-js';
import Keycloak from 'keycloak-js';

import VueRouter from 'vue-router'
import AdminPage from './Admin.vue'
import SkccPage from './Skcc.vue'
import NotFoundPage from './NotFound.vue'

Vue.use(VueLogger);
Vue.use(VueRouter);

const routes = [
  {
    path:'/admin',
    component: AdminPage,
    meta: { authorization: ["test_admin_role"] }
  },
  {
    path:'/skcc',
    component: SkccPage,
    meta: { authorization: ["test_skcc_role"] }
  },
  {
    path:'/not-found',
    component: NotFoundPage
  }
]

let initOptions = {
  // url: 'http://127.0.0.1:8080/auth', realm: 'keycloak-demo', clientId: 'app-vue', onLoad: 'login-required'
  // url: 'https://idp.sk-nemo.com/auth',
  url: 'https://idp.sk-nemo.com',
  realm: 'K11-ESS',
  clientId: 'test_app_vue',
  onLoad: 'login-required'
}

console.log(" <><><> keycloak <><><> ")
let keycloak = null;
try{
  console.log("call keycloak")
  keycloak = new Keycloak(initOptions);
  console.log("result is ... ")
  console.log(keycloak)  
}
catch (err) {
  console.log(" <><><> keycloak connection error!! <><><>")
  console.log(err)
}
//////////////////// local test
// keycloak = null
////////////////////

const router = new VueRouter({ routes });

if(keycloak == null || keycloak ==  undefined){
  console.log(" <><><> keycloak is not connected... <><><> ")
  new Vue({
    el: '#app',
    render: h => h(App),
    router
  })
}
else{
  console.log(" <><><> Keycloak is connected <><><> ")
  keycloak.init({ 
    onLoad: initOptions.onLoad 
  }).then((auth) => {
    // router.beforeEach((to, from, next)=>{
    //   // console.log(keycloak.idTokenParsed.test_app_groups)
    //   // console.log(" <><><> to <><><> ")
    //   // console.log(to)
    //   const authorization = to.meta.authorization;
    //   const userAuthList = keycloak.idTokenParsed.test_app_groups
    //   if(authorization != undefined){
    //     console.log(authorization)
    //     console.log(userAuthList)
    //     console.log(authorization.includes(userAuthList))
    //     if(!authorization.includes(userAuthList)){
    //       console.log(" <><><> has no auth <><><> ")
    //       return next({ path: "/not-found" })
    //     }
    //   }
    })

    if (!auth) {
      console.log(" <><><> no auth.. <><><> ")
      window.location.reload();
    } else {
      console.log(" <><><> Authenticated <><><> ")
      Vue.$log.info("Authenticated");
      
      new Vue({
        el: '#app',
        render: h => h(App, { props: { keycloak: keycloak } }),
        router
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


