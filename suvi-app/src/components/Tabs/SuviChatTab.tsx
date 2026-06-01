import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useSuvi } from '../../context/SuviStateContext';
import { BreathingOrb } from '../ui/BreathingOrb';
import { GlassCard } from '../ui/GlassCard';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'suvi';
  timestamp: Date;
}

export const SuviChatTab: React.FC = () => {
  const { state, getMenstrualPhase } = useSuvi();
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello ${state.profile.name}. I'm here to guide you today. How are you feeling?`,
      sender: 'suvi',
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isThinking]);

  const triggerSuviResponse = (userText: string) => {
    setIsThinking(true);

    setTimeout(() => {
      let suviReply = '';
      const textLower = userText.toLowerCase();

      if (textLower.includes('metformin')) {
        suviReply = `Metformin is incredibly vital for keeping your blood sugar stable and energy levels consistent. I noticed you took your morning dose at 9:00 AM! Please make sure to take your evening 500mg dose with your dinner at 9:00 PM to avoid any stomach sensitivity. How is your appetite feeling today?`;
      } else if (textLower.includes('dizzy') || textLower.includes('lightheaded')) {
        const bpText = state.watchSynced
          ? `I noticed your last blood pressure sync was ${state.watchData.systolicBP}/${state.watchData.diastolicBP} mmHg.`
          : 'Since your smartwatch isn\'t connected right now, could you log a quick manual blood pressure reading?';
        suviReply = `I hear you, ${state.profile.name}. Feeling dizzy is something we want to handle gently. ${bpText} Metoprolol can occasionally cause a mild drop in blood pressure when you stand up quickly. Please sit or lie down right now, drink a full glass of water, and rest for 5 minutes. If this feeling stays or gets stronger, let's contact Dr. Verma immediately.`;
      } else if (textLower.includes('luteal') || textLower.includes('cycle') || textLower.includes('period')) {
        if (state.profile.gender === 'female') {
          const phaseInfo = getMenstrualPhase();
          suviReply = `Sunidhi, today you are on Day ${state.menstrualCycleDay} (${phaseInfo.phaseLabel}). Progesterone is rising, which naturally increases your metabolic demands but can lower explosive stamina. I highly recommend complex carbs (sweet potatoes, oats), avocados for hormone synthesis, and loading up on magnesium (pumpkin seeds) to keep cramps away. Let's swap the heavy weights for a recovery Pilates session today!`;
        } else {
          suviReply = `Since your profile is set to Male, I don't track menstrual cycle adjustments for you. However, we can focus on active recovery: healthy fats (avocados, nuts) and a light cardio stretch walk. How does that sound?`;
        }
      } else if (textLower.includes('meal') || textLower.includes('diet') || textLower.includes('eat')) {
        if (state.profile.focusGoal === 'weight-loss') {
          suviReply = `For your weight loss goals, let's keep your daily budget active. For breakfast: spinach egg white scramble (250 kcal). Lunch: large leafy green bowl with grilled chicken breasts (400 kcal). Snack: apple slices with almond butter (150 kcal). Dinner: baked salmon with asparagus (350 kcal). You've logged 3 glasses of water—let's hit 8 to keep metabolic rates high!`;
        } else {
          suviReply = `To fuel your energy today, let's focus on nutrient-density. A perfect lunch would be a brown rice bowl with roasted vegetables, chickpeas, and a squeeze of lemon. Let's aim to log a couple more glasses of water, since hydration is key for muscle recovery.`;
        }
      } else {
        suviReply = `I hear you, ${state.profile.name}. Carrying the legacy of guidance and care means I am always here to listen. Let's work together to complete your daily routine: water targets, pill consistency, and some light movements. What else is on your mind?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: suviReply,
          sender: 'suvi',
          timestamp: new Date(),
        },
      ]);
      setIsThinking(false);
    }, 2000);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: userMsg,
        sender: 'user',
        timestamp: new Date(),
      },
    ]);
    setInputText('');
    triggerSuviResponse(userMsg);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: prompt,
        sender: 'user',
        timestamp: new Date(),
      },
    ]);
    triggerSuviResponse(prompt);
  };

  const suggestedPrompts =
    state.profile.gender === 'female'
      ? ['Tell me about Metformin', "I'm feeling dizzy", 'Luteal phase meal plan']
      : ['Tell me about Metformin', "I'm feeling dizzy", 'Meal plan for today'];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Suvi Companion</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, isThinking ? styles.statusDotThinking : styles.statusDotActive]} />
            <Text style={styles.statusText}>{isThinking ? 'Thinking...' : 'Listening'}</Text>
          </View>
        </View>
      </View>

      {/* Breathing Avatar Area */}
      <View style={styles.avatarSection}>
        <BreathingOrb type={state.profile.gender === 'female' ? 'sunset' : 'sunset'} size={150} isThinking={isThinking} />
        {state.profile.gender === 'female' && (
          <View style={styles.contextBadge}>
            <Text style={styles.contextText}>Cycle Day {state.menstrualCycleDay} • Recovery</Text>
          </View>
        )}
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <View key={m.id} style={[styles.bubbleWrapper, isUser ? styles.userWrapper : styles.suviWrapper]}>
              <GlassCard style={[styles.bubble, isUser ? styles.userBubble : styles.suviBubble]}>
                <Text style={[styles.bubbleText, isUser ? styles.userText : styles.suviText]}>
                  {m.text}
                </Text>
              </GlassCard>
            </View>
          );
        })}
        {isThinking && (
          <View style={styles.thinkingBubbleWrapper}>
            <GlassCard style={styles.thinkingBubble}>
              <Text style={styles.thinkingText}>Suvi is typing...</Text>
            </GlassCard>
          </View>
        )}
      </ScrollView>

      {/* Suggested Prompts */}
      <View style={styles.promptsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptsScroll}>
          {suggestedPrompts.map((prompt, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.promptBtn}
              onPress={() => handleSuggestedPrompt(prompt)}
            >
              <Text style={styles.promptBtnText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <GlassCard style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type or speak to Suvi..."
            placeholderTextColor="#87736a"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.micBtn} onPress={handleSend} activeOpacity={0.8}>
            <Text style={styles.micIcon}>➔</Text>
          </TouchableOpacity>
        </GlassCard>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 96, // space for bottom tabs
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#954921',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotActive: {
    backgroundColor: '#00dbe7',
  },
  statusDotThinking: {
    backgroundColor: '#cf5cff',
  },
  statusText: {
    fontSize: 11,
    color: '#87736a',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  avatarSection: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  contextBadge: {
    position: 'absolute',
    bottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  contextText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#954921',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 20,
    gap: 16,
  },
  bubbleWrapper: {
    width: '100%',
    flexDirection: 'row',
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  suviWrapper: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#954921',
    borderColor: '#954921',
    borderBottomRightRadius: 4,
  },
  suviBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  suviText: {
    color: '#221a16',
  },
  thinkingBubbleWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  thinkingBubble: {
    maxWidth: '50%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  thinkingText: {
    fontSize: 13,
    color: '#87736a',
    fontStyle: 'italic',
  },
  promptsContainer: {
    height: 48,
    justifyContent: 'center',
  },
  promptsScroll: {
    paddingHorizontal: 20,
    gap: 10,
    alignItems: 'center',
  },
  promptBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
  },
  promptBtnText: {
    fontSize: 12,
    color: '#87736a',
    fontWeight: '500',
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
  },
  inputBar: {
    padding: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  textInput: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#221a16',
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micIcon: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
