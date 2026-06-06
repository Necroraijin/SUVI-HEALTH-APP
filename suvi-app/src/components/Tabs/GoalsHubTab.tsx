import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi } from '../../context/SuviStateContext';
import { GlassCard } from '../ui/GlassCard';

export const GoalsHubTab: React.FC = () => {
  const router = useRouter();
  const { state } = useSuvi();
  
  // Local diet logs
  const [loggedKcal, setLoggedKcal] = useState(650);
  const targetKcal = state.profile.focusGoal === 'weight-loss' ? 1800 : 2300;

  // Checklist states
  const [meals, setMeals] = useState([
    { id: 'b', name: 'Breakfast: Oatmeal & Fruit', kcal: 350, checked: true },
    { id: 'l', name: 'Lunch: Brown Rice & Salmon Bowl', kcal: 550, checked: false },
    { id: 's', name: 'Snack: Almonds & Apple', kcal: 150, checked: false },
    { id: 'd', name: 'Dinner: Grilled Chicken Salad', kcal: 450, checked: false },
  ]);

  const [workouts, setWorkouts] = useState([
    { id: 'w1', name: state.profile.gender === 'female' ? 'Luteal Stretch & Yoga' : '20 min Outdoor Walk', duration: '20m', done: false },
    { id: 'w2', name: 'Posture Correction Core Block', duration: '10m', done: true },
  ]);

  const toggleMeal = (id: string, kcal: number) => {
    setMeals(prev => prev.map(m => {
      if (m.id === id) {
        const nextState = !m.checked;
        setLoggedKcal(c => nextState ? c + kcal : c - kcal);
        return { ...m, checked: nextState };
      }
      return m;
    }));
  };

  const toggleWorkout = (id: string) => {
    setWorkouts(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, done: !w.done };
      }
      return w;
    }));
  };

  const calPercent = Math.min(100, Math.round((loggedKcal / targetKcal) * 100));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Goals & Budgets</Text>
      <Text style={styles.subtitle}>Track your workouts, log calorie budgets, and build healthy habits.</Text>

      {/* Goal Quick Links */}
      <View style={styles.goalCardsRow}>
        <TouchableOpacity 
          style={styles.goalCardMini}
          onPress={() => router.push('/(screens)/weight-goal-detail')}
          activeOpacity={0.8}
        >
          <Text style={styles.goalCardIcon}>⚖️</Text>
          <Text style={styles.goalCardLabel}>Weight Goal</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.goalCardMini}
          onPress={() => router.push('/(screens)/medical-goal-detail')}
          activeOpacity={0.8}
        >
          <Text style={styles.goalCardIcon}>🩺</Text>
          <Text style={styles.goalCardLabel}>Medical Goal</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.goalCardMini}
          onPress={() => router.push('/(screens)/fitness-goal-detail')}
          activeOpacity={0.8}
        >
          <Text style={styles.goalCardIcon}>🏃</Text>
          <Text style={styles.goalCardLabel}>Fitness Goal</Text>
        </TouchableOpacity>
      </View>

      {/* Calorie Progress Ring Mock */}
      <GlassCard style={styles.calCard}>
        <Text style={styles.calHeader}>Calorie Budget</Text>
        <View style={styles.calRow}>
          <View style={styles.ringWrapper}>
            <View style={styles.ringCore}>
              <Text style={styles.ringVal}>{loggedKcal}</Text>
              <Text style={styles.ringUnit}>kcal</Text>
            </View>
          </View>
          <View style={styles.calMeta}>
            <Text style={styles.metaLabel}>Goal Budget</Text>
            <Text style={styles.metaVal}>{targetKcal} kcal</Text>
            <Text style={styles.metaLabel}>Status</Text>
            <Text style={styles.metaVal}>{calPercent}% Logged</Text>
          </View>
        </View>
      </GlassCard>

      {/* Meals Section */}
      <Text style={styles.sectionTitle}>Diet Logger</Text>
      <View style={styles.list}>
        {meals.map((m) => (
          <TouchableOpacity
            key={m.id}
            activeOpacity={0.8}
            style={[styles.itemCard, m.checked && styles.checkedCard]}
            onPress={() => toggleMeal(m.id, m.kcal)}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, m.checked && styles.checkboxActive]}>
                {m.checked && <Text style={styles.checkIcon}>✓</Text>}
              </View>
            </View>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemText, m.checked && styles.checkedText]}>{m.name}</Text>
              <Text style={styles.itemSub}>{m.kcal} kcal</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Workouts Section */}
      <Text style={[styles.sectionTitle, styles.topMargin]}>Today's Workout</Text>
      <View style={styles.list}>
        {workouts.map((w) => (
          <TouchableOpacity
            key={w.id}
            activeOpacity={0.8}
            style={[styles.itemCard, w.done && styles.checkedCard]}
            onPress={() => toggleWorkout(w.id)}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, w.done && styles.checkboxActive]}>
                {w.done && <Text style={styles.checkIcon}>✓</Text>}
              </View>
            </View>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemText, w.done && styles.checkedText]}>{w.name}</Text>
              <Text style={styles.itemSub}>{w.duration}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 110,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#954921',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#87736a',
    lineHeight: 20,
    marginBottom: 24,
  },
  calCard: {
    padding: 20,
    marginBottom: 28,
  },
  calHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 16,
  },
  calRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  ringWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 6,
    borderColor: 'rgba(255, 157, 110, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringCore: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringVal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#954921',
  },
  ringUnit: {
    fontSize: 11,
    color: '#87736a',
    textTransform: 'uppercase',
  },
  calMeta: {
    flex: 1,
    gap: 4,
  },
  metaLabel: {
    fontSize: 11,
    color: '#87736a',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  metaVal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 16,
    paddingLeft: 4,
  },
  topMargin: {
    marginTop: 28,
  },
  list: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    alignItems: 'center',
  },
  checkedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  checkboxContainer: {
    marginRight: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#954921',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#954921',
  },
  checkIcon: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemInfo: {
    flex: 1,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 2,
  },
  itemSub: {
    fontSize: 12,
    color: '#87736a',
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#87736a',
  },
  goalCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  goalCardMini: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  goalCardIcon: {
    fontSize: 22,
  },
  goalCardLabel: {
    fontSize: 11,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
});
