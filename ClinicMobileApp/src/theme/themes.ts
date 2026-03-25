import {HomeTheme, LoginTheme} from '../types/app';

export const getHomeTheme = (isDarkMode: boolean): HomeTheme => ({
  screenBg: isDarkMode ? '#0b1220' : '#f2f4f7',
  cardBg: isDarkMode ? '#111827' : '#ffffff',
  title: isDarkMode ? '#f8fafc' : '#101828',
  subtitle: isDarkMode ? '#cbd5e1' : '#475467',
  label: isDarkMode ? '#94a3b8' : '#667085',
  value: isDarkMode ? '#f8fafc' : '#101828',
  buttonBorder: isDarkMode ? '#334155' : '#d0d5dd',
  buttonBg: isDarkMode ? '#1f2937' : '#ffffff',
  buttonText: isDarkMode ? '#e2e8f0' : '#344054',
});

export const loginTheme: LoginTheme = {
  screenBg: '#0b1220',
  cardBg: '#111827',
  title: '#f8fafc',
  subtitle: '#cbd5e1',
  label: '#e2e8f0',
  inputBg: '#1f2937',
  inputBorder: '#334155',
  inputText: '#f8fafc',
  inputPlaceholder: '#94a3b8',
};
