import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Configuración de Firebase usando variables de entorno seguras
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID,
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa servicios de autenticación
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Exportación de instancias para uso en otras partes de la app
export { app, auth, provider };
