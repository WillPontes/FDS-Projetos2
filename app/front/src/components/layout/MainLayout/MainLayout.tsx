import { Outlet } from "@tanstack/react-router"
import { Sidebar } from "../Sidebar"
import { Header } from "../Header"
import { Footer } from "../Footer"

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
