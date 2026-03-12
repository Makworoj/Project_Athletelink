import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentAthlete, setCurrentAthlete] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('currentAthlete');
    if (stored) {
      try {
        setCurrentAthlete(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const login = (athlete) => {
    localStorage.setItem('currentAthlete', JSON.stringify(athlete));
    setCurrentAthlete(athlete);
  };

  const logout = () => {
    localStorage.removeItem('currentAthlete');
    setCurrentAthlete(null);
  };

  return (
    <AuthContext.Provider value={{ currentAthlete, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);