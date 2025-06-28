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

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/ranking', label: 'Ranking', icon: Trophy },
  { href: '#', label: 'Missões', icon: Target },
  { href: '#', label: 'Academia', icon: GraduationCap },
  { href: '#', label: 'Quiz', icon: Puzzle },
  { href: '#', label: 'Loja', icon: ShoppingBag },
  { href: '#', label: 'Perfil', icon: User },
  { href: '/admin/settings', label: 'Configurações', icon: Shield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
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
                      as="a"
                      href={item.href}
                      isActive={pathname === item.href}
                      className={cn(
                        'data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-semibold',
                        'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                        <item.icon className="size-5" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
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
              <Button variant="secondary" className="group-data-[collapsible=icon]:hidden bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground">
                  <LogOut className="mr-2 size-4" /> Sair
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
  );
}
