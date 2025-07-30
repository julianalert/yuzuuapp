import ProtectedRoute from '../../../components/auth/protected-route'
import UserProfile from '../../../components/auth/user-profile'

export const metadata = {
  title: "Dashboard - Simple",
  description: "Your dashboard",
};

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <UserProfile />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Welcome!</h3>
                <p className="text-blue-700">
                  You're successfully signed in to your account.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Your Leads</h3>
                <p className="text-green-700">
                  Start managing your leads and grow your business.
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">Analytics</h3>
                <p className="text-purple-700">
                  Track your performance and optimize your strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 