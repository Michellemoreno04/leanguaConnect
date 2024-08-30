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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/usersList" element={
          <PrivateRoute usuario={auth.currentUser}>
          <UserList />
        </PrivateRoute>  
          }
          
           />

        <Route
          path="/userProfile/:uid"
          element={
            <PrivateRoute usuario={auth.currentUser}>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path='/profile/:uid'
          element={
            
              <UserProfile />
            
          }
        />
      </Routes>
    </Router>
  );
};
export default App;
