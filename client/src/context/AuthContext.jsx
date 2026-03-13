import { createContext, useContext, useState, useEffect } from 'react';

// Initialize Context: This creates the "storage bucket" that components 
// will pull data from. It starts as undefined until the Provider wraps the app.
const AuthContext = createContext();

export function AuthProvider({ children }) {
  //  useState: These track the "live" status of your users.
  // When these change, any component using 'useAuth' will automatically re-render.
  const [currentAthlete, setCurrentAthlete] = useState(null);
  const [currentScout, setCurrentScout] = useState(null);

  //  useEffect (The Hydration Effect): 
  // This runs exactly ONCE when the app first loads. 
  // It checks the browser's disk (localStorage) to see if a session exists.
  useEffect(() => {
    const storedAthlete = localStorage.getItem('currentAthlete');
    const storedScout = localStorage.getItem('currentScout');

    // We use try/catch because JSON.parse will crash the app if 
    // the localStorage string is corrupted or empty.
    try {
      if (storedAthlete) setCurrentAthlete(JSON.parse(storedAthlete));
      if (storedScout) setCurrentScout(JSON.parse(storedScout));
    } catch (error) {
      console.error("Failed to parse auth data from storage", error);
    }
  }, []); // Empty array means: "Only run on initial mount"

  // Action Functions: These bridge the gap between 
  // browser storage (persistent) and React state (temporary/UI).
  
  const loginAthlete = (athlete) => {
    // Save to disk so it survives a page refresh
    localStorage.setItem('currentAthlete', JSON.stringify(athlete));
    // Update React state so the UI updates immediately
    setCurrentAthlete(athlete);
  };

  const loginScout = (scout) => {
    localStorage.setItem('currentScout', JSON.stringify(scout));
    setCurrentScout(scout);
  };

  const logout = () => {
    // Clear everything to reset the app to a "logged out" state
    localStorage.removeItem('currentAthlete');
    localStorage.removeItem('currentScout');
    setCurrentAthlete(null);
    setCurrentScout(null);
  };

  // The Provider: This makes the data and functions accessible 
  // to any child component in the component tree.
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

//  Custom Hook: A shortcut so you don't have to import 
// 'useContext' and 'AuthContext' separately in every file.
export const useAuth = () => useContext(AuthContext);