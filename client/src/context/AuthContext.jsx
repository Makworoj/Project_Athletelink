import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentAthlete, setCurrentAthlete] = useState(null);
  const [currentScout, setCurrentScout] = useState(null);

  // Load athlete from localStorage
  useEffect(() => {
    const storedAthlete = localStorage.getItem('currentAthlete');
    if (storedAthlete) {
      try {
        setCurrentAthlete(JSON.parse(storedAthlete));
      } catch {}
    }
  }, []);

  // Load scout from localStorage
  useEffect(() => {
    const storedScout = localStorage.getItem('currentScout');
    if (storedScout) {
      try {
        setCurrentScout(JSON.parse(storedScout));
      } catch {}
    }
  }, []);

  const loginAthlete = (athlete) => {
    localStorage.setItem('currentAthlete', JSON.stringify(athlete));
    setCurrentAthlete(athlete);
  };

  const loginScout = (scout) => {
    localStorage.setItem('currentScout', JSON.stringify(scout));
    setCurrentScout(scout);
  };

  const logout = () => {
    localStorage.removeItem('currentAthlete');
    localStorage.removeItem('currentScout');
    setCurrentAthlete(null);
    setCurrentScout(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentAthlete,
        currentScout,
        loginAthlete,
        loginScout,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);