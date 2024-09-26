import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Globe, MessageSquare, Pencil, BookOpen } from "lucide-react";
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Navbar } from '../nabvar/nabvar';
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useParams, useNavigate } from "react-router-dom";
import no_picture from '../pictures/no_profile.jpg';
import { EditProfile } from './editProfile';
import { Badge } from '@/components/ui/badge';
import PhotoUploader from './uploadPhotos';
import { Skeleton } from '../Loaders y skeleton/Skeleton';
import DriverTour from './driverTour';

// Definición de los tipos de datos para el usuario
interface User {
  uid: string;
  name?: string;
  displayName?: string;
  photoURL?: string;
  country?: string;
  firstLogin?: boolean;
  lenguages?: string[];
  goals?: string;
  hobbies?: string[];
  englishLevel?: number;
  photos?: string[];
}

const auth = getAuth();

export default function UserProfile() {
  const { uid } = useParams<{ uid: string }>(); // Obtén el parámetro de la URL 
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Estado para el userId autenticado
  const [loading, setLoading] = useState(true); // Estado para mostrar el loader

  // Get the current user's UID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: FirebaseUser | null) => {
      if (currentUser) {
        setUserId(currentUser.uid);

        try {
          const userDoc = await getDoc(doc(db, "users", uid!));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);

            console.log('Usuario autenticado', currentUser.uid);
          } else {
            console.error("Usuario no encontrado");
            navigate("/login");
          }
        } catch (error) {
          console.error("Error al obtener el usuario:", error);
          navigate("/login");
        }
      } else {
        console.error("Usuario no autenticado");
        navigate("/login");
      }

      setLoading(false);
    });

    return () => unsubscribe(); // Cancelar la suscripción cuando se desmonte
  }, [uid, navigate]);

  // Mostrar un loader mientras los datos del usuario están cargando
  if (loading || !user) {
   return <Skeleton /> 
  }

 // Verificar si es el primer inicio de sesión
  if (user.firstLogin) {
    setTimeout(() => {
      DriverTour()
     }, 1000);
    // Actualizar isFirstLogin a false para que no se muestre de nuevo
    updateDoc(doc(db, "users", uid!), { firstLogin: false });
  }

  // Función para enviar mensajes en SendBirds
  const sendMessage = (user: User) => {
    // Navegar al chat
    navigate(`/sendBirdChat/${user.uid}`);
  }
 



  return (
    <Card className="w-full mx-auto">
      <Navbar />

      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={user ? user.photoURL : no_picture} />
          <AvatarFallback>{user ? user.displayName?.charAt(0) : ''}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <CardTitle className="text-2xl">{user.name ? user.name : user.displayName}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.country}</p>
        </div>

        {userId === user.uid && (
          <div> 
          <Dialog>
            <DialogTrigger asChild >
              <Button variant="outline" size="icon" id="editProfile">
                <Pencil className="h-4 w-4"   />
                <span className="sr-only">Editar perfil</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <EditProfile />
            </DialogContent>
          </Dialog>
          </div>
        )}
      </CardHeader>

      <CardContent className="grid gap-6">
        <div>
          <div className='flex gap-2'>
            <BookOpen className='h-6 w-6 text-blue-600' />
            <h3 className="font-semibold mb-2">Aprendiendo</h3>
          </div>
          <ul className="list-disc list-inside text-sm">
            {user.lenguages?.length ? user.lenguages.map((lenguage, index) => (
              <li key={index}>{lenguage}</li>
            )) : 'No lenguages'}
          </ul>
        </div>
        <div className='w-[50%]'>
          <h3 className="font-semibold mb-2">Metas</h3>
          <ul className="list-disc list-inside text-sm">
            {user.goals ? user.goals : 'No goals'}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Hobbies</h3>
          <div className="flex flex-wrap gap-2">
            {user.hobbies?.length ? user.hobbies.map((hobby, index) => (
              <Badge key={index}>{hobby}</Badge>
            )) : 'No hobbies'}
          </div>
        </div>

        <div className="w-[50%] mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="flex items-center font-medium">
              <Globe className="w-4 h-4 mr-1 text-green-500" />
              Nivel de Inglés
            </span>
            <span className="font-semibold">{user.englishLevel ? user.englishLevel : '0'}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${user.englishLevel ? user.englishLevel : 0}%` }}>
            </div>
            <span>
              {user.englishLevel
                ? user.englishLevel < 20
                  ? "A0: Starter"
                  : user.englishLevel <= 35
                    ? "A1: Elementary"
                    : user.englishLevel <= 50
                      ? "A2: Intermediate"
                      : user.englishLevel <= 65
                        ? "B1: Upper Intermediate"
                        : user.englishLevel <= 80
                          ? "B2: Advanced"
                          : user.englishLevel <= 95
                            ? "C1: Proficient"
                            : "C2: Native"
                : "Ninguno"}
            </span>
          </div>
        </div>

        <div>
          <div className='flex justify-between items-center'>
            <Button onClick={() => sendMessage(user)}>
              <MessageSquare className="mr-2 h-4 w-4" /> Enviar Mensaje
            </Button>
            {userId === user.uid && <PhotoUploader />}
          </div>

          {userId === user.uid && (
            <CardFooter className="flex justify-end"></CardFooter>
          )}
          <h3 className="font-semibold mb-2">Galeria de Fotos</h3>
          <div className="grid grid-cols-3 gap-2">
            {user.photos?.length ? user.photos.map((photo, index) => (
              <img key={index} src={photo} alt={`Foto ${index + 1}`} className="w-[75%] h-[50%] object-fill rounded-md cursor-pointer" />
            )) : 'No photos available'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
