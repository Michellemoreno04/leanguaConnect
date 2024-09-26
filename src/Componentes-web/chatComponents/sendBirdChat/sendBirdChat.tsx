import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { App as SendbirdApp } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css';
import { Navbar } from '@/Componentes-web/nabvar/nabvar';

import '@sendbird/uikit-react/dist/index.css';


function SendbirdChat( ) {
  const { userId } = useParams(); // Obtener el ID del usuario con el que se va a chatear
  const [authUser, setAuthUser] = useState<any>(null);
  const auth = getAuth();

  // Obtener los datos del usuario autenticado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setAuthUser(user);
      }
    });
    return () => unsubscribe();
  }, [auth]);

 

  console.log(userId)

  


  // Renderizar el chat si ambos usuarios (autenticado y de destino) están cargados
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Navbar />
      {authUser && (
        <SendbirdApp
          appId={'051F53DB-5AD0-4915-AE2E-2C0FCF417124'}
          userId={authUser.uid} // ID del usuario autenticado que envía el mensaje
          nickname={authUser.displayName} // Nombre del usuario autenticado que envía el mensaje
          //aqui vamos a hacer el canal para los dos usuarios que se van a chatear
          
          />
      )}
      
    </div>
  );
}

export default SendbirdChat;
