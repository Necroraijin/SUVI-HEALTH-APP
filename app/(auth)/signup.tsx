import { View, Text, StyleSheet } from 'react-native';

export default function SignupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up for SUVI Health</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});
