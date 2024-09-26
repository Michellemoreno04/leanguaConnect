import { onAuthStateChanged } from "firebase/auth";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate} from "react-router-dom";



const auth = getAuth();



export const Chats_List = () => {
    const [chats, setChats] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate(); // Hook para redirigir
    

    useEffect(() => {
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      });
  
      return () => unsubscribeAuth();
    }, []);
    
    // Obtener los chats del usuario actual
    useEffect(() => {
      if (!currentUser) return;
    
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('users', 'array-contains', currentUser.uid));
    
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chatsData = snapshot.docs.map(doc => {
          const chat = doc.data();
          
    
          return {
            id: doc.id,
            ...chat,
         
          };
        });
    
        setChats(chatsData);
      });
    
      return () => unsubscribe();
    }, [currentUser]);
    
  
   // Manejar el clic en un chat 
    const handleChatClick = (chatId:any) => {
      navigate(`/chat/${chatId}`); // Redirigir al chat específico
    };
    
    return (
      <div className=" w-[350px] h-[100vh] border border-solid-black bg-white p-2 ">
        {chats.map(chat => (
          <div 
            key={chat.id} 
          onClick={() => handleChatClick(chat.id)} // Añadir evento onClick
          className="bg-gray-200 rounded p-2 mb-1"
          >
            <p className="text-black"><strong>Chat with:</strong> {chat.users.filter(uid => uid !== currentUser.uid).join(', ')}</p>
            <p className="text-black"><strong>Last message:</strong> {chat.lastMessage}</p>
            <p className="text-black"><strong>Time:</strong> {new Date(chat.timestamp?.toDate()).toLocaleString()}</p>
          </div>
        ))}
      </div>
    );
  };