
import React, { createContext, useContext, useState, useEffect } from 'react';
import { database, User as DBUser } from '@/lib/database';

interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  plan: 'free' | 'pro' | 'enterprise';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, company: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar se há um usuário logado salvo no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Tentando fazer login com:', email);
      
      // Buscar usuário no banco de dados
      const dbUser = await database.getUserByEmail(email);
      console.log('Usuário encontrado no banco:', dbUser);
      
      if (dbUser && dbUser.password === password) {
        const userSession: User = {
          id: dbUser.id!.toString(),
          email: dbUser.email,
          name: dbUser.name,
          company: dbUser.company || 'Empresa Demo',
          plan: 'free'
        };
        
        setUser(userSession);
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        console.log('Login realizado com sucesso');
        return true;
      }
      
      console.log('Credenciais inválidas');
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (name: string, company: string, email: string, password: string): Promise<boolean> => {
    try {
      console.log('Tentando registrar usuário:', { name, company, email });
      
      // Verificar se o email já existe
      const existingUser = await database.getUserByEmail(email);
      if (existingUser) {
        console.log('Email já existe');
        return false;
      }

      // Criar novo usuário no banco
      const newUser: Omit<DBUser, 'id'> = {
        email,
        password,
        name,
        company,
        createdAt: new Date().toISOString()
      };

      const userId = await database.createUser(newUser);
      console.log('Usuário criado com ID:', userId);

      // Criar sessão do usuário
      const userSession: User = {
        id: userId.toString(),
        email,
        name,
        company,
        plan: 'free'
      };

      setUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      console.log('Registro realizado com sucesso');
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    console.log('Logout realizado');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
