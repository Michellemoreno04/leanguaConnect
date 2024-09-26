import { useEffect, useState } from 'react';
import './auth.css';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged
 } from 'firebase/auth';
import { Link,} from 'react-router-dom';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import {auth} from './firebase'
import {useNavigate} from 'react-router-dom'





const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrado, setRegistrado] = useState(false);
  const [country, setCountry] = useState("");//estado de la ubicación

// Obtener la ubicación del usuario con la API ip-api
  useEffect(() => {
    const getCountry = async () => {
      try {
        const response = await fetch('http://ip-api.com/json/');// aqui es donde se obtiene la información de la ubicación
        const data = await response.json();
        setCountry(data.country);
    
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };
// aqui vamos a guardarlo en firebase database

 
getCountry();
}, []);



// Aquí puedes manejar la autenticación
const signIn = async (e: any) => {
  e.preventDefault();

  if (registrado) {
    try {
      // Registrar nuevo usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Guardar la información del nuevo usuario en Firestore
      await setDoc(
        doc(db, 'users', userCredential.user.uid),
        {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName || 'usuario', // Nombre predeterminado si no hay
          photoURL: userCredential.user.photoURL || '', // Dejar vacío si no hay foto
          lastLogin: new Date(), // Fecha del último inicio de sesión
          country: country,
          firstLogin: true, // Indicar que es la primera vez que se inicia sesión
        },
        { merge: true } // No sobrescribir la información existente
      );

      // Redirigir al perfil del usuario
      navigate(`/profile/${userCredential.user.uid}`);    } catch (error) {
      console.log(error);
      alert(error);
    }
  } else {
    try {
      // Iniciar sesión del usuario
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

// Verificar si el usuario ya tiene un documento en Firestore
const userDocRef = doc(db, "users", userCredential.user.uid);
const userDoc = await getDoc(userDocRef);

      const firstLogin = !userDoc.exists() || userDoc.data()?.firstLogin !== false;

      // (Opcional) Actualizar la información del usuario en Firestore al iniciar sesión
      await setDoc(
        doc(db, 'users', userCredential.user.uid),
        {
          email: userCredential.user.email,
          lastLogin: firstLogin,
          country: country,
        },
        { merge: true }
      );

      // Redirigir al perfil del usuario
      navigate(`/profile/${userCredential.user.uid}`);
    } catch (error) {
      alert('Credenciales incorrectas');
    }
  }
};



  return (
    <div className='login-page'>
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={signIn}>
        <div className="input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            placeholder='example@ex.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder='*******'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit"  className="btn-login">{registrado ? 'Registrate' : 'Iniciar Sesion'}</button>
      </form>
      {/*buton de google */}
      
<button className="button-google" onClick={googleSignIn}>
  <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262">
  <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
  <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
  <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"></path>
  <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
</svg>
  Continue with Google
</button>
      <h4>¿No tienes una cuenta?</h4>
     <Link to={'#'}> <button className="btn-login" onClick={() => setRegistrado(!registrado)}>{ registrado ? 'Iniciar Sesion' : 'Registrate'}</button></Link>
    </div>
    </div>
  );
};

// sign out 
export const logout = async () => {
  const auth = getAuth();

  try {
    // Verifica si el usuario está autenticado
    if (auth.currentUser) {
      await signOut(auth);
      console.log("Sesión cerrada exitosamente.");
    } else {
      console.log("No hay usuario autenticado.");
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  } finally {
    // Redirige al login independientemente de si había un usuario autenticado o no
window.location.href = "/login";}
};
  
// sign in with google
export const googleSignIn = async (e: any) => {
  e.preventDefault();

  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Obtener el país del usuario utilizando la API ip-api
    const countryResponse = await fetch("http://ip-api.com/json/");
    const countryData = await countryResponse.json();
    const userCountry = countryData.country;

    // Verificar si el usuario ya tiene un documento en Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    // Si el documento no existe o el campo firstLogin es true, establece firstLogin en true
    const firstLogin = !userDoc.exists() || userDoc.data()?.firstLogin !== false;

    // Guardar la información del usuario en Firestore
    await setDoc(userDocRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      country: userCountry,
      createdAt: userDoc.exists() ? userDoc.data()?.createdAt : Timestamp.now(), // Mantener la fecha original si ya existe
      firstLogin: firstLogin, // Solo establecer true si es la primera vez
    }, { merge: true });

    console.log("Usuario autenticado:", user);

    // Redirigir a la página de comunidad
    window.location.href = `/profile/${user.uid}`;
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
  }
};

export default Login;
