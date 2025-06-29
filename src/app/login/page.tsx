'use client'

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

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle authentication here.
    // For this prototype, we'll just redirect to the seller dashboard.
    router.push('/seller');
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
            Entre com seu e-mail ou nickname para acessar a área do vendedor.
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
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline text-muted-foreground hover:text-primary">
                    Esqueceu sua senha?
                  </Link>
                </div>
                <Input id="password" type="password" required className="bg-input" defaultValue="123456" />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Entrar
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            É um administrador?{" "}
            <Link href="/admin" className="underline hover:text-primary">
              Acesse o painel
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
