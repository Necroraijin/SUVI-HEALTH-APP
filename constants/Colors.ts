const tintColorLight = '#0EA5E9'; // Blue primary
const tintColorDark = '#10B981'; // Green primary

const Colors = {
  light: {
    text: '#1F2937', // Dark gray text for readability
    background: '#FFFFFF', // Clean white
    backgroundSecondary: '#E0F2FE', // Soft blue background
    backgroundTertiary: '#D1FAE5', // Soft green background
    tint: tintColorLight,
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    primary: '#0EA5E9',
    secondary: '#10B981',
    border: '#E5E7EB',
  },
  dark: {
    // We will keep a dark mode equivalent although minimalist UI is mainly light-focused
    text: '#F9FAFB',
    background: '#111827',
    backgroundSecondary: '#1F2937',
    backgroundTertiary: '#374151',
    tint: tintColorDark,
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    primary: '#0EA5E9',
    secondary: '#10B981',
    border: '#374151',
  },
};

export default Colors;
