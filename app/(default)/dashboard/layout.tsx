import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Dashboard - Yuzuu",
  description: "Your dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 