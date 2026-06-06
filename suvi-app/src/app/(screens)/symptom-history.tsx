import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi, SymptomLog } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function SymptomHistoryScreen() {
  const router = useRouter();
  const { state, getSymptomPatterns } = useSuvi();
  
  const [filterSymptom, setFilterSymptom] = useState<string>('all');
  const patterns = getSymptomPatterns();

  // Get all unique symptoms logged in history for filtering
  const allUniqueLogged = Array.from(
    new Set(state.symptoms.reduce((acc, curr) => [...acc, ...curr.symptoms], [] as string[]))
  );

  const filteredLogs = state.symptoms.filter((log) => {
    return filterSymptom === 'all' || log.symptoms.includes(filterSymptom);
  });

  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return '#00696f'; // Green
    if (severity <= 7) return '#954921'; // Orange
    return '#ba1a1a'; // Red
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader 
          title="Symptom History" 
          onBack={() => router.push('/(tabs)/trackers')}
          rightAction={
            <TouchableOpacity 
              style={styles.headerAddBtn} 
              onPress={() => router.push('/(screens)/log-symptoms')}
              activeOpacity={0.7}
            >
              <Text style={styles.headerAddText}>+ Log</Text>
            </TouchableOpacity>
          }
        />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* AI Pattern Analysis Section */}
          <Text style={styles.sectionTitle}>Suvi AI Pattern Insights</Text>
          <View style={styles.patternsContainer}>
            {patterns.map((item, idx) => (
              <GlassCard key={idx} style={styles.patternCard}>
                <View style={styles.patternHeader}>
                  <Text style={styles.patternIcon}>💡</Text>
                  <Text style={styles.patternTitle}>{item.pattern}</Text>
                </View>
                <Text style={styles.patternCorrelation}>{item.correlation}</Text>
              </GlassCard>
            ))}
          </View>

          {/* Filter Row */}
          <Text style={styles.sectionTitle}>Logged Records</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
            <TouchableOpacity
              style={[styles.filterChip, filterSymptom === 'all' && styles.filterChipActive]}
              onPress={() => setFilterSymptom('all')}
            >
              <Text style={[styles.filterChipText, filterSymptom === 'all' && styles.filterChipTextActive]}>
                All Symptoms
              </Text>
            </TouchableOpacity>
            {allUniqueLogged.map((sym) => (
              <TouchableOpacity
                key={sym}
                style={[styles.filterChip, filterSymptom === sym && styles.filterChipActive]}
                onPress={() => setFilterSymptom(sym)}
              >
                <Text style={[styles.filterChipText, filterSymptom === sym && styles.filterChipTextActive]}>
                  {sym}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Chronological History List */}
          {filteredLogs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>No matching logs found.</Text>
            </View>
          ) : (
            <View style={styles.timelineList}>
              {filteredLogs.map((item, idx) => {
                const date = new Date(item.timestamp);
                const sevColor = getSeverityColor(item.severity);
                return (
                  <View key={item.id} style={styles.timelineItem}>
                    {/* Left Date column */}
                    <View style={styles.dateCol}>
                      <Text style={styles.dateDay}>
                        {date.toLocaleDateString(undefined, { day: '2-digit' })}
                      </Text>
                      <Text style={styles.dateMonth}>
                        {date.toLocaleDateString(undefined, { month: 'short' })}
                      </Text>
                    </View>

                    {/* Timeline connection line */}
                    <View style={styles.lineCol}>
                      <View style={[styles.timelineDot, { backgroundColor: sevColor }]} />
                      {idx < filteredLogs.length - 1 && <View style={styles.timelineLine} />}
                    </View>

                    {/* Right Card Details */}
                    <GlassCard style={styles.detailCard}>
                      <View style={styles.cardHeader}>
                        <View style={styles.symptomsBox}>
                          {item.symptoms.map((s, sIdx) => (
                            <Text key={sIdx} style={styles.symptomText}>
                              ⚠️ {s}
                            </Text>
                          ))}
                        </View>
                        <View style={[styles.severityBadge, { backgroundColor: sevColor + '15', borderColor: sevColor + '30' }]}>
                          <Text style={[styles.severityBadgeText, { color: sevColor }]}>
                            Sev: {item.severity}
                          </Text>
                        </View>
                      </View>

                      {item.notes ? (
                        <Text style={styles.notesText}>"{item.notes}"</Text>
                      ) : null}

                      <View style={styles.cardFooter}>
                        <Text style={styles.footerInfo}>
                          Energy: {item.energy === 'low' ? '😫 Low' : item.energy === 'medium' ? '😐 Med' : '🔋 High'}
                        </Text>
                        <Text style={styles.footerInfo}>
                          {item.duration === 'started-today' ? 'Onset Today' : 'Ongoing'}
                        </Text>
                      </View>
                    </GlassCard>
                  </View>
                );
              })}
            </View>
          )}

          {/* Quick Log CTA */}
          <TouchableOpacity 
            style={styles.logCtaBtn}
            onPress={() => router.push('/(screens)/log-symptoms')}
          >
            <Text style={styles.logCtaBtnText}>Log New Symptoms</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerAddBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerAddText: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
  patternsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  patternCard: {
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  patternIcon: {
    fontSize: 16,
  },
  patternTitle: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  patternCorrelation: {
    fontSize: 13,
    fontFamily: 'Lexend',
    color: '#54433b',
    lineHeight: 18,
  },
  filterRow: {
    marginHorizontal: -24,
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  filterChipActive: {
    backgroundColor: '#954921',
    borderColor: '#954921',
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: '#221a16',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.4,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  timelineList: {
    gap: 16,
    marginBottom: 32,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 80,
  },
  dateCol: {
    width: 44,
    alignItems: 'center',
    paddingTop: 4,
  },
  dateDay: {
    fontSize: 18,
    fontFamily: 'Lexend-Bold',
    color: '#221a16',
  },
  dateMonth: {
    fontSize: 11,
    fontFamily: 'Lexend',
    color: '#87736a',
    textTransform: 'uppercase',
  },
  lineCol: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 8,
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.15)',
    marginVertical: 4,
  },
  detailCard: {
    flex: 1,
    padding: 14,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  symptomsBox: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  symptomText: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  severityBadgeText: {
    fontSize: 10,
    fontFamily: 'Lexend-Bold',
  },
  notesText: {
    fontSize: 13,
    fontFamily: 'Lexend',
    color: '#54433b',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(149, 73, 33, 0.08)',
    paddingTop: 8,
    marginTop: 4,
  },
  footerInfo: {
    fontSize: 11,
    fontFamily: 'Lexend-Medium',
    color: '#87736a',
  },
  logCtaBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#954921',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  logCtaBtnText: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
});
