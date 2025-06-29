'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Logo } from "@/components/icons/logo"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { sellersData } from "@/lib/data"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded admin credentials for prototype
    if (login.toLowerCase() === 'admin' && password === 'admin') {
      router.push('/admin');
      return;
    }

    const seller = sellersData.find(
      s => s.email?.toLowerCase() === login.toLowerCase() || s.nickname?.toLowerCase() === login.toLowerCase()
    );

    if (seller && seller.password === password) {
       // In a real app, you would set the user context here.
       // For this prototype, we'll just redirect to the seller dashboard
       // which defaults to a specific seller for now.
      router.push('/seller');
    } else {
      toast({
        variant: 'destructive',
        title: 'Falha no Login',
        description: 'Login ou senha inválidos. Por favor, tente novamente.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm bg-card border-border">
        <CardHeader>
          <div className="flex justify-center mb-4">
             <Logo />
          </div>
          <CardTitle className="text-2xl text-center">Acessar Painel</CardTitle>
          <CardDescription className="text-center">
            Entre com seu e-mail ou nickname para acessar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="login">Email ou Nickname</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="seu@email.com ou nickname"
                  required
                  className="bg-input"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline text-muted-foreground hover:text-primary">
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Entrar
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            É um administrador? Use 'admin' e 'admin' ou{" "}
            <Link href="/admin" className="underline hover:text-primary">
              clique aqui
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
