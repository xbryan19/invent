import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import store from '../store/index.js'

Vue.use(VueRouter)

let router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes:[
    {
      path: '/',
      name: 'checkstock1',
      component: () => import('../views/checkstock1.vue'),
      meta: {
        authRequired: true
      },
      beforeEnter: (to, from, next) => {
        // store.state.userInfo.userLevel == 1 || store.state.userInfo.userLevel == 3 ? next() : next({name:'checkstock1'})
        if (store.state.userInfo.userLevel == 1 || store.state.userInfo.userLevel == 3) {
          next()
        } else if (store.state.userInfo.userLevel == 2) {
          next({name:'picker'})
        }
      }
    },
    {
      path: '/initem',
      name: 'initem',
      component: () => import('../views/initem.vue'),
      meta: {
        authRequired: true
      },
      beforeEnter: adminRight
    },
    {
      path: '/outitem',
      name: 'outitem',
      component: () => import('../views/outitem.vue')
    },
    {
      path: '/monitoring1',
      name: 'monitoring1',
      component: () => import('../views/monitoring1.vue'),
      meta: {
        authRequired: true
      },
      beforeEnter: adminRight
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/newstock',
      name: 'newstock',
      component: () => import('../views/newstock.vue'),
      meta: {
        authRequired: true
      },
      beforeEnter: adminRight
    },
    {
      path: '/firstprocess',
      name: 'firstprocess',
      component: () => import('../views/FirstProcess.vue')
    },
    // {
    //   path: '/mother',
    //   name: 'mother',
    //   component: () => import('../views/mother.vue')
    // },
    
    // {
    //   path: '/mother2',
    //   name: 'mother2',
    //   component: () => import('../views/mother2.vue'),    LEGIT ONE
    //   meta: {
    //     authRequired: true
    //   },
    //   beforeEnter: adminRight
    // },
    {
      path: '/motherHinban',
      name: 'motherHinban',
      component: () => import('../views/motherHinban.vue'),
      meta: {
        authRequired: true
      },
      beforeEnter: adminRight
    },
    {
      path: '/import',
      name: 'import',
      component: () => import('../views/import.vue'),
      meta: {
        authRequired: true
      },
      beforeEnter: adminRight
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/users.vue'),
      meta: {
        authRequired: true
      },
      beforeEnter: adminRight
    },
    {
      path: '/picker',
      name: 'picker',
      component: () => import('../views/picker.vue'),
      meta: {
        authRequired: true
      },
      beforeEnter: (to, from, next) => {
        if (store.state.userInfo.userLevel == 2) {
          next()
        } else if (store.state.userInfo.userLevel != 2) {
          next({name:'checkstock1'})
        } else {
          next({name:'picker'})
        }
      }
    },
    {
      path: '/checkExport',
      name: 'export',
      component: () => import('../views/checkExport.vue'),
      meta: {
        authRequired: true
      },
      beforeEnter: (to, from, next) => {
        if (store.state.userInfo.userLevel == 2) {
          next()
        } else if (store.state.userInfo.userLevel != 2) {
          next({name:'checkstock1'})
        } else {
          next({name:'picker'})
        }
        // store.state.userInfo.userLevel == 2 ? next() : next({name:'checkstock1'})
      }
    },
    {
      path: '/rackCabinet',
      name: 'rackCabinet',
      component: () => import('../views/rackCabinet.vue'),
      meta: {
        authRequired: true
      },
      beforeEnter: adminRight
    },
    {
      path: '/critical',
      name: 'critical',
      component: () => import('../views/critical.vue')
    },
    {
      path: '/manageGroup',
      name: 'manageGroup',
      component: () => import('../views/manageGroup.vue'),
      meta: {
        authRequired: true
      },
      beforeEnter: adminRight
    }
  ]
})

router.beforeEach((to, from, next) => {
  
  if (to.meta.authRequired) {
    if (!store.state.userInfo.employeeCode) {
        router.push({
            path: '/login'
        })
    } 
  }
  return next()
})

const adminRight = (to, from, next) => {
  if (store.state.userInfo.userLevel == 1) {
    next()
  } else if (store.state.userInfo.userLevel == 2) {
    next({name:'picker'})
  } else {
    next({name:'checkstock1'})
  }
}

const pickerRight = (to, from, next) => {
  if (store.state.userInfo.userLevel == 2) {
    next()
  } else if (store.state.userInfo.userLevel != 2) {
    next({name:'checkstock1'})
  } else {
    next({name:'picker'})
  }
}
 
export default router











