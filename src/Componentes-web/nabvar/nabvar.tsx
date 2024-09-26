
//import '../nabvar/nabvar.css'
import { logout } from '../../firebase/auth'
import {Menu,MenuButton,MenuList,MenuItem,MenuGroup,MenuDivider,Button} from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import no_profile from '../pictures/no_profile.jpg'
import Notifications from '../notifications/notifications'
import { MessageCircle, Users, Video, User as UserIcon, } from 'lucide-react'
import { useState } from 'react'


export  const Navbar = () => {
  const auth = getAuth();
  const user = auth.currentUser; // Obtén el usuario autenticado
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la apertura del menú

  // Función para manejar el clic en el botón de hamburguesa
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full h-[50px] flex justify-end items-center bg-[#27425f] p-4 relative z-10">
    {/* Enlaces que se muestran en pantallas pequeñas */}
    <div className='md:hidden w-[100%] flex justify-center'>
    <Link
          to="/chats"
          className="text-xl font-bold flex items-center space-x-4 text-white"
        >
          <MessageCircle className="ml-3 h-5 w-5" />
        </Link>
        <Link
          to="/comunidad"
          className="text-xl font-bold flex items-center space-x-4 text-white"
        >
          <Users className="ml-3 h-5 w-5" />
        </Link>
        <Link
          to="/videoChat"
          className="text-xl font-bold flex items-center space-x-4 text-white"
        >
          <Video className="ml-3 h-5 w-5" />
        </Link>
        <Notifications />
    </div>
      
      {/* Botón de hamburguesa que se muestra solo en pantallas pequeñas */}
      <button
        className="block md:hidden text-white"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {/* Ícono de hamburguesa */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Enlaces que se muestran en pantallas grandes */}
      <div className="hidden md:flex items-center gap-2">
        <Link
          to="/chatEngine"
          className="text-xl font-bold flex items-center space-x-4 text-white"
        >
          <MessageCircle className="ml-3 h-5 w-5" /> ChatEngine
        </Link>
        <Link
          to="/chats"
          className="text-xl font-bold flex items-center space-x-4 text-white"
        >
          <MessageCircle className="ml-3 h-5 w-5" /> Chats
        </Link>
        <Link
          to="/sendBirdChat"
          className="text-xl font-bold flex items-center space-x-4 text-white"
        >
          <MessageCircle className="ml-3 h-5 w-5" /> SendBird Chat
        </Link>
        <Link
          to="/comunidad"
          className="text-xl font-bold flex items-center space-x-4 text-white"
        >
          <Users className="ml-3 h-5 w-5" /> Usuarios
        </Link>
        <Link
          to="/videoChat"
          className="text-xl font-bold flex items-center space-x-4 text-white"
        >
          <Video className="ml-3 h-5 w-5" /> Video Chat
        </Link>
        <Notifications />
        <Cuenta user={user} />
      </div>

      {/* Menú desplegable para pantallas pequeñas */}
      {isOpen && (
        <div className="absolute top-[50px] right-0  bg-[#27425ff5] flex flex-col items-reverse p-4 md:hidden">
          <Link
            to="/chatEngine"
            className="text-xl font-bold flex items-center space-x-4 text-white mb-2"
            onClick={toggleMenu}
            
          >
            <MessageCircle className="ml-3 h-5 w-5" /> ChatEngine
          </Link>
          <Link
            to="/chats"
            className="text-xl font-bold flex items-center space-x-4 text-white mb-2"
            onClick={toggleMenu}
          >
            <MessageCircle className="ml-3 h-5 w-5" /> Chats
          </Link>
          <Link
            to="/sendBirdChat"
            className="text-xl font-bold flex items-center space-x-4 text-white mb-2"
            onClick={toggleMenu}
          >
            <MessageCircle className="ml-3 h-5 w-5" /> SendBird Chat
          </Link>
          <Link
            to="/comunidad"
            className="text-xl font-bold flex items-center space-x-4 text-white mb-2"
            onClick={toggleMenu}
          >
            <Users className="ml-3 h-5 w-5" /> Usuarios
          </Link>
          <Link
            to="/videoChat"
            className="text-xl font-bold flex items-center space-x-4 text-white mb-2"
            onClick={toggleMenu}
          >
            <Video className="ml-3 h-5 w-5" /> Video Chat
          </Link>
          <Notifications />
         
          <Cuenta user={user} />
        </div>
      )}
      
    </nav>
  );
};
export const Cuenta = ({ user }) => {
  const navigate = useNavigate();

  const goToProfile = () => {
    if (user) {
      // Redirige al usuario a su perfil usando su UID
      navigate(`/profile/${user.uid}`);
    } else {
      // Si no hay usuario autenticado, redirige a la página de inicio de sesión o muestra un mensaje
      navigate('/login');
    }
  };

  return (
    <div className='menu'>
      <Menu>
        <MenuButton as={Button} colorScheme='transparent'>
          {
            <div className='flex items-center gap-1'>
            <span className='text-xl font-bold flex items-center space-x-4 text-white mb-2'>{user && user.displayName ? user.displayName : "Usuario"} </span>
            <img src={user && user.photoURL ? user.photoURL : no_profile} alt={no_profile} className='w-[30px] h-[30px] rounded-full'/>
          </div>
          }
        </MenuButton>
        <MenuList>
          <MenuGroup>
            <MenuItem onClick={goToProfile}>My Profile</MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuItem onClick={logout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}
