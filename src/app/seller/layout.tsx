'use client';

import * as React from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {
  GraduationCap,
  LayoutGrid,
  LogOut,
  Puzzle,
  Target,
  Trophy,
  ShoppingBag,
  History,
  Loader2,
  User,
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
  useSidebar,
} from '@/components/ui/sidebar';
import {Button} from '@/components/ui/button';
import {Logo} from '@/components/icons/logo';
import {cn} from '@/lib/utils';
import type {Seller, Goals, Mission, CycleSnapshot} from '@/lib/types';
import {dataStore, useStore} from '@/lib/store';

interface SellerContextType {
  sellers: Seller[];
  setSellers: (updater: (prev: Seller[]) => Seller[]) => void;
  goals: Goals;
  missions: Mission[];
  currentSeller: Seller;
  cycleHistory: CycleSnapshot[];
}

export const SellerContext = React.createContext<SellerContextType | null>(
  null
);

export const useSellerContext = () => {
  const context = React.useContext(SellerContext);
  if (!context) {
    throw new Error('useSellerContext must be used within a SellerLayout');
  }
  return context;
};

const menuItems = [
  {href: '/seller/dashboard', label: 'Dashboard', icon: LayoutGrid},
  {href: '/seller/ranking', label: 'Meu Desempenho', icon: Trophy},
  {href: '/seller/missions', label: 'Missões', icon: Target},
  {href: '/seller/academia', label: 'Academia', icon: GraduationCap},
  {href: '/seller/quiz', label: 'Quiz', icon: Puzzle},
  {href: '/seller/loja', label: 'Loja', icon: ShoppingBag},
  {href: '/seller/historico', label: 'Histórico', icon: History},
  {href: '/seller/perfil', label: 'Meu Perfil', icon: User},
];

const SellerSidebarContent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleNavigate = (href: string) => {
    router.push(href);
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('loggedInSellerId');
    }
    router.push('/login');
     if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
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
                tooltip={{ children: item.label }}
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
        <div className="flex items-center justify-center">
            <Button
              onClick={handleLogout}
              variant="secondary"
              className="w-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground"
            >
              <LogOut className="mr-2 group-data-[collapsible=icon]:mr-0" />
              <span className="group-data-[collapsible=icon]:hidden">Sair</span>
            </Button>
        </div>
      </SidebarFooter>
    </>
  );
};


export default function SellerLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const state = useStore(s => s);

  const [currentSeller, setCurrentSeller] = React.useState<Seller | null>(null);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const sellerId = localStorage.getItem('loggedInSellerId');
    if (sellerId) {
      const foundSeller = state.sellers.find(s => s.id === sellerId);
      if (foundSeller) {
        setCurrentSeller(foundSeller);
      } else {
        localStorage.removeItem('loggedInSellerId');
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [state.sellers, router]);

  const contextValue = React.useMemo(() => ({
    sellers: state.sellers,
    setSellers: dataStore.setSellers,
    goals: state.goals,
    missions: state.missions,
    currentSeller: currentSeller!,
    cycleHistory: state.cycleHistory,
  }), [state.sellers, state.goals, state.missions, currentSeller, state.cycleHistory]);

  if (!isClient || !currentSeller) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Carregando dados do vendedor...
      </div>
    );
  }

  return (
    <SellerContext.Provider value={contextValue}>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar
            collapsible="icon"
            className="border-r border-sidebar-border bg-sidebar"
          >
            <SellerSidebarContent />
          </Sidebar>
          <div className="flex flex-col flex-1">
            <header className="sticky top-0 z-10 md:hidden flex items-center justify-between p-4 border-b bg-background">
              <div className="flex items-center gap-2">
                <Logo />
                <h1 className="text-lg font-semibold text-white">Acelera GT</h1>
              </div>
              <SidebarTrigger />
            </header>
            <main className="flex-1 p-4 sm:p-6 md:p-8 bg-background">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SellerContext.Provider>
  );
}
