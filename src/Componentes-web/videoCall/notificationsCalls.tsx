import React,{useContext} from 'react'
import { SocketContext } from './socket_context'




const NotificationsCalls = () => {
const {answerCall,call,callAccepted} = useContext(SocketContext)



  return (
    <div >
      
      {call.isReceivedCall && !callAccepted && (

        <div className='notification-call'>
          <p className='caller-name'>{call.name}Fulano is calling...</p>
          <p>Notification...</p>
          <button onClick={answerCall} className='btnCall'>
            Answer
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationsCalls;