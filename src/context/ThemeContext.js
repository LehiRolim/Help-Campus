import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext({
  modoEscuro: false,
  alternarModoEscuro: (valor) => {}
});

export function ThemeProvider({ children }) {
  const [modoEscuro, setModoEscuro] = useState(false);

  const alternarModoEscuro = (valor) => {
    setModoEscuro(valor);
  };

  return (
    <ThemeContext.Provider value={{ modoEscuro, alternarModoEscuro }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}