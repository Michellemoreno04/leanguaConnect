import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { auth, db } from "@/firebase/firebase";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProfilePictureUploader } from "./uploadPhotos";

export const EditProfile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null); // Asegúrate de manejar los tipos correctamente
  const { uid } = useParams(); // Obtén el parámetro de la URL

  const [profileDefault, setProfileDefault] = useState({
    defaultName: "",
    defaultEnglishLevel: 0,
    defaultHobbies: ["Viajar", "Música", "Cocina", "Deportes"],
    defaultGoals:
      "Alcanzar fluidez en inglés en 6 meses\nViajar a 3 países de habla inglesa este año\nLeer 10 libros en inglés",
    defaultLenguages: ["Español", "Inglés"],
  });

  const [updateProfile, setUpdateProfile] = useState({
    name: "",
    englishLevel: 0,
    hobbies: [],
    goals: "",
    lenguages: [],
  });

  // Obtén el UID del usuario actual y trae los datos del perfil
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid); // Usa el UID del usuario autenticado

        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid)); // Usa currentUser.uid aquí
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Establece los datos del perfil a editar
            setUpdateProfile({
              name: userData.name || profileDefault.defaultName,
              englishLevel:
                userData.englishLevel || profileDefault.defaultEnglishLevel,
              hobbies: userData.hobbies || profileDefault.defaultHobbies,
              goals: userData.goals || profileDefault.defaultGoals,
              lenguages: userData.lenguages || profileDefault.defaultLenguages,
            });
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
    });

    return () => unsubscribe();
  }, [navigate]);

  // Función para manejar la actualización del perfil
  const handleProfileUpdate = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    // Actualizamos solo los datos que el usuario haya modificado
    const updatedData = {
      name: formData.get("name") || updateProfile.name,
      englishLevel: formData.get("englishLevel")
        ? Number(formData.get("englishLevel"))
        : updateProfile.englishLevel,
      /**
       * Función para manejar la actualización del perfil
       */
      hobbies: formData.get("hobbies")
        ? formData
          .get("hobbies")
          .toString()
          .split(",")
          .map((hobby) => hobby.trim())
        : updateProfile.hobbies,
      goals: formData.get("goals") || updateProfile.goals,
      lenguages: formData.get("lenguages")
        ? formData
          .get("lenguages")
          .toString()
          .split(",")
          .map((l) => l.trim())
        : updateProfile.lenguages,
    };

    try {
      // Actualiza el perfil del usuario en Firestore
      if (userId) {
        await setDoc(doc(db, "users", userId), updatedData, { merge: true });
        console.log("Perfil actualizado correctamente en Firebase.");
        setUpdateProfile(updatedData);
      } else {
        console.error("No se ha obtenido el userId.");
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }

    window.location.reload();
  };


  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar perfil</span>
        
        </Button>
      </DialogTrigger>

      <DialogHeader>
    

        <DialogTitle>Editar Perfil</DialogTitle>
        
      </DialogHeader>
      <div className="flex justify-center">
        <ProfilePictureUploader />
      </div>
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div id="name">
          <Label htmlFor="name" >Nombre</Label>
          <Input id="name" name="name" placeholder="Nombre" />
        </div>

        <div>
          <Label htmlFor="englishLevel">Nivel de Inglés (%)</Label>
          <Input
            id="englishLevel"
            name="englishLevel"
            type="number"
            min="0"
            max="100"
            placeholder="Nivel de Inglés"
          />
        </div>
        <div>
          <Label htmlFor="hobbies">Gustos/Hobbies (separados por comas)</Label>
          <Input
            id="hobbies"
            name="hobbies"
            defaultValue={updateProfile.hobbies.join(", ")}
          />
        </div>
        <div>
          <Label htmlFor="goals">Metas (una por línea)</Label>
          <Textarea
            id="goals"
            name="goals"
            defaultValue={updateProfile.goals}
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="lenguages">Aprendiendo</Label>
          <Input
            id="lenguages"
            name="lenguages"
            
            placeholder="Idiomas que quieres aprender"
          />
        </div>
        <Button type="submit">Guardar Cambios</Button>
      </form>
    </Dialog>
  );
};
