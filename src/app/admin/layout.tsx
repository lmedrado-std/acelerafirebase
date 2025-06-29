'use client';

import * as React from 'react';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Logo} from '@/components/icons/logo';
import {cn} from '@/lib/utils';
import type {Admin, Goals, Mission, Seller} from '@/lib/types';
import {dataStore, useStore} from '@/lib/store';

interface AdminContextType {
  sellers: Seller[];
  setSellers: (updater: (prev: Seller[]) => Seller[]) => void;
  goals: Goals;
  setGoals: (updater: (prev: Goals) => Goals) => void;
  missions: Mission[];
  setMissions: (updater: (prev: Mission[]) => Mission[]) => void;
  adminUser: Admin;
  setAdminUser: (updater: (prev: Admin) => Admin) => void;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
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
  {href: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid},
  {href: '/admin/ranking', label: 'Ranking', icon: Trophy},
  {href: '/admin/missions', label: 'Missões', icon: Target},
  {href: '/admin/academia', label: 'Academia', icon: GraduationCap},
  {href: '/admin/quiz', label: 'Quiz', icon: Puzzle},
  {href: '/admin/loja', label: 'Loja', icon: ShoppingBag},
  {href: '/admin/perfil', label: 'Perfil', icon: User},
  {href: '/admin/settings', label: 'Configurações', icon: Shield},
];

export default function AdminLayout({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const router = useRouter();
  const state = useStore(s => s);
  const [isClient, setIsClient] = React.useState(false);

  const [isDirty, setIsDirty] = React.useState(false);
  const [pendingPath, setPendingPath] = React.useState<string | null>(null);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const contextValue = {
    sellers: state.sellers,
    setSellers: dataStore.setSellers,
    goals: state.goals,
    setGoals: dataStore.setGoals,
    missions: state.missions,
    setMissions: dataStore.setMissions,
    adminUser: state.adminUser,
    setAdminUser: dataStore.setAdminUser,
    isDirty,
    setIsDirty,
  };

  const handleNavigate = (path: string) => {
    if (pathname === '/admin/settings' && isDirty) {
      setPendingPath(path);
    } else {
      router.push(path);
    }
  };

  const handleLogout = () => {
    const logoutPath = '/login';
    if (pathname === '/admin/settings' && isDirty) {
      setPendingPath(logoutPath);
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('loggedInSellerId');
      }
      router.push(logoutPath);
    }
  };

  const handleConfirmNavigation = () => {
    if (pendingPath) {
      setIsDirty(false); // Acknowledge leaving without saving
      if (pendingPath === '/login' && typeof window !== 'undefined') {
        localStorage.removeItem('loggedInSellerId');
      }
      router.push(pendingPath);
      setPendingPath(null);
    }
  };

  return (
    <AdminContext.Provider value={contextValue}>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar
            collapsible="icon"
            className="border-r border-sidebar-border bg-sidebar"
          >
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
                {menuItems.map(item => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      onClick={() => handleNavigate(item.href)}
                      isActive={pathname === item.href}
                      className={cn(
                        'data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:font-semibold',
                        'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )}
                    >
                      <item.icon className="size-5" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-4 space-y-4">
              <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
                <Button
                  variant="ghost"
                  className="relative p-2 h-auto text-sidebar-foreground hover:text-white"
                >
                  <Bell />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 min-w-5 justify-center p-1 text-xs border-2 border-sidebar"
                  >
                    524
                  </Badge>
                </Button>
                {isClient && (
                  <Button
                    onClick={handleLogout}
                    variant="secondary"
                    className="group-data-[collapsible=icon]:hidden bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground"
                  >
                    <LogOut className="mr-2 size-4" /> Sair
                  </Button>
                )}
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
              <a
                href="https://github.com/RyannBreston"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Github className="size-4" />
                RyannBreston
              </a>
            </footer>
          </div>
        </div>
      </SidebarProvider>
      <AlertDialog
        open={!!pendingPath}
        onOpenChange={() => setPendingPath(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem alterações não salvas</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja sair? Suas alterações serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmNavigation}>
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminContext.Provider>
  );
}
