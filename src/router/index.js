import Vue from 'vue'
import Router from 'vue-router'

const header = r => require.ensure([], () => r(require('../components/header/header')), ' header')
const main = r => require.ensure([], () => r(require('../components/main/main')), ' main')
const mainClass = r => require.ensure([], () => r(require('../components/main/mainClass')), ' mainClass')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'header',
      component: header,
      children: [
        {
          path:'/',
          component: main
        },
        {
          path:'/mainClass/:classes',
          name:'mainClass',
          component: mainClass
        },
      ]
    }
  ]
})
