import { arrayUnion, updateDoc, doc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../firebase/firebase"; // Asegúrate de importar la referencia de Firebase correctamente
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

// Componente para subir imágenes
const PhotoUploader = () => {
  const [userId, setUserId] = useState<string | null>(null); // Estado para el userId autenticado
  const [photos, setPhotos] = useState<string[]>([]); // Estado para las fotos subidas

  // useEffect para escuchar los cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid); // Guarda el userId del usuario autenticado
      }
    });
    return () => unsubscribe();
  }, []);

  // Función para subir la foto
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId) {
      console.error("No hay usuario autenticado");
      return;
    }

    const file = e.target.files?.[0]; // Obtén el primer archivo subido

    if (file) {
      const storage = getStorage(); // Inicializa Firebase Storage
      const storageRef = ref(storage, `images/${userId}/${file.name}-${Date.now()}`); // Crea una referencia única para la imagen

      try {
        // Sube el archivo a Firebase Storage
        await uploadBytes(storageRef, file);
        // Obtén la URL de descarga del archivo subido
        const downloadURL = await getDownloadURL(storageRef);

        // Guarda la URL en Firestore dentro del documento del usuario
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
          photos: arrayUnion(downloadURL), // Agrega la nueva URL de la foto al array de fotos del usuario
        });

        // Actualiza el estado de las fotos con la nueva URL
        setPhotos((prevPhotos) => [...prevPhotos, downloadURL]);

        // Recargar la página si es necesario (opcional)
        window.location.reload();
      } catch (error) {
        console.error("Error al subir la imagen: ", error);
      }
    }
  };
  // aqui vamos hacer un loader para cuando se este subiendo la imagen
  if (photos.length > 0) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
        id="photo-upload"
      />
      <Button variant="outline" asChild>
        <label htmlFor="photo-upload" className="cursor-pointer relative">
          <Camera className="mr-2 h-4 w-4" /> Subir Foto
        </label>
      </Button>
    </div>
  );
};


// funcion para cambiar la foto de perfil
export const ProfilePictureUploader = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  // useEffect para obtener el UID del usuario autenticado
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
        setPhotoURL(currentUser.photoURL || null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Función para manejar la subida de la foto de perfil
  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId) {
      console.error('No hay usuario autenticado');
      return;
    }

    const file = e.target.files?.[0];

    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${userId}/${file.name}-${Date.now()}`);

      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Actualiza la foto de perfil del usuario en Firestore
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, { photoURL: downloadURL });

        // Actualiza la foto de perfil del usuario autenticado
        const auth = getAuth();
        const currentUser = auth.currentUser;
        

        // Actualiza el estado con la nueva URL de la foto de perfil
        setPhotoURL(downloadURL);

        // Opción: Recargar para reflejar los cambios inmediatamente
         window.location.reload();
      } catch (error) {
        console.error('Error al subir la foto de perfil: ', error);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept="image/*"
        onChange={handleProfilePhotoUpload}
        className="hidden"
        id="profile-photo-upload"
      />
      <Button variant="outline" asChild>
        <label htmlFor="profile-photo-upload" className="cursor-pointer">
          Cambiar Foto de Perfil
        </label>
      </Button>
    </div>
  );
};


export default PhotoUploader;