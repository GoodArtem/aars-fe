import Vue from 'vue'
import VueRouter from 'vue-router'
import InventoryCardView from '../views/InventoryCardView.vue'
import EmployeesView from '../views/EmployeesView.vue'
import FormatsView from '../views/FormatsView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'inventoryCards',
    component: InventoryCardView
  },
  {
    path: '/employees',
    name: 'employees',
    component: EmployeesView
  },
  {
    path: '/formats',
    name: 'formats',
    component: FormatsView
  }
]

const router = new VueRouter({
  routes
})

export default router
