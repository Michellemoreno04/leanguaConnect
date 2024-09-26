import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  useNavigate,
} from "react-router-dom";
import Home from "./Componentes-web/home/home.tsx";
import { appFirebase } from "./firebase/firebase";
import Login from "./firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import UserList from "./Componentes-web/user_list/user_list.tsx";
import UserProfile from "./Componentes-web/userProfile/userProfile.tsx";
import Chat from "./Componentes-web/chatComponents/chat.tsx";
import VideoCall from "./Componentes-web/videoCall/videoCall.tsx";
import SendbirdChat from "./Componentes-web/chatComponents/sendBirdChat/sendBirdChat.tsx";
import ChatEngine from "./Componentes-web/chatComponents/chatEngine/chatEngine.tsx";
import HomePage from "./Componentes-web/home/home.tsx";




interface PrivateRouteProps {
  usuario: any; // Aquí puedes especificar el tipo adecuado en lugar de 'any'
  children: ReactNode;
}

//rutas protegidas
const PrivateRoute = ({ usuario, children }: PrivateRouteProps) => {

  const navigate = useNavigate();

 useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      //
      if (user) {
        const uid = user.uid;
        localStorage.setItem('uid', uid);// guardar el uid en el localStorage 
        
        
      }else{
        navigate('/login');
      }

    });

  }, [usuario]);

  // Si el usuario está autenticado, muestra el componente solicitado
  return children;
};

const auth = getAuth(appFirebase);

const App = () => {

  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/comunidad" element={
          <PrivateRoute usuario={auth.currentUser}>
          <UserList />
        </PrivateRoute>  
          }
          
           />

        <Route
          path="/userProfile/:uid"
          element={
            <PrivateRoute usuario={auth.currentUser}>
              <UserProfile  />
            </PrivateRoute>
          }
        />
        <Route
          path='/profile/:uid'
          element={
            
              <UserProfile />
            
          }
        />
              <Route
          path='/chats'
          element={
            <PrivateRoute usuario={auth.currentUser}>
              <Chat />
            </PrivateRoute>
          }
        />
         <Route
          path='/chats/:chatId'
          element={
            <PrivateRoute usuario={auth.currentUser}>
              <Chat />
            </PrivateRoute>
          }
        />
               
        <Route
          path='/videoChat'
          element={
            <PrivateRoute usuario={auth.currentUser}>
              < VideoCall />
            </PrivateRoute>
          }
        />
        <Route
          path='/sendBirdChat'
          element={
            <PrivateRoute usuario={auth.currentUser}>
              < SendbirdChat />
            </PrivateRoute>
          }
        />
        <Route
          path='/sendBirdChat/:userId'
          element={
            <PrivateRoute usuario={auth.currentUser}>
              < SendbirdChat />
            </PrivateRoute>
          }
        />
        <Route
          path='/chatEngine'
          element={
            <PrivateRoute usuario={auth.currentUser}>
              < ChatEngine />
            </PrivateRoute>
          }
        />
      
        
      </Routes>
    </Router>
  );
};
export default App;
