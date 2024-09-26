import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SubNavbar } from "./videoCall"



export const VideoChat = () => {


  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col justify-between">
      <SubNavbar />
        <h1 className="text-2xl text-center text-black">Chat aleatorio</h1>
{/* Área de mensajes */}
<div className="flex-grow overflow-y-auto p-4">
      {/* Aquí irían los mensajes */}
      <p className="text-black">Este es un mensaje</p>
    </div>
<div className="flex items-center p-4 bg-white border-t space-x-2 justify-end">

<Input type="text"
 className="w-full"
 placeholder="Escribe un mensaje..."
 
 />
  <Button>Enviar</Button>
</div>
    </div>
  )
}
