import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';

const { width, height } = Dimensions.get('window');

export default function DocumentScannerScreen() {
  const router = useRouter();
  const [hasCapture, setHasCapture] = useState(false);

  const handleCapture = () => {
    setHasCapture(true);
  };

  const handleSendToAI = () => {
    router.push('/(screens)/ai-processing');
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Document Scanner</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Camera Viewfinder Area */}
        <View style={styles.viewfinderContainer}>
          <View style={styles.viewfinder}>
            {/* Corner guides */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />

            {/* Center content */}
            {!hasCapture ? (
              <View style={styles.scanPrompt}>
                <Text style={styles.scanIcon}>📄</Text>
                <Text style={styles.scanTitle}>Position Document</Text>
                <Text style={styles.scanDesc}>
                  Align your medical report, prescription, or lab result within the frame
                </Text>
              </View>
            ) : (
              <View style={styles.capturedOverlay}>
                <Text style={styles.capturedIcon}>✅</Text>
                <Text style={styles.capturedTitle}>Document Captured</Text>
                <Text style={styles.capturedDesc}>
                  Clear scan detected. Ready for AI analysis.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Document Type Chips */}
        <View style={styles.chipRow}>
          {['Lab Report', 'Prescription', 'Imaging', 'Visit Notes'].map((type, idx) => (
            <TouchableOpacity key={type} style={[styles.chip, idx === 0 && styles.chipActive]}>
              <Text style={[styles.chipText, idx === 0 && styles.chipTextActive]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!hasCapture ? (
            <>
              <TouchableOpacity style={styles.galleryBtn}>
                <Text style={styles.galleryIcon}>🖼️</Text>
                <Text style={styles.galleryLabel}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} activeOpacity={0.8}>
                <View style={styles.captureInner}>
                  <View style={styles.captureCore} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.galleryBtn}>
                <Text style={styles.galleryIcon}>⚡</Text>
                <Text style={styles.galleryLabel}>Flash</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.reviewControls}>
              <TouchableOpacity
                style={styles.retakeBtn}
                onPress={() => setHasCapture(false)}
              >
                <Text style={styles.retakeText}>↻ Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleSendToAI}
                activeOpacity={0.8}
              >
                <Text style={styles.sendText}>Send to Suvi AI →</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 44,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)',
  },
  backIcon: { fontSize: 20, color: '#954921', fontFamily: 'Lexend-Bold' },
  headerTitle: { fontSize: 18, fontFamily: 'Lexend-SemiBold', color: '#954921' },
  placeholder: { width: 40 },

  viewfinderContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  viewfinder: {
    flex: 1,
    maxHeight: height * 0.45,
    borderRadius: 24,
    backgroundColor: 'rgba(34, 26, 22, 0.06)',
    borderWidth: 2,
    borderColor: 'rgba(149, 73, 33, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 32, height: 32,
    borderColor: '#954921',
  },
  topLeft: {
    top: 16, left: 16,
    borderTopWidth: 3, borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 16, right: 16,
    borderTopWidth: 3, borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 16, left: 16,
    borderBottomWidth: 3, borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 16, right: 16,
    borderBottomWidth: 3, borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  scanPrompt: {
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 8,
  },
  scanIcon: { fontSize: 48 },
  scanTitle: {
    fontSize: 18, fontFamily: 'Lexend-SemiBold', color: '#221a16',
  },
  scanDesc: {
    fontSize: 14, fontFamily: 'Lexend', color: '#87736a',
    textAlign: 'center', lineHeight: 20,
  },
  capturedOverlay: {
    alignItems: 'center', gap: 8,
  },
  capturedIcon: { fontSize: 48 },
  capturedTitle: {
    fontSize: 18, fontFamily: 'Lexend-SemiBold', color: '#00696f',
  },
  capturedDesc: {
    fontSize: 14, fontFamily: 'Lexend', color: '#54433b',
    textAlign: 'center', paddingHorizontal: 40,
  },

  chipRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.5)',
  },
  chipActive: {
    backgroundColor: '#954921',
    borderColor: '#954921',
  },
  chipText: {
    fontSize: 12, fontFamily: 'Lexend-Medium', color: '#221a16',
  },
  chipTextActive: {
    color: '#ffffff',
  },

  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    gap: 40,
  },
  galleryBtn: {
    alignItems: 'center', gap: 4,
  },
  galleryIcon: { fontSize: 24 },
  galleryLabel: {
    fontSize: 10, fontFamily: 'Lexend-Medium', color: '#87736a',
    textTransform: 'uppercase',
  },
  captureBtn: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: '#954921',
  },
  captureInner: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center', alignItems: 'center',
  },
  captureCore: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#954921',
  },
  reviewControls: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
  },
  retakeBtn: {
    flex: 1, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1, borderColor: 'rgba(149,73,33,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  retakeText: {
    fontSize: 15, fontFamily: 'Lexend-SemiBold', color: '#954921',
  },
  sendBtn: {
    flex: 2, height: 56, borderRadius: 28,
    backgroundColor: '#954921',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#954921', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  sendText: {
    fontSize: 15, fontFamily: 'Lexend-SemiBold', color: '#ffffff',
  },
});
