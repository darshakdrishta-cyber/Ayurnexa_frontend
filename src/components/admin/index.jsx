import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Package, ShoppingCart, Users } from 'lucide-react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { Badge } from '../common/Card'
import api from '../../services/api'

const MOCK_ORDERS = [
  { id: 'ORD-001', customer: 'Asha R', total: 1249, status: 'Delivered', date: '2026-10-15' },
  { id: 'ORD-002', customer: 'Ravi S', total: 749, status: 'Processing', date: '2026-10-16' },
  { id: 'ORD-003', customer: 'Meena K', total: 499, status: 'Shipped', date: '2026-10-17' },
  { id: 'ORD-004', customer: 'Suresh P', total: 899, status: 'Pending', date: '2026-10-18' },
]

const statusColors = { Delivered: 'success', Processing: 'primary', Shipped: 'primary', Pending: 'secondary' }

export function AdminOrders() {
  const [orders, setOrders] = useState(MOCK_ORDERS)
  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders')
      setOrders(res.data || MOCK_ORDERS)
    } catch {
      setOrders(MOCK_ORDERS)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Orders</h1>
            <p className="text-muted-foreground">Manage and create orders</p>
          </div>
          <Button onClick={() => {}}>
            <Plus className="w-4 h-4 mr-2" /> New Order
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Total Orders" value={orders.length} icon={<Package className="w-5 h-5" />} />
          <StatCard label="Total Revenue" value={orders.reduce((sum, o) => sum + o.total, 0)} icon={<ShoppingCart className="w-5 h-5" />} />
          <StatCard label="Customers" value={new Set(orders.map((o) => o.customer)).size} icon={<Users className="w-5 h-5" />} />
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Order ID</th>
                  <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Customer</th>
                  <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Total</th>
                  <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    whileHover={{ bg: 'muted/30' }}
                    className="border-b border-border group"
                  >
                    <td className="py-4 px-6 text-sm font-medium text-foreground">{order.id}</td>
                    <td className="py-4 px-6 text-sm text-foreground">{order.customer}</td>
                    <td className="py-4 px-6 text-sm text-foreground">{order.total}</td>
                    <td className="py-4 px-6">
                      <Badge variant={statusColors[order.status] || 'default'}>{order.status}</Badge>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{order.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{typeof value === 'number' ? value.toLocaleString() : value}</p>
        </div>
        <div className="rounded-lg bg-primary-50 p-3 text-primary-700 dark:bg-primary-950 dark:text-primary-300">{icon}</div>
      </div>
    </Card>
  )
}

export function AdminReviews() {
  const [reviews] = useState([
    { id: 1, product: 'Ashwagandha Tablets', customer: 'Asha R', rating: 5, comment: 'Really helped with stress.', date: '2026-10-10' },
    { id: 2, product: 'Tulsi Drops', customer: 'Ravi S', rating: 4, comment: 'Good immunity support.', date: '2026-10-12' },
    { id: 3, product: 'Neem Face Wash', customer: 'Meena K', rating: 5, comment: 'Skin feels fresh.', date: '2026-10-14' },
  ])

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Product Reviews</h1>
            <p className="text-muted-foreground">Manage customer reviews</p>
          </div>
        </div>

        <Card className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Product</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Customer</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Rating</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Comment</th>
                <th className="py-4 px-6 text-sm font-semibold text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id} className="border-b border-border">
                  <td className="py-4 px-6 text-sm text-foreground">{r.product}</td>
                  <td className="py-4 px-6 text-sm text-foreground">{r.customer}</td>
                  <td className="py-4 px-6 text-sm text-foreground">{'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{r.comment}</td>
                  <td className="py-4 px-6 text-sm text-muted-foreground">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
