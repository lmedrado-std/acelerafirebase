'use client'

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminContext } from "../layout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PerfilPage() {
    const { toast } = useToast();
    const { sellers, setSellers } = useAdminContext();
    
    const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    
    const selectedSeller = sellers.find(s => s.id === selectedSellerId);

    useEffect(() => {
        if (selectedSeller) {
            setNickname(selectedSeller.nickname || '');
            setPassword(selectedSeller.password || '');
        } else {
            setNickname('');
            setPassword('');
        }
    }, [selectedSellerId, selectedSeller]);

    const handleSellerSelect = (sellerId: string) => {
        setSelectedSellerId(sellerId);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSellerId) {
            toast({
                variant: 'destructive',
                title: 'Nenhum Vendedor Selecionado',
                description: 'Por favor, selecione um vendedor para atualizar.',
            });
            return;
        }

        setSellers(prevSellers => 
            prevSellers.map(seller => 
                seller.id === selectedSellerId 
                    ? { ...seller, nickname: nickname, password: password }
                    : seller
            )
        );

        toast({
            title: 'Perfil do Vendedor Atualizado!',
            description: `As informações de ${selectedSeller?.name} foram salvas com sucesso.`,
        });
    }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <UserCog className="size-8 text-primary" />
        <h1 className="text-3xl font-bold">Gerenciar Perfis de Vendedores</h1>
      </div>
      <Card className="bg-card border-border max-w-2xl">
        <CardHeader>
            <CardTitle>Configurações de Acesso</CardTitle>
            <CardDescription>Selecione um vendedor para editar seu login e senha.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <Label htmlFor="seller-select">Selecionar Vendedor</Label>
                    <Select onValueChange={handleSellerSelect} value={selectedSellerId || ""}>
                        <SelectTrigger id="seller-select">
                            <SelectValue placeholder="Escolha um vendedor..." />
                        </SelectTrigger>
                        <SelectContent>
                            {sellers.map(seller => (
                                <SelectItem key={seller.id} value={seller.id}>{seller.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                {selectedSellerId && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="nickname">Login (Nickname)</Label>
                            <Input id="nickname" type="text" placeholder="Nickname do vendedor" value={nickname} onChange={(e) => setNickname(e.target.value)} className="bg-input" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Nova Senha</Label>
                            <Input id="password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-input" placeholder="Defina a senha do vendedor" />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">Salvar Alterações</Button>
                        </div>
                    </>
                )}
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
