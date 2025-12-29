import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Plus, 
  Search, 
  Users, 
  Phone, 
  Mail,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

// Mock data - will be replaced with Supabase data
const mockMembers = [
  { 
    id: 1, 
    name: "João Silva", 
    email: "joao@email.com", 
    phone: "(11) 99999-1111",
    roles: ["Bateria", "Vocal"],
    isActive: true 
  },
  { 
    id: 2, 
    name: "Maria Santos", 
    email: "maria@email.com", 
    phone: "(11) 99999-2222",
    roles: ["Contrabaixo"],
    isActive: true 
  },
  { 
    id: 3, 
    name: "Pedro Oliveira", 
    email: "pedro@email.com", 
    phone: "(11) 99999-3333",
    roles: ["Guitarra", "Violão"],
    isActive: true 
  },
  { 
    id: 4, 
    name: "Ana Costa", 
    email: "ana@email.com", 
    phone: "(11) 99999-4444",
    roles: ["Vocal", "Ministro de Louvor"],
    isActive: true 
  },
  { 
    id: 5, 
    name: "Lucas Ferreira", 
    email: "lucas@email.com", 
    phone: "(11) 99999-5555",
    roles: ["Mídia"],
    isActive: false 
  },
];

const roleColors: Record<string, string> = {
  "Vocal": "bg-pink-100 text-pink-700 border-pink-200",
  "Ministro de Louvor": "bg-amber-100 text-amber-700 border-amber-200",
  "Bateria": "bg-red-100 text-red-700 border-red-200",
  "Violão": "bg-green-100 text-green-700 border-green-200",
  "Contrabaixo": "bg-purple-100 text-purple-700 border-purple-200",
  "Guitarra": "bg-blue-100 text-blue-700 border-blue-200",
  "Mídia": "bg-cyan-100 text-cyan-700 border-cyan-200",
};

export default function Membros() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState(mockMembers);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout userRole="admin" onLogout={handleLogout}>
      <PageHeader 
        title="Membros" 
        description="Gerencie os membros do ministério de louvor"
        actions={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Membro
          </Button>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar membros..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredMembers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum membro encontrado"
          description="Comece adicionando membros ao ministério de louvor"
          action={{
            label: "Adicionar Membro",
            onClick: () => {}
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member, index) => (
            <Card 
              key={member.id} 
              className="shadow-card border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-lg">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <Badge 
                        variant={member.isActive ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {member.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {member.roles.map((role) => (
                    <span
                      key={role}
                      className={`text-xs px-2 py-1 rounded-full border ${roleColors[role] || "bg-muted text-muted-foreground border-border"}`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}