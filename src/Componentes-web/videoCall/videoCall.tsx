import { Button } from "@/components/ui/button"
import { Navbar } from "../nabvar/nabvar"
import { VideoChat } from "./videoChat"
import { useContext, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { SocketContext } from "./socket_context";
import NotificationsCalls from "./notificationsCalls";


    
 const VideoCall = () => {
    const { call, callAccepted, myVideo, userVideo, llamando, setLlamando} = useContext(SocketContext);


  
    useEffect(() => {
      if (callAccepted) {
        if (llamando) {
          toast.success("Llamada aceptada");
          setLlamando(false);
        }
        toast.dismiss();
      } else if (!callAccepted && llamando) {
        toast.loading("Conectando...");
      }
    }, [callAccepted, llamando, setLlamando]);
  
    

    return (
        <div className="w-full h-screen bg-[#1c2f43]">
            <Navbar />
            <Toaster theme="dark" />
            {
  call && call.isReceivingCall && !callAccepted && (
    <NotificationsCalls />  
  )
}

            <div className="flex flex-row bg-[white] ">
        <div className="flex flex-col bg-[#27425f] w-[40%] h-[100vh] p-1 ">
           {/*mi video */}
           <video 
           playsInline muted ref={myVideo} autoPlay
           className="w-[100%] h-[100vh] bg-[#1c2f43] mb-1  object-cover "></video>

           {/*video del otro usuario */}
           <video
           playsInline muted ref={userVideo} autoPlay
           className="w-[100%] h-[100vh] bg-[#1c2f43]   "></video>
              
       </div>
       
       
               <VideoChat />
           </div>
       
        </div>
    
    )
}


export const SubNavbar = () => {
    const { nextCall,callUser,idTocall } = useContext(SocketContext);

    return (  
        <div className="flex flex-row bg-[#27425f] w-50% p-2">
            <Button onClick={nextCall} className="bg-blue-600 hover:bg-blue-500 mr-1 w-[15%]" >Next</Button>
            <Button 
            onClick={() => callUser(idTocall)}
            className="bg-gray-500 hover:bg-gray-400 mr-1  w-[15%]"  >Stop</Button>

        </div>  
    ) 

}



export default VideoCall;