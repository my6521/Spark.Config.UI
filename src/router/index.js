import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    // hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index')
    // hidden: true
  },
  {
    path: '/authredirect',
    component: () => import('@/views/login/authredirect')
    // hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404')
    // hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401')
    // hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', noCache: true }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    redirect: '/log',
    alwaysShow: true,
    meta: {
      title: '日志管理',
      icon: 'rizhi'
    },
    children: [
      {
        path: 'businessLogList',
        component: () => import('@/views/log/businessLogList.vue'),
        name: 'businessLogList',
        meta: {
          title: '业务日志',
          icon: 'log',
          noCache: true
        }
      },
      {
        path: 'systemLogList',
        component: () => import('@/views/log/systemLogList.vue'),
        name: 'systemLogList',
        meta: {
          title: '系统日志',
          icon: 'log'
        }
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    redirect: '/configList',
    alwaysShow: true,
    meta: {
      title: '配置中心',
      icon: 'peizhi'
    },
    children: [
      {
        path: 'configList',
        component: () => import('@/views/config/configList.vue'),
        name: 'configList',
        meta: {
          title: '配置列表',
          icon: 'form',
          noCache: true
        }
      },
      {
        path: 'serviceList',
        component: () => import('@/views/config/serviceList.vue'),
        name: 'serviceList',
        meta: {
          title: '服务列表',
          icon: 'form',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/smsManagement',
    component: Layout,
    redirect: '/recordList',
    alwaysShow: true,
    meta: {
      title: '短信管理',
      icon: 'sms'
    },
    children: [
      {
        path: 'recordList',
        component: () => import('@/views/sms/recordList.vue'),
        name: 'recordList',
        meta: {
          title: '发送记录',
          icon: 'message',
          noCache: true
        }
      },
      {
        path: 'tempList',
        component: () => import('@/views/sms/tempList.vue'),
        name: 'tempList',
        meta: {
          title: '短信模板',
          icon: 'message',
          noCache: true
        }
      },
      {
        path: 'providerList',
        component: () => import('@/views/sms/providerList.vue'),
        name: 'providerList',
        meta: {
          title: '短信运营商',
          icon: 'list',
          noCache: true
        }
      }
    ]
  },
  // {
  //   path: '/usermanagement',
  //   component: Layout,
  //   redirect: '/userList',
  //   alwaysShow: true,
  //   meta: {
  //     title: '用户管理',
  //     icon: 'yonghu'
  //   },
  //   children: [
  //     {
  //       path: 'userList',
  //       component: () => import('@/views/system/userList.vue'),
  //       name: 'userList',
  //       meta: {
  //         title: '用户列表',
  //         icon: 'list',
  //         noCache: true
  //       }
  //     },
  //     {
  //       path: 'roleList',
  //       component: () => import('@/views/system/RoleList.vue'),
  //       name: 'roleList',
  //       meta: {
  //         title: '权限管理',
  //         icon: 'form',
  //         noCache: true
  //       }
  //     }
  //   ]
  // },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [{
  path: '/appmanagement',
  component: Layout,
  redirect: '/appList',
  alwaysShow: true,
  meta: {
    title: '应用管理',
    icon: 'yingyong'
  },
  children: [
    {
      path: 'appList',
      component: () => import('@/views/system/appList.vue'),
      name: 'appList',
      meta: {
        title: '项目列表',
        icon: 'list',
        noCache: true
      }
    }
  ]
},
{
  path: '/usermanagement',
  component: Layout,
  redirect: '/userList',
  alwaysShow: true,
  meta: {
    title: '用户管理',
    icon: 'yonghu'
  },
  children: [
    {
      path: 'userList',
      component: () => import('@/views/system/userList.vue'),
      name: 'userList',
      meta: {
        title: '用户列表',
        icon: 'list',
        noCache: true
      }
    },
    {
      path: 'roleList',
      component: () => import('@/views/system/RoleList.vue'),
      name: 'roleList',
      meta: {
        title: '权限管理',
        icon: 'form',
        noCache: true
      }
    }
  ]
}
]
