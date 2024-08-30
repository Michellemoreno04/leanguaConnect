import { useState,useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Camera, MessageSquare} from "lucide-react"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import no_picture from "../../Componentes-web/pictures/no_profile.jpg"
import { Navbar } from '../nabvar/nabvar'
import { useParams } from 'react-router-dom'
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const auth = getAuth();



export default function UserProfile() {
  const [photos, setPhotos] = useState([
    '/placeholder.svg?height=100&width=100',
    '/placeholder.svg?height=100&width=100',
    '/placeholder.svg?height=100&width=100'
  ])
  const [user, setUser] = useState(null);

  const { uid } = useParams(); // Obtén el parámetro de la URL

  
  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUser(userDoc.data());
      } else {
        console.error("Usuario no encontrado");
      }
    };

    fetchUser();
  }, [uid, db]);


  const handlePhotoUpload = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotos([...photos, reader.result ])
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card className="w-full mx-auto">
      <Navbar />
      <CardHeader className="flex flex-row items-center gap-4 ">
        <Avatar className="w-20 h-20">
          <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Usuario" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl">{user?.displayName}</CardTitle>
          <p className="text-sm text-muted-foreground">@usuario_nombre</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <h3 className="font-semibold mb-2">Gustos</h3>
          <div className="flex flex-wrap gap-2">
            <Badge>Viajar</Badge>
            <Badge>Música</Badge>
            <Badge>Cocina</Badge>
            <Badge>Deportes</Badge>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Metas</h3>
          <ul className="list-disc list-inside text-sm">
            <li>Alcanzar fluidez en inglés en 6 meses</li>
            <li>Viajar a 3 países de habla inglesa este año</li>
            <li>Leer 10 libros en inglés</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Nivel de Inglés</h3>
          <Progress value={75} className="w-full" />
          <p className="text-sm text-muted-foreground mt-1">Intermedio (B2)</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Fotos</h3>
          <div className="grid grid-cols-3 gap-2">
            {photos.map((photo, index) => (
              <img key={index} src={no_picture} alt={`Foto ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" /> Enviar Mensaje
        </Button>
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
            id="photo-upload"
          />
          <Button variant="outline" asChild>
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Camera className="mr-2 h-4 w-4" /> Subir Foto
            </label>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}