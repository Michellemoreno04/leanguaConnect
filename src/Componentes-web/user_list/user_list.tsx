import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { MapPin, Target, Globe } from "lucide-react"
import { Link } from "react-router-dom"
import { Navbar } from "../nabvar/nabvar"

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
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h1 className="text-2xl font-bold mb-6 text-black" >Usuarios Registrados</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="flex flex-col">
            <CardContent className="flex flex-col items-center p-4">
              <Avatar className="w-16 h-16 mb-2">
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold mb-1">{user.name}</h2>
              <p className="text-xs text-muted-foreground flex items-center mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                {user.location}
              </p>
              <div className="w-full mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center">
                    <Globe className="w-3 h-3 mr-1" />
                    Nivel de Inglés
                  </span>
                  <span>{user.englishLevel}%</span>
                </div>
                <Progress value={user.englishLevel} className="h-2" />
              </div>
              <div className="w-full">
                <h3 className="text-xs font-semibold mb-1 flex items-center">
                  <Target className="w-3 h-3 mr-1" />
                  Metas:
                </h3>
                <ul className="list-disc list-inside text-xs">
                  {user.goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="p-2">
              <Link to={`/userProfile/${user.id}`} className="w-full text-xs">
              <Button className="w-full text-xs" variant="outline" size="sm">Visitar Perfil</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}