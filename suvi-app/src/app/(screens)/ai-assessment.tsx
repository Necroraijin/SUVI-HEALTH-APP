import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi, SymptomLog } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

export default function AIAssessmentScreen() {
  const router = useRouter();
  const { state } = useSuvi();
  
  // Get latest logged symptom
  const latestLog = state.symptoms[0] as SymptomLog | undefined;

  if (!latestLog) {
    return (
      <GradientBackground>
        <View style={styles.container}>
          <ScreenHeader title="AI Assessment" onBack={() => router.push('/(tabs)/trackers')} />
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No symptoms logged yet.</Text>
          </View>
        </View>
      </GradientBackground>
    );
  }

  const symptomsList = latestLog.symptoms;
  const isUrgent = latestLog.severity >= 8 || symptomsList.includes('Shortness of Breath') || symptomsList.includes('Chest Pain');
  const isModerate = latestLog.severity >= 4 && latestLog.severity <= 7 && !isUrgent;
  
  let headerColor = '#00696f'; // Green
  let headerBg = 'rgba(0, 105, 111, 0.1)';
  let urgencyText = 'MILD / CONSERVATIVE CARE';
  let careSummary = 'Rest, hydration, and observation are recommended. Monitor for any changes.';

  if (isUrgent) {
    headerColor = '#ba1a1a'; // Red
    headerBg = 'rgba(186, 26, 26, 0.1)';
    urgencyText = 'URGENT ATTENTION RECOMMENDED';
    careSummary = 'Please contact a healthcare provider promptly. Avoid strenuous activity.';
  } else if (isModerate) {
    headerColor = '#954921'; // Orange/Yellow
    headerBg = 'rgba(149, 73, 33, 0.1)';
    urgencyText = 'MODERATE SYMPTOMS DETECTED';
    careSummary = 'Consistent self-care and medical follow-up if symptoms persist past 24-48 hours.';
  }

  // Generate dynamic triage recommendations
  const getTriageDetails = () => {
    const causes: string[] = [];
    const actions: string[] = [];

    if (symptomsList.includes('Headache')) {
      causes.push('Tension, dehydration, or potential minor side effect of Metoprolol.');
      actions.push('Rest in a quiet, dimly lit room.');
      actions.push('Drink 300-500ml of water right now to address potential dehydration.');
    }
    if (symptomsList.includes('Fatigue')) {
      causes.push('May correlate with poor sleep duration (5.5 hrs avg) or glucose fluctuations.');
      actions.push('Avoid intense cardiovascular workouts today. Switch to a light walk.');
      actions.push('Ensure a well-balanced snack containing complex carbs and protein.');
    }
    if (symptomsList.includes('Dizziness')) {
      causes.push('Orthostatic blood pressure change, potentially linked to Metoprolol dose timing.');
      actions.push('Avoid sudden changes in posture. Stand up slowly.');
      actions.push('Record your blood pressure to verify if it is in normal bounds.');
    }
    if (symptomsList.includes('Nausea') || symptomsList.includes('Stomach Pain')) {
      causes.push('Gastric irritation, common when taking Metformin on an empty stomach.');
      actions.push('Ensure Metformin is always taken with or immediately after a substantial meal.');
      actions.push('Sip ginger tea or warm water to settle stomach lining.');
    }
    if (symptomsList.includes('Shortness of Breath')) {
      causes.push('Needs clinical evaluation. Could be respiratory strain or cardiovascular check requirement.');
      actions.push('Sit upright, focus on slow, controlled nasal breathing.');
      actions.push('Contact your physician if breathing does not normalize within 10 minutes.');
    }

    // Fallbacks
    if (causes.length === 0) {
      causes.push('General inflammatory response, environmental trigger, or physical fatigue.');
    }
    if (actions.length === 0) {
      actions.push('Ensure proper hydration and log symptoms again if they evolve.');
      actions.push('Rest and allow your body to recover.');
    }

    return { causes, actions };
  };

  const { causes, actions } = getTriageDetails();

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader title="AI Assessment" onBack={() => router.push('/(screens)/log-symptoms')} />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Triage Urgency Header Card */}
          <GlassCard style={[styles.urgencyCard, { backgroundColor: headerBg, borderColor: headerColor + '30' }]}>
            <View style={styles.urgencyRow}>
              <View style={[styles.statusDot, { backgroundColor: headerColor }]} />
              <Text style={[styles.urgencyTitle, { color: headerColor }]}>{urgencyText}</Text>
            </View>
            <Text style={styles.urgencyDesc}>{careSummary}</Text>
          </GlassCard>

          {/* Active Symptoms Logged */}
          <Text style={styles.sectionTitle}>Logged Symptoms</Text>
          <View style={styles.symptomsTags}>
            {symptomsList.map((sym, idx) => (
              <View key={idx} style={styles.symptomTag}>
                <Text style={styles.symptomTagText}>⚠️ {sym}</Text>
              </View>
            ))}
          </View>

          {/* Possible Causes (Clinical Interpretations) */}
          <Text style={styles.sectionTitle}>Possible Causes</Text>
          <GlassCard style={styles.detailsCard}>
            {causes.map((cause, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.listText}>{cause}</Text>
              </View>
            ))}
          </GlassCard>

          {/* Recovery Actions Checklist */}
          <Text style={styles.sectionTitle}>Recommended Actions</Text>
          <GlassCard style={styles.detailsCard}>
            {actions.map((act, idx) => (
              <View key={idx} style={styles.actionItem}>
                <View style={styles.checkboxMock}>
                  <Text style={styles.checkboxCheck}>✓</Text>
                </View>
                <Text style={styles.actionText}>{act}</Text>
              </View>
            ))}
          </GlassCard>

          {/* Doctor Call/Booking Escalation Card */}
          <GlassCard style={styles.doctorCard}>
            <View style={styles.docHeader}>
              <Text style={styles.docAvatar}>🩺</Text>
              <View style={styles.docText}>
                <Text style={styles.docName}>Dr. Sanjay Verma</Text>
                <Text style={styles.docSpec}>Primary Cardiologist • Available</Text>
              </View>
            </View>
            <Text style={styles.docActionDesc}>
              Since you've logged recurring or notable symptoms, discussing these during your upcoming cardiologist review is recommended.
            </Text>
            <View style={styles.docBtnRow}>
              <TouchableOpacity 
                style={styles.docCallBtn}
                onPress={() => Linking.openURL('tel:+919876543210')}
              >
                <Text style={styles.docCallText}>📞 Call Clinic</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.docBookBtn}
                onPress={() => router.push('/(tabs)/suvi-chat')}
              >
                <Text style={styles.docBookText}>Discuss with Suvi</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Footer Navigation Buttons */}
          <View style={styles.navRow}>
            <TouchableOpacity 
              style={styles.historyBtn}
              onPress={() => router.push('/(screens)/symptom-history')}
            >
              <Text style={styles.historyBtnText}>View History & Patterns</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.finishBtn}
              onPress={() => router.push('/(tabs)/trackers')}
            >
              <Text style={styles.finishBtnText}>Go to Hub</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 48,
  },
  urgencyCard: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  urgencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  urgencyTitle: {
    fontSize: 12,
    fontFamily: 'Lexend-Bold',
    letterSpacing: 0.5,
  },
  urgencyDesc: {
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#221a16',
    lineHeight: 20,
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
  symptomsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  symptomTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  symptomTagText: {
    fontSize: 13,
    fontFamily: 'Lexend-Medium',
    color: '#221a16',
  },
  detailsCard: {
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#954921',
    fontWeight: 'bold',
  },
  listText: {
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#54433b',
    lineHeight: 20,
    flex: 1,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxMock: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 105, 111, 0.15)',
    borderWidth: 1,
    borderColor: '#00696f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCheck: {
    fontSize: 12,
    color: '#00696f',
    fontWeight: 'bold',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Lexend-Medium',
    color: '#221a16',
    flex: 1,
  },
  doctorCard: {
    padding: 18,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 157, 110, 0.25)',
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  docAvatar: {
    fontSize: 32,
  },
  docText: {
    flex: 1,
  },
  docName: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  docSpec: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  docActionDesc: {
    fontSize: 13,
    fontFamily: 'Lexend',
    color: '#54433b',
    lineHeight: 18,
    marginBottom: 16,
  },
  docBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  docCallBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(149, 73, 33, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docCallText: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
  docBookBtn: {
    flex: 1.2,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docBookText: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
  },
  historyBtn: {
    flex: 1.2,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyBtnText: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
  finishBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishBtnText: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
});
