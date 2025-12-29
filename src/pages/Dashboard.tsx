import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  Music2, 
  TrendingUp,
  ChevronRight,
  Clock,
  MapPin
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<"admin" | "member">("member");

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      // For now, set as admin - will be updated when we add role management
      setUserRole("admin");
    };
    
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  // Mock data for demonstration
  const nextEvent = {
    title: "Culto de Quarta",
    date: new Date(2024, 11, 31, 19, 30),
    location: "Templo Principal"
  };

  const upcomingSchedule = [
    { role: "Bateria", member: "João Silva" },
    { role: "Contrabaixo", member: "Maria Santos" },
    { role: "Guitarra", member: "Pedro Oliveira" },
    { role: "Vocal", member: "Ana Costa" },
    { role: "Mídia", member: "Lucas Ferreira" },
  ];

  return (
    <DashboardLayout userRole={userRole} onLogout={handleLogout}>
      <PageHeader 
        title="Dashboard" 
        description={`Olá, ${user?.user_metadata?.name || "bem-vindo"}! Aqui está o resumo do ministério.`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total de Membros"
          value="24"
          subtitle="4 novos este mês"
          variant="primary"
        />
        <StatCard
          icon={Calendar}
          title="Eventos este Mês"
          value="12"
          subtitle="4 quartas, 8 domingos"
        />
        <StatCard
          icon={Music2}
          title="Escalas Geradas"
          value="36"
          subtitle="100% preenchidas"
        />
        <StatCard
          icon={TrendingUp}
          title="Participação Média"
          value="87%"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Event */}
        <Card className="lg:col-span-2 shadow-card border-border/50 overflow-hidden">
          <div className="bg-gradient-hero p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Próximo Evento</p>
                <h3 className="text-2xl font-display font-bold mb-2">
                  {nextEvent.title}
                </h3>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {format(nextEvent.date, "EEEE, dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {nextEvent.location}
                  </span>
                </div>
              </div>
              <Button variant="glass" size="sm" onClick={() => navigate("/escala")}>
                Ver Escala
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <CardContent className="p-6">
            <h4 className="font-semibold text-foreground mb-4">Escala do Evento</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {upcomingSchedule.map((item, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-xl bg-accent/50 border border-border/50 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-xs text-muted-foreground mb-1">{item.role}</p>
                  <p className="font-medium text-foreground text-sm">{item.member}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {userRole === "admin" && (
              <>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/membros")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Gerenciar Membros
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/escala")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Gerar Nova Escala
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate("/disponibilidade")}
            >
              <Clock className="w-4 h-4 mr-2" />
              Marcar Indisponibilidade
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card className="mt-6 shadow-card border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Próximos Eventos</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/escala")}>
            Ver todos
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: "01/01", day: "Quarta", title: "Culto de Quarta", time: "19:30" },
              { date: "05/01", day: "Domingo", title: "Escola Dominical", time: "09:00" },
              { date: "05/01", day: "Domingo", title: "Culto da Noite", time: "19:00" },
            ].map((event, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                  <span className="text-xs text-primary font-medium">{event.day.slice(0, 3)}</span>
                  <span className="text-sm font-bold text-primary">{event.date.split("/")[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="text-sm text-muted-foreground">{event.time}</p>
                </div>
                <Badge variant="outline">{event.day}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}