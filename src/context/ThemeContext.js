import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({
  modoEscuro: false,
  alternarModoEscuro: (/** @type {boolean} */ valor) => {}
});

/** @param {{ children: React.ReactNode }} props */
export function ThemeProvider({ children }) {
  const [modoEscuro, setModoEscuro] = useState(false);

  useEffect(() => {
    const carregarTema = async () => {
      try {
        const temaSalvo = await AsyncStorage.getItem('helpCampusModoEscuro');

        if (temaSalvo !== null) {
          setModoEscuro(temaSalvo === 'true');
        }
      } catch (erro) {
        console.error('Erro ao carregar tema:', erro);
      }
    };

    carregarTema();
  }, []);

  const alternarModoEscuro = (/** @type {boolean} */ valor) => {
    setModoEscuro(valor);

    AsyncStorage.setItem('helpCampusModoEscuro', String(valor))
      .catch((erro) => console.error('Erro ao salvar tema:', erro));
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