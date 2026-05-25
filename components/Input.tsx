import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: theme.background, 
            borderColor: error ? '#EF4444' : theme.border,
            color: theme.text,
          },
          style,
        ]}
        placeholderTextColor={theme.icon}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});
