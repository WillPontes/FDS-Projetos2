import type { ReactNode } from "react"
import { Sidebar } from "../Sidebar"
import { Header } from "../Header"
import { Footer } from "../Footer"

type AppLayoutProps = {
  children: ReactNode
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
