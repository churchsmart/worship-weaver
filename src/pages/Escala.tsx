import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Wand2,
  Plus,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWednesday, isSunday, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Mock schedule data
const mockSchedule = [
  {
    date: new Date(2024, 11, 25),
    type: "wednesday",
    title: "Culto de Quarta",
    members: [
      { role: "Bateria", name: "João Silva" },
      { role: "Contrabaixo", name: "Maria Santos" },
      { role: "Guitarra", name: "Pedro Oliveira" },
      { role: "Vocal", name: "Ana Costa" },
      { role: "Mídia", name: "Lucas Ferreira" },
    ]
  },
  {
    date: new Date(2024, 11, 29),
    type: "sunday-morning",
    title: "Escola Dominical",
    members: [
      { role: "Violão", name: "Pedro Oliveira" },
      { role: "Vocal", name: "Ana Costa" },
    ]
  },
  {
    date: new Date(2024, 11, 29),
    type: "sunday-night",
    title: "Culto da Noite",
    members: [
      { role: "Bateria", name: "João Silva" },
      { role: "Contrabaixo", name: "Maria Santos" },
      { role: "Guitarra", name: "Pedro Oliveira" },
      { role: "Vocal", name: "Ana Costa" },
      { role: "Mídia", name: "Lucas Ferreira" },
    ]
  },
];

const eventTypeColors = {
  "wednesday": "bg-amber-100 border-amber-300 text-amber-800",
  "sunday-morning": "bg-sky-100 border-sky-300 text-sky-800",
  "sunday-night": "bg-indigo-100 border-indigo-300 text-indigo-800",
};

export default function Escala() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<typeof mockSchedule[0] | null>(null);

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

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getEventsForDay = (date: Date) => {
    return mockSchedule.filter(event => isSameDay(event.date, date));
  };

  const isEventDay = (date: Date) => {
    return isWednesday(date) || isSunday(date);
  };

  return (
    <DashboardLayout userRole="admin" onLogout={handleLogout}>
      <PageHeader 
        title="Escala" 
        description="Visualize e gerencie as escalas do ministério"
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Criar Eventos
            </Button>
            <Button variant="hero">
              <Wand2 className="w-4 h-4 mr-2" />
              Gerar Escala
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 shadow-card border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
            </CardTitle>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before the first of the month */}
              {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {days.map((day) => {
                const events = getEventsForDay(day);
                const hasEvents = events.length > 0;
                const isEventPossible = isEventDay(day);
                
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => hasEvents && setSelectedEvent(events[0])}
                    className={cn(
                      "aspect-square p-1 rounded-lg border transition-all duration-200 relative",
                      hasEvents && "cursor-pointer hover:shadow-md hover:scale-105",
                      !hasEvents && isEventPossible && "border-dashed border-border/50",
                      !isEventPossible && "bg-muted/30",
                      hasEvents && "bg-primary/5 border-primary/20"
                    )}
                  >
                    <span className={cn(
                      "text-sm",
                      hasEvents && "font-semibold text-primary"
                    )}>
                      {format(day, "d")}
                    </span>
                    {hasEvents && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {events.map((event, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              event.type === "wednesday" && "bg-amber-500",
                              event.type === "sunday-morning" && "bg-sky-500",
                              event.type === "sunday-night" && "bg-indigo-500"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-muted-foreground">Culto de Quarta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sky-500" />
                <span className="text-sm text-muted-foreground">Escola Dominical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span className="text-sm text-muted-foreground">Culto da Noite</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Detalhes do Evento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEvent ? (
              <div className="animate-fade-in">
                <div className={cn(
                  "px-3 py-2 rounded-lg border mb-4",
                  eventTypeColors[selectedEvent.type as keyof typeof eventTypeColors]
                )}>
                  <p className="font-semibold">{selectedEvent.title}</p>
                  <p className="text-sm opacity-80">
                    {format(selectedEvent.date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>

                <h4 className="font-medium text-foreground mb-3">Equipe Escalada</h4>
                <div className="space-y-2">
                  {selectedEvent.members.map((member, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{member.name}</span>
                      </div>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Selecione um evento no calendário para ver os detalhes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}