'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useSellerContext } from "../layout";
import { useToast } from "@/hooks/use-toast";

export default function PerfilPage() {
    const { currentSeller } = useSellerContext();
    const { toast } = useToast();
    const [email, setEmail] = useState(currentSeller.email || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({
                variant: 'destructive',
                title: 'Erro',
                description: 'As senhas não coincidem. Por favor, tente novamente.',
            });
            return;
        }

        // In a real app, you would handle the update logic here.
        // For this prototype, we'll just show a success message.
        console.log({
            userId: currentSeller.id,
            newEmail: email,
            newPassword: password,
        });

        toast({
            title: 'Perfil Atualizado!',
            description: 'Suas informações foram salvas com sucesso.',
        });

        setPassword('');
        setConfirmPassword('');
    }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <User className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
      </div>
      <Card className="bg-card border-border max-w-2xl">
        <CardHeader>
            <CardTitle>Configurações da Conta</CardTitle>
            <CardDescription>Atualize suas informações de login.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" value={currentSeller.name} disabled className="bg-input" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-input" />
                </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Nova Senha</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-input" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-input" />
                    </div>
                 </div>
                 <div className="flex justify-end">
                    <Button type="submit">Salvar Alterações</Button>
                 </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
