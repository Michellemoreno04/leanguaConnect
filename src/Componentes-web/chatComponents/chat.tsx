import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { Input, Button } from "@chakra-ui/react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navbar } from "../../Componentes-web/nabvar/nabvar";
import { Chats_List } from "./chats_list";

const db = getFirestore();
const auth = getAuth();

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { chatId } = useParams();
  const [userId, setUserId] = useState(null);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return unsubscribe;
  }, []);

  // Escuchar mensajes en tiempo real para el chat actual
  useEffect(() => {
    if (userId && chatId) {
      const unsubscribe = listenForMessages(chatId, setMessages);
      return () => unsubscribe();
    }
  }, [chatId, userId]);

  // Manejar el envío de mensajes
  const handleSendMessage = async () => {
    if (userId && newMessage.trim() !== "") {
      try {
        await sendMessage(chatId, newMessage, userId);
        setNewMessage(""); // Limpiar el input después de enviar el mensaje
      } catch (error) {
        console.error("Error enviando el mensaje:", error);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Chats_List />
        <div className="w-full">
          <h3 className="text-xl bg-blue-500 text-white p-4 font-bold w-full">
            {'Chat id: ' + chatId}
          </h3>
          <div className="bg-gray-200 p-4 h-[calc(100vh-150px)]">
            {messages.map((message, index) => (
              <div key={index} className="message-container">
                <p className="text-black bg-slate-300 rounded-2xl p-2 w-50">
                  {message.text}
                </p>
                <span>Enviado por: {message.sender}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center p-4">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
            />
            <Button colorScheme="blue" onClick={handleSendMessage}>
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Función para enviar mensajes
async function sendMessage(chatId, message, sender) {
  if (!chatId) {
    console.error("Chat ID no está definido");
    return;
  }
  
  const messagesRef = collection(db, "chats", chatId, "messages");

  try {
    await addDoc(messagesRef, {
      text: message,
      sender,
      timestamp: serverTimestamp(), // Usa serverTimestamp para sincronización con Firestore
    });
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
}

// Escuchar mensajes en tiempo real para el chat actual
function listenForMessages(chatId, setMessages) {
  if (!chatId) {
    console.error("Chat ID no está definido");
    return;
  }

  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp", "asc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => doc.data());
    setMessages(messages);
  });

  return unsubscribe; // Permitir la cancelación de la suscripción si es necesario
}

export default Chat;
