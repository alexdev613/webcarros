import { ReactNode, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface PrivateProps {
  children: ReactNode;
}

export function Private( {children}: PrivateProps ): any {
  const {signed, loadingAuth } = useContext(AuthContext);

  // Se loadingAuth está true returna div se setiver false (não mais estiver carregando) pula o if
  if (loadingAuth) {
    return <div></div>
  }

  // se não estiver logado então, então encaminha pra página de login
  if(!signed) {
    return <Navigate to="/login" />
  }

  // E se estiver logado, deixa renderizar a rota:
  return children;
}