import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { darkTheme, lightTheme, Theme } from "../styles/theme";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@app_theme";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === "dark" || savedTheme === "light") {
        setThemeModeState(savedTheme);
      }
    } catch (error) {
      console.error("Failed to load theme: ", error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error("Failed to save theme: ", error);
    }
  };

  const toggleTheme = () => {
    setThemeModeState(themeMode === "light" ? "dark" : "light");
  };

  const theme = themeMode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider
      value={{ theme, themeMode, toggleTheme, setThemeMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvide");
  }
  return context;
};
