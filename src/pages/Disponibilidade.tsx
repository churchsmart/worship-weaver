import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarOff, 
  Check,
  X,
  Info
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Disponibilidade() {
  const navigate = useNavigate();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([
    new Date(2024, 11, 25),
    new Date(2024, 11, 29),
  ]);

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

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const isBlocked = blockedDates.some(d => 
      d.toDateString() === date.toDateString()
    );
    
    if (isBlocked) {
      setBlockedDates(blockedDates.filter(d => 
        d.toDateString() !== date.toDateString()
      ));
      toast.success("Data desbloqueada");
    } else {
      setBlockedDates([...blockedDates, date]);
      toast.success("Data marcada como indisponível");
    }
  };

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(d => d.toDateString() === date.toDateString());
  };

  return (
    <DashboardLayout userRole="member" onLogout={handleLogout}>
      <PageHeader 
        title="Disponibilidade" 
        description="Marque as datas em que você não estará disponível para servir"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2 shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarOff className="w-5 h-5 text-primary" />
              Calendário de Disponibilidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-accent/50 mb-6">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">Como funciona?</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Clique nas datas em que você <strong>não estará disponível</strong> para servir. 
                  Por padrão, você é considerado disponível em todas as datas.
                </p>
              </div>
            </div>

            <Calendar
              mode="multiple"
              selected={blockedDates}
              onSelect={(dates) => setBlockedDates(dates || [])}
              className="rounded-lg border p-4"
              locale={ptBR}
              modifiers={{
                blocked: blockedDates
              }}
              modifiersClassNames={{
                blocked: "bg-destructive/20 text-destructive hover:bg-destructive/30"
              }}
            />

            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-destructive/20 flex items-center justify-center">
                  <X className="w-4 h-4 text-destructive" />
                </div>
                <span className="text-sm text-muted-foreground">Indisponível</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blocked Dates Summary */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Datas Bloqueadas</CardTitle>
          </CardHeader>
          <CardContent>
            {blockedDates.length === 0 ? (
              <div className="text-center py-8">
                <Check className="w-12 h-12 mx-auto text-success mb-3" />
                <p className="text-muted-foreground">
                  Você está disponível em todas as datas!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {blockedDates
                  .sort((a, b) => a.getTime() - b.getTime())
                  .map((date, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20 animate-fade-in"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {format(date, "dd 'de' MMMM", { locale: ptBR })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(date, "EEEE", { locale: ptBR })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/20"
                        onClick={() => {
                          setBlockedDates(blockedDates.filter(d => 
                            d.toDateString() !== date.toDateString()
                          ));
                          toast.success("Data desbloqueada");
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Total de datas bloqueadas
              </p>
              <p className="text-3xl font-display font-bold text-foreground">
                {blockedDates.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}