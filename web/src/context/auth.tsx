import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

type AuthContextData = {
  user: User | null; //Usuário não autenticado
  signInUrl: string;
  signOut: () => void;
}


export const AuthContext = createContext({} as AuthContextData)

type AuthProvider = {
  children: ReactNode;
}

type AuthResponse = {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}

export function AuthProvider(props: AuthProvider) {
  const [user, setUser] = useState<User | null>(null)

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=fc5e65fc2f1941aa198d&redirect_uri=http://localhost:3000/`;
  /*Preciso recuperar o código de login que foi gerado na URl, enviar ele pelo back-end que vai troca-lo com a api do github e determinar se quele usuário esta autorizado ou não*/ 
  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode,
    })

    const { token, user } = response.data;
    localStorage.setItem('@dowhile:token', token)

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    setUser(user);
  }

  function signOut() {
    setUser(null)
    localStorage.removeItem('@dowhile:token')
  }

  //Responsável por trazer o token com as informações guardadas do usuário para autentica-lo no recarregamento da página
  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token')

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      api.get<User>('profile').then(response => {
        setUser(response.data);
      })
    }
  }, []) 

  useEffect(() => {
    const url =window.location.href;
    const hasGithubCode = url.includes('?code=')

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');
      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode)
    }
  }, [])


  return(
    <AuthContext.Provider value={{ signInUrl, user, signOut}}>
      {props.children}
    </AuthContext.Provider>
  );
}