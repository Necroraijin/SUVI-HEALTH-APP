import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSuvi } from '../../context/SuviStateContext';
import { GlassCard } from '../ui/GlassCard';

interface TodayTabProps {
  onNavigateToTab: (index: number) => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({ onNavigateToTab }) => {
  const { state, logWater, toggleMedication, syncSmartwatch, disconnectSmartwatch, getMorningBrief } = useSuvi();
  const [medModalVisible, setMedModalVisible] = useState(false);

  const activeGoalLabel =
    state.profile.focusGoal === 'medication'
      ? 'Medication Adherence'
      : state.profile.focusGoal === 'fitness'
      ? 'Stamina & Wellness'
      : state.profile.focusGoal === 'weight-loss'
      ? 'Weight Loss Budget'
      : 'Muscle Gain';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Top Welcome Header */}
      <View style={styles.header}>
        <View style={styles.avatarIcon}>
          <Text style={styles.avatarText}>
            {state.profile.gender === 'female' ? '👩' : '👨'}
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.dateText}>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
          <Text style={styles.title}>Good Morning</Text>
        </View>
        <TouchableOpacity style={styles.syncIndicator} onPress={state.watchSynced ? disconnectSmartwatch : syncSmartwatch}>
          <Text style={styles.syncText}>{state.watchSynced ? '🟢 Synced' : '🔌 Sync'}</Text>
        </TouchableOpacity>
      </View>

      {/* Context Goal Bar */}
      <View style={styles.contextContainer}>
        <View style={styles.contextBar}>
          <Text style={styles.contextIcon}>🎯</Text>
          <Text style={styles.contextText}>Focus Goal: {activeGoalLabel}</Text>
        </View>
      </View>

      {/* Morning Brief Card */}
      <GlassCard style={styles.briefCard}>
        <View style={styles.briefHeader}>
          <Text style={styles.briefHeaderIcon}>☀️</Text>
          <Text style={styles.briefHeaderTitle}>Morning Brief</Text>
        </View>
        <Text style={styles.briefBody}>{getMorningBrief()}</Text>
      </GlassCard>

      {/* Focus Area Section */}
      <Text style={styles.sectionTitle}>Today's Focus</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.strip} contentContainerStyle={styles.stripContent}>
        {/* Medication Tile */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.tile}
          onPress={() => setMedModalVisible(!medModalVisible)}
        >
          <View style={styles.tileHeader}>
            <Text style={styles.tileIcon}>💊</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {state.medications[0].takenToday.filter(Boolean).length} of {state.medications[0].totalDoses}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.tileLabel}>Medication</Text>
            <Text style={styles.tileValue}>{state.medications[0].name}</Text>
          </View>
        </TouchableOpacity>

        {/* Steps Tile */}
        <TouchableOpacity activeOpacity={0.9} style={styles.tile} onPress={() => onNavigateToTab(1)}>
          <View style={styles.tileHeader}>
            <Text style={styles.tileIcon}>🏃</Text>
            <View style={[styles.badge, styles.greenBadge]}>
              <Text style={styles.badgeText}>
                {Math.round((state.watchData.steps / state.watchData.stepsGoal) * 100)}%
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.tileLabel}>Steps</Text>
            <Text style={styles.tileValue}>
              {state.watchData.steps.toLocaleString()} / {state.watchData.stepsGoal / 1000}k
            </Text>
          </View>
        </TouchableOpacity>

        {/* Water Tile */}
        <TouchableOpacity activeOpacity={0.9} style={styles.tile} onPress={() => logWater(1)}>
          <View style={styles.tileHeader}>
            <Text style={styles.tileIcon}>💧</Text>
            <View style={[styles.badge, styles.blueBadge]}>
              <Text style={styles.badgeText}>+ Log Glass</Text>
            </View>
          </View>
          <View>
            <Text style={styles.tileLabel}>Hydration</Text>
            <Text style={styles.tileValue}>
              {state.waterGlasses} / {state.waterGoal} glasses
            </Text>
          </View>
        </TouchableOpacity>

        {/* Workout Tile */}
        <TouchableOpacity activeOpacity={0.9} style={styles.tile} onPress={() => onNavigateToTab(1)}>
          <View style={styles.tileHeader}>
            <Text style={styles.tileIcon}>💪</Text>
          </View>
          <View>
            <Text style={styles.tileLabel}>Workout</Text>
            <Text style={styles.tileValue}>
              {state.profile.gender === 'female' && state.menstrualCycleDay > 14
                ? 'Stretching & Pilates'
                : '20 min Walk'}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Medication Quick-Log Sub-card */}
      {medModalVisible && (
        <GlassCard style={styles.medQuickCard}>
          <Text style={styles.medQuickTitle}>Pill Checkoff: {state.medications[0].name}</Text>
          <View style={styles.doseRow}>
            {state.medications[0].timing.map((time, idx) => {
              const isTaken = state.medications[0].takenToday[idx];
              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  style={[styles.doseBtn, isTaken && styles.doseBtnActive]}
                  onPress={() => toggleMedication(state.medications[0].id, idx)}
                >
                  <Text style={[styles.doseBtnLabel, isTaken && styles.doseBtnLabelActive]}>
                    {time} {isTaken ? '✓ Taken' : '○ Log Taken'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>
      )}

      {/* Suggestions Section */}
      <Text style={styles.sectionTitle}>Suggestions for you</Text>
      <View style={styles.suggestionsContainer}>
        {/* Prescription Refill Alert */}
        <GlassCard style={styles.suggestionCard}>
          <View style={styles.suggIconBox}>
            <Text style={styles.suggIcon}>📦</Text>
          </View>
          <View style={styles.suggTextContainer}>
            <Text style={styles.suggBody}>
              Your Metoprolol refill is due in 4 days. Want me to remind you?
            </Text>
            <TouchableOpacity style={styles.suggBtn} onPress={() => onNavigateToTab(2)}>
              <Text style={styles.suggBtnText}>Chat with Suvi</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Step Streak Celebration */}
        <GlassCard style={styles.suggestionCard}>
          <View style={[styles.suggIconBox, styles.fireGlow]}>
            <Text style={styles.suggIcon}>🔥</Text>
          </View>
          <View style={styles.suggTextContainer}>
            <Text style={styles.suggBody}>
              You've hit your steps and hydration goals 5 days in a row. That's your best streak!
            </Text>
          </View>
        </GlassCard>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 22,
  },
  titleContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    color: '#87736a',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#954921',
  },
  syncIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  syncText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#954921',
  },
  contextContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  contextBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    gap: 8,
  },
  contextIcon: {
    fontSize: 14,
  },
  contextText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  briefCard: {
    marginBottom: 28,
    padding: 20,
    shadowColor: '#ff9d6e',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  briefHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  briefHeaderIcon: {
    fontSize: 18,
  },
  briefHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#221a16',
  },
  briefBody: {
    fontSize: 15,
    color: '#54433b',
    lineHeight: 23,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#221a16',
    marginBottom: 16,
    paddingLeft: 4,
  },
  strip: {
    marginHorizontal: -24,
    marginBottom: 20,
  },
  stripContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  tile: {
    width: 150,
    height: 140,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    padding: 16,
    justifyContent: 'space-between',
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tileIcon: {
    fontSize: 22,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(254, 199, 199, 0.5)',
  },
  greenBadge: {
    backgroundColor: 'rgba(0, 219, 231, 0.15)',
  },
  blueBadge: {
    backgroundColor: 'rgba(0, 242, 255, 0.15)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#954921',
  },
  tileLabel: {
    fontSize: 11,
    color: '#87736a',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  tileValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#221a16',
  },
  medQuickCard: {
    marginBottom: 24,
    padding: 16,
    gap: 12,
  },
  medQuickTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#221a16',
  },
  doseRow: {
    flexDirection: 'row',
    gap: 12,
  },
  doseBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doseBtnActive: {
    backgroundColor: '#954921',
    borderColor: '#954921',
  },
  doseBtnLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#954921',
  },
  doseBtnLabelActive: {
    color: '#ffffff',
  },
  suggestionsContainer: {
    gap: 16,
  },
  suggestionCard: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 16,
  },
  suggIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 157, 110, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fireGlow: {
    backgroundColor: 'rgba(236, 178, 255, 0.15)',
  },
  suggIcon: {
    fontSize: 22,
  },
  suggTextContainer: {
    flex: 1,
    gap: 8,
  },
  suggBody: {
    fontSize: 14,
    color: '#221a16',
    lineHeight: 20,
  },
  suggBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#954921',
  },
  suggBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
});
