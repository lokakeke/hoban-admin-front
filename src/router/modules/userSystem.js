import Full from '@/container/Full.vue'

// Package
const Package = () => import('@/views/userSystem/package/PackageManagement.vue')

// Payment
const Payment = () => import('@/views/userSystem/payment/PaymentManagement.vue')

export default {
  path: '/user/system',
  name: 'userSystem',
  component: Full,
  redirect: '/main',
  meta: {
    breadcrumb: '사용자'
  },
  children: [
    {
      path: 'package',
      component: Package,
      name: 'package',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '패키지 관리',
        breadcrumb: 'Package'
      }
    },
    {
      path: 'payment',
      component: Payment,
      name: 'payment',
      meta: {
        auth: true,
        requiresAuth: true,
        title: '결제 관리',
        breadcrumb: 'Payment'
      }
    }
  ]
}
