import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, onBack, rightAction }) => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack || (() => router.back())}
        activeOpacity={0.7}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {rightAction ? rightAction : <View style={styles.placeholder} />}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 44, // safe area offset
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  backIcon: {
    fontSize: 20,
    color: '#954921',
    fontFamily: 'Lexend-Bold',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  placeholder: {
    width: 40,
  },
});
