import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MapPin, Target, Globe } from "lucide-react"
import { Link } from "react-router-dom"
import { Navbar } from "../nabvar/nabvar"
import { useState,useEffect } from "react"
import { getDocs,collection } from "firebase/firestore"
import {db} from "../../firebase/firebase"
import no_profile from '../pictures/no_profile.jpg'


type User = {
  id: string
  name: string
  profilePicture: string
  location: string
  goals: string[]
  englishLevel: number // 0 to 100
}

const users: User[] = [
  {
    id: "1",
    name: "María García",
    profilePicture: "/placeholder.svg?height=80&width=80",
    location: "Madrid, España",
    goals: ["Aprender React", "Mejorar en diseño UI"],
    englishLevel: 75
  },
  {
    id: "2",
    name: "Juan Rodríguez",
    profilePicture: "/placeholder.svg?height=80&width=80",
    location: "Buenos Aires, Argentina",
    goals: ["Dominar TypeScript", "Contribuir a proyectos open source"],
    englishLevel: 60
  },
  {
    id: "3",
    name: "Ana López",
    profilePicture: "/placeholder.svg?height=80&width=80",
    location: "Ciudad de México, México",
    goals: ["Especializarse en UX", "Aprender sobre accesibilidad web"],
    englishLevel: 90
  }
]

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda


  const [profileDefault, setProfilea ] = useState({
    defaultName: "Usuario ", // nombre del usuario por defecto en caso de que no exista
    defaultUsername: "Location",
    defaultEnglishLevel: 0,
    defaultHobbies: ["Viajar", "Música", "Cocina", "Deportes"],
    defaultGoals: "Alcanzar fluidez en inglés en 6 meses\nViajar a 3 países de habla inglesa este año\nLeer 10 libros en inglés",
  })
  
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map(doc => ({
         id: doc.id, // Cambié "uid" a "id" para que coincida con el tipo User
         name: doc.data().displayName, 
         profilePicture: doc.data().photoURL,
         location: doc.data().location || "", // Asegúrate de obtener la ubicación desde Firestore si está disponible
         goals: doc.data().goals || '', // Asegúrate de obtener las metas desde Firestore si están disponibles
         englishLevel: doc.data().englishLevel || 50 ,// Asegúrate de obtener el nivel de inglés desde Firestore si está disponible
         country: doc.data().country || '',
      }));
      setUsers(usersList);
    };
    fetchUsers();


  }, []);

  // Filtrar usuarios en base al término de búsqueda
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
 


  return (
    <div className="bg-slate-100 w-full h-screen">
    <Navbar />

    <div className="p-5">
      <div className="flex justify-between mb-5" >
      <h1 className="text-2xl font-bold mb-6 text-black ">Comunidad</h1>
      
      {/* Barra de búsqueda */}
      
        <input
          type="text"
          placeholder="Find members..."
          className=" w-[30%] h-10 p-2  border-gray-300 rounded-2xl  focus:outline-none "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado cuando el usuario escribe
        />
      </div>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 ">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Link to={`/userProfile/${user.id}`} key={user.id} className="w-[300px]  flex flex-col shadow-lg cursor-pointer transform hover:-translate-y-1 hover:scale-100" >
              
              <Card className="hover:bg-slate-100 h-[375px] " >
                <CardContent className="w-full flex flex-col items-center p-4">
                  <Avatar className="w-25 h-25 mb-2 ">
                    <AvatarImage
                      className="w-[100px] h-[100px]"
                      src={user.profilePicture ? user.profilePicture : no_profile}
                      alt={user.name}
                    />
                    <AvatarFallback>
                    <img src={no_profile} className="w-[100px] h-[100px]" alt="" />
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-lg font-semibold mb-1">
                    {user.name}
                  </h2>
                  <p className="text-xs text-muted-foreground flex items-center mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-blue-800" />
                    {user.country}
                  </p>

                  <div className="w-full">
                    <h3 className="text-xs font-semibold mb-1 flex items-center">
                      <Target className="w-4 h-4 mr-1 text-green-700" />
                      Metas:
                    </h3>
                    <ul className="list-disc list-inside text-xs max-h-12  overflow-hidden line-clamp-3 ">
                      {user.goals ? user.goals : 'no metas aun'}
                    </ul>

                  
                     
                      <div className="w-full mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center font-medium">
                    <Globe className="w-4 h-4 mr-1 text-green-500" />
                    Nivel de Inglés
                  </span>
                  <span className="font-semibold">{user.englishLevel}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${user.englishLevel}%` }}>

                    </div>
                
              
                        <span >
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
                  </div>
                </CardContent>
                <CardFooter className="p-2">
                  
                  <Button className="w-full text-xs" variant="outline" size="sm">
                    Visitar Perfil
                  </Button>
                </CardFooter>
              </Card>
            
            </Link>
          ))
        ) : (
          <p>No se encontraron usuarios</p>
        )}
      </div>
    </div>
  </div>
  )
}
