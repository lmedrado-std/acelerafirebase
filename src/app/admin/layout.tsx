'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  GraduationCap,
  LayoutGrid,
  LogOut,
  Puzzle,
  Shield,
  Target,
  Trophy,
  User,
  Github,
  ShoppingBag,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/icons/logo';
import { cn } from '@/lib/utils';
import { sellersData as initialSellers, goalsData as initialGoals, missionsData as initialMissions } from '@/lib/data';
import type { Seller, Goals, Mission, Admin } from '@/lib/types';

interface AdminContextType {
  sellers: Seller[];
  setSellers: React.Dispatch<React.SetStateAction<Seller[]>>;
  goals: Goals;
  setGoals: React.Dispatch<React.SetStateAction<Goals>>;
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
  adminUser: Admin;
  setAdminUser: React.Dispatch<React.SetStateAction<Admin>>;
}

const AdminContext = React.createContext<AdminContextType | null>(null);

export const useAdminContext = () => {
  const context = React.useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminLayout');
  }
  return context;
};

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/ranking', label: 'Ranking', icon: Trophy },
  { href: '/admin/missions', label: 'Missões', icon: Target },
  { href: '/admin/academia', label: 'Academia', icon: GraduationCap },
  { href: '/admin/quiz', label: 'Quiz', icon: Puzzle },
  { href: '/admin/loja', label: 'Loja', icon: ShoppingBag },
  { href: '/admin/perfil', label: 'Perfil', icon: User },
  { href: '/admin/settings', label: 'Configurações', icon: Shield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sellers, setSellers] = React.useState<Seller[]>(initialSellers);
  const [goals, setGoals] = React.useState<Goals>(initialGoals);
  const [missions, setMissions] = React.useState<Mission[]>(initialMissions);
  const [adminUser, setAdminUser] = React.useState<Admin>({
    nickname: 'admin',
    email: 'admin@aceleragt.com',
    password: 'admin',
  });

  return (
    <AdminContext.Provider value={{ sellers, setSellers, goals, setGoals, missions, setMissions, adminUser, setAdminUser }}>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
            <SidebarHeader className="p-4">
              <div className="flex items-center gap-3">
                <Logo />
                <h1 className="text-xl font-semibold text-white group-data-[collapsible=icon]:hidden">
                  Acelera GT
                </h1>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className={cn(
                          'data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-semibold',
                          'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        )}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-5" />
                          <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4 space-y-4">
              <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
                  <Button variant="ghost" className="relative p-2 h-auto text-sidebar-foreground hover:text-white">
                    <Bell />
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 justify-center p-1 text-xs border-2 border-sidebar">
                      524
                    </Badge>
                  </Button>
                <Button asChild variant="secondary" className="group-data-[collapsible=icon]:hidden bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground">
                    <Link href="/login">
                      <LogOut className="mr-2 size-4" /> Sair
                    </Link>
                  </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          <div className="flex flex-col flex-1">
            <header className="md:hidden flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Logo />
                <h1 className="text-lg font-semibold text-white">Acelera GT</h1>
              </div>
              <SidebarTrigger />
            </header>
            <main className="flex-1 p-4 sm:p-6 md:p-8 bg-background">
              {children}
            </main>
            <footer className="flex items-center justify-between p-4 text-xs text-muted-foreground bg-background border-t">
                <p>Desenvolvido com ❤️ por Rian</p>
                <a href="https://github.com/RyannBreston" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground">
                  <Github className="size-4" />
                  RyannBreston
                </a>
            </footer>
          </div>
        </div>
      </SidebarProvider>
    </AdminContext.Provider>
  );
}
