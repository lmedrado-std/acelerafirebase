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
  Target,
  Trophy,
  User,
  ShoppingBag,
  Github
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
import { sellersData, goalsData, missionsData } from '@/lib/data';
import type { Seller, Goals, Mission } from '@/lib/types';

interface SellerContextType {
  sellers: Seller[];
  setSellers: React.Dispatch<React.SetStateAction<Seller[]>>;
  goals: Goals;
  missions: Mission[];
  currentSeller: Seller;
}

const SellerContext = React.createContext<SellerContextType | null>(null);

export const useSellerContext = () => {
  const context = React.useContext(SellerContext);
  if (!context) {
    throw new Error('useSellerContext must be used within a SellerLayout');
  }
  return context;
};

const menuItems = [
  { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/seller/ranking', label: 'Ranking', icon: Trophy },
  { href: '/seller/missions', label: 'Missões', icon: Target },
  { href: '/seller/academia', label: 'Academia', icon: GraduationCap },
  { href: '/seller/quiz', label: 'Quiz', icon: Puzzle },
  { href: '/seller/loja', label: 'Loja', icon: ShoppingBag },
  { href: '/seller/perfil', label: 'Meu Perfil', icon: User },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sellers, setSellers] = React.useState<Seller[]>(sellersData);
  const [goals] = React.useState<Goals>(goalsData);
  const [missions] = React.useState<Mission[]>(missionsData);
  // In a real app, this would come from an authentication context
  const currentSeller = sellers.find(s => s.id === '1')!;

  const value = { sellers, setSellers, goals, missions, currentSeller };

  return (
    <SellerContext.Provider value={value}>
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
                      3
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
    </SellerContext.Provider>
  );
}
