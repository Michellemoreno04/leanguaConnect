import { Navbar } from "@/Componentes-web/nabvar/nabvar";
import { useMultiChatLogic, MultiChatSocket, MultiChatWindow } from "react-chat-engine-advanced";

const projectId = "9ef7fa73-5f9c-4dd4-aa4d-a64e8ecef555";
const username = "michelle";
const secret = "fcc53b58-268c-4a70-a2c7-507abe98ea7b";

function ChatEngine() {
  const chatProps = useMultiChatLogic(projectId, username, secret);


return(
    <div>
        <Navbar />
        <MultiChatSocket {...chatProps} />
      <MultiChatWindow  {...chatProps} style={{ height: '100vh' }} />

    </div>
)



}

export default ChatEngine;