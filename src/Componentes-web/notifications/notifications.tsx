import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Notificacion = {
  id: number;
  mensaje: string;
  leida: boolean;
}

export default function Notifications() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([
    { id: 1, mensaje: "Tienes un nuevo mensaje", leida: false },
    { id: 2, mensaje: "Tu pedido ha sido enviado", leida: false },
    { id: 3, mensaje: "Recordatorio: Reunión en 30 minutos", leida: false },
  ]);

  const notificacionesSinLeer = notificaciones.filter(n => !n.leida).length;

  const marcarComoLeida = (id: number) => {
    setNotificaciones(notificaciones.map(n => 
      n.id === id ? { ...n, leida: true } : n
    ));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        
        <Button variant="link" size="icon" className="relative hover:bg-muted flex">
         
         
         <Bell className="h-[1.2rem] w-[1.2rem] text-white"  />
         
          {notificacionesSinLeer > 0 && (
            <Badge className="absolute -top-2 -right-2 px-2 py-1" variant="destructive">
              {notificacionesSinLeer}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          
          <h3 className="font-medium leading-none">Notificaciones</h3>
          {notificaciones.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tienes notificaciones.</p>
          ) : (
            <ul className="grid gap-2">
              {notificaciones.map((notificacion) => (
                <li key={notificacion.id} className="flex items-start gap-2">
                  <Button 
                    variant="ghost" 
                    className="h-auto p-2 text-left"
                    onClick={() => marcarComoLeida(notificacion.id)}
                  >
                    <span className={notificacion.leida ? "text-muted-foreground" : "font-medium"}>
                      {notificacion.mensaje}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
    

        </div>
      </PopoverContent>
    </Popover>
  )
}