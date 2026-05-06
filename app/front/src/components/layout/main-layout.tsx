import { Outlet } from "@tanstack/react-router"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { Footer } from "./footer"

export function MainLayout() {
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
