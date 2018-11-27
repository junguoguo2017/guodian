export const routes = [
    {
        path:'/',
        redirect:'/home'
    },
    {
        path:'/home',
        name:'home',
        component:()=>import('@/page/home')
       // component: resolve => require.ensure([], () => resolve(require('@/page/home')), 'home')
    },

]
