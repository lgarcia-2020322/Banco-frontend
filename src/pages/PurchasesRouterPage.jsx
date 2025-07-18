import { useAuth } from '../contexts/AuthContext'
import { AdminPurchaseProvider } from '../contexts/AdminPurchaseContext'
import AdminPurchaseView from './AdminPurchasePage.jsx'
import ClientPurchaseView from './ClientPurchasePage.jsx'

const PurchasesRouterPage = () => {
  const { user } = useAuth()

  if (!user) return null // O puedes mostrar un loader aquí

  return (
    <AdminPurchaseProvider>
      {user.role === 'ADMIN' ? (
        <AdminPurchaseView />
      ) : (
        <ClientPurchaseView />
      )}
    </AdminPurchaseProvider>
  )
}

export default PurchasesRouterPage
