import { ReactNode, createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConnection';

interface AuthProviderProps {
    children: ReactNode;
}

type AuthContextData = {
  signed: boolean;
  loadingAuth: boolean;
}

interface UserPorps {
  uid: string;
  name: string | null;
  email: string | null;
}

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserPorps | null>(null); // vai ser um objeto UserProps ou null
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if(user) {
        // Tem user logado
        if(user) {
          setUser({
            uid: user.uid,
            name: user?.displayName,
            email: user?.email
          });

          setLoadingAuth(false);
        }

      } else {
        // não tem user logado
        setUser(null);
        setLoadingAuth(false);
      }
    })

    // Caso o componente seja desmontado removemos o olheiro, para evitar gastar procesamento e perder performance
    // Ou seja, desmontando o componente eu cancelo o observer onAuthStateChanged que fica observando se tem usuário logado:
    return () => {
      unsub();
    }

  }, []);

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loadingAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;