import { useState, type ReactNode } from "react";
import { Sidebar } from "../Sidebar";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { useWebsocketNotification } from "@/hooks/useWebsocketNotification"

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  useWebsocketNotification()

  return (
    <div className="flex min-h-screen">
      <Sidebar mobileOpen={mobileOpen} onMobileOpenChange={setMobileOpen} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto bg-neutral-50 p-4 md:p-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
