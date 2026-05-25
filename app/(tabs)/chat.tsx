import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useChatStore } from '@/store/useChatStore';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function ChatScreen() {
  const { messages, addMessage, isTyping, setTyping } = useChatStore();
  const [text, setText] = useState('');
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const handleSend = () => {
    if (!text.trim()) return;
    addMessage({ text, sender: 'user' });
    setText('');
    setTyping(true);

    // Mock AI response
    setTimeout(() => {
      addMessage({ text: 'I understand. Let me help you with that.', sender: 'suvi' });
      setTyping(false);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: theme.icon, marginTop: 40 }}>
            Start a conversation with Suvi.
          </Text>
        }
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <View style={[
              styles.messageBubble,
              isUser ? styles.userBubble : styles.suviBubble,
              { backgroundColor: isUser ? theme.primary : theme.background }
            ]}>
              <Text style={{ color: isUser ? '#FFF' : theme.text }}>{item.text}</Text>
              <Text style={[styles.timestamp, { color: isUser ? '#E0F2FE' : theme.icon }]}>
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          );
        }}
      />
      {isTyping && (
        <Text style={[styles.typingIndicator, { color: theme.icon }]}>Suvi is typing...</Text>
      )}
      <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
        <Input
          placeholder="Type a message..."
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <Button title="Send" onPress={handleSend} style={styles.sendButton} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  suviBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    marginLeft: 12,
    paddingHorizontal: 16,
  }
});
