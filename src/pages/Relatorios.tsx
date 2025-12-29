import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, 
  Download,
  Filter,
  Users,
  Calendar,
  Trophy
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for reports
const participationData = [
  { name: "João Silva", participations: 12 },
  { name: "Maria Santos", participations: 10 },
  { name: "Pedro Oliveira", participations: 14 },
  { name: "Ana Costa", participations: 11 },
  { name: "Lucas Ferreira", participations: 8 },
  { name: "Carla Lima", participations: 9 },
];

const monthlyData = [
  { month: "Jul", events: 12 },
  { month: "Ago", events: 13 },
  { month: "Set", events: 12 },
  { month: "Out", events: 14 },
  { month: "Nov", events: 12 },
  { month: "Dez", events: 13 },
];

export default function Relatorios() {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

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

  const topParticipant = participationData.reduce((prev, current) => 
    prev.participations > current.participations ? prev : current
  );

  return (
    <DashboardLayout userRole="admin" onLogout={handleLogout}>
      <PageHeader 
        title="Relatórios" 
        description="Acompanhe a participação e estatísticas do ministério"
        actions={
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        }
      />

      {/* Filters */}
      <Card className="shadow-card border-border/50 mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="member" className="text-sm text-muted-foreground mb-2 block">
                Filtrar por Membro
              </Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os membros" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os membros</SelectItem>
                  {participationData.map((member) => (
                    <SelectItem key={member.name} value={member.name}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="startDate" className="text-sm text-muted-foreground mb-2 block">
                Data Inicial
              </Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Label htmlFor="endDate" className="text-sm text-muted-foreground mb-2 block">
                Data Final
              </Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <Button>
              <Filter className="w-4 h-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Membros</p>
                <p className="text-2xl font-display font-bold">{participationData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary/10">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Eventos no Período</p>
                <p className="text-2xl font-display font-bold">76</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-100">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Maior Participação</p>
                <p className="text-lg font-display font-bold">{topParticipant.name}</p>
                <p className="text-sm text-muted-foreground">{topParticipant.participations} eventos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Participação por Membro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={participationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar 
                    dataKey="participations" 
                    fill="hsl(243 75% 45%)" 
                    radius={[0, 4, 4, 0]}
                    name="Participações"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Eventos por Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar 
                    dataKey="events" 
                    fill="hsl(38 92% 50%)" 
                    radius={[4, 4, 0, 0]}
                    name="Eventos"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="mt-6 shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Detalhamento de Participação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Membro</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Quarta</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Dom. Manhã</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Dom. Noite</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {participationData.map((member, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">{Math.floor(member.participations / 3)}</td>
                    <td className="text-center py-3 px-4">{Math.floor(member.participations / 3)}</td>
                    <td className="text-center py-3 px-4">{member.participations - Math.floor(member.participations / 3) * 2}</td>
                    <td className="text-center py-3 px-4">
                      <span className="font-semibold text-primary">{member.participations}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}