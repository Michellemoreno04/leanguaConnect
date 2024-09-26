import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Video, Users, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 text-white">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Globe className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Logo aqui</h1> 
        </div>
        <nav>
          <Link to={"/login"}>
          <Button variant="ghost">Login</Button>
          </Link>
          <Link to={"/login"}>
          <Button variant="ghost">Sign Up</Button>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-40">
          <h2 className="text-5xl font-extrabold mb-4 animate-pulse">
            Connect. Learn. Explore.
          </h2>
          <p className="text-xl mb-8">
            Dive into a universe of languages and cultures.
          </p>
          <Link to={"/comunidad"}>
          <Button size="lg" className="bg-gradient-to-r from-pink-500 to-yellow-500 hover:from-pink-600 hover:to-yellow-600 text-white">
            Start Your Journey
          </Button>
          </Link>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <Link to={"/videoChat"}>
          <Card className="bg-white/10 backdrop-blur-lg border-none cursor-pointer hover:scale-105 transition duration-300">
            <CardContent className="p-6">
              <Video className="h-12 w-12 mb-4 text-cyan-400" />
              <h3 className="text-2xl font-bold mb-2">Random Video Chats</h3>
              <p>Connect with language partners from around the world in real-time video calls.</p>
            </CardContent>
          </Card>
          </Link>
          
          <Link to={"/comunidad"}>
          <Card className="bg-white/10 backdrop-blur-lg border-none cursor-pointer hover:scale-105 transition duration-300">
            <CardContent className="p-6">
              <Users className="h-12 w-12 mb-4 text-green-400" />
              <h3 className="text-2xl font-bold mb-2">Language Exchange</h3>
              <p>Practice your target language with native speakers and help others learn your language.</p>
            </CardContent>
          </Card>
          </Link>
        </section>

        <section className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">Popular Languages</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'].map((lang) => (
              <Badge key={lang} variant="secondary" className="text-lg py-2 px-4">
                {lang}
              </Badge>
            ))}
          </div>
        </section>

        <section className="relative">
          <Card 
            className="bg-gradient-to-r from-cyan-500 to-blue-500 border-none overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
          
          </Card>
          
        </section>
      </main>

      <footer className="mt-16 py-8 text-center text-sm">
        <p>&copy; 2023 LinguaVerse. All rights reserved.</p>
      </footer>
    </div>
  )
}