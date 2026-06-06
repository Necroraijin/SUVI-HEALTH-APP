import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuvi, ScannedDocument } from '@/context/SuviStateContext';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassCard } from '@/components/ui/GlassCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';

const CATEGORY_MAP: Record<string, { label: string; icon: string; color: string }> = {
  all: { label: 'All Docs', icon: '📁', color: '#954921' },
  'lab-report': { label: 'Lab Reports', icon: '📊', color: '#00696f' },
  prescription: { label: 'Prescriptions', icon: '💊', color: '#ff9d6e' },
  imaging: { label: 'Imaging / X-Ray', icon: '🩻', color: '#855cf8' },
  'visit-notes': { label: 'Visit Notes', icon: '📝', color: '#00dbe7' },
};

export default function HealthVaultScreen() {
  const router = useRouter();
  const { state, removeDocument } = useSuvi();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<ScannedDocument | null>(null);

  // Filter documents based on search query and selected category
  const filteredDocs = state.documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    removeDocument(id);
    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
    }
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ScreenHeader 
          title="Health Vault" 
          onBack={() => router.push('/(tabs)')}
          rightAction={
            <TouchableOpacity 
              style={styles.headerScanBtn} 
              onPress={() => router.push('/(screens)/document-scanner')}
              activeOpacity={0.7}
            >
              <Text style={styles.headerScanText}>📸 Scan</Text>
            </TouchableOpacity>
          }
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <GlassCard style={styles.searchCard}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search reports, meds, summaries..."
              placeholderTextColor="#87736a"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </GlassCard>
        </View>

        {/* Category Filter Chips */}
        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {Object.keys(CATEGORY_MAP).map((key) => {
              const item = CATEGORY_MAP[key];
              const isActive = selectedCategory === key;
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => setSelectedCategory(key)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.chipIcon}>{item.icon}</Text>
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Document List */}
        <FlatList
          data={filteredDocs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📁</Text>
              <Text style={styles.emptyTitle}>No documents found</Text>
              <Text style={styles.emptySubtitle}>
                Upload or scan prescriptions, blood reports, or checkup notes to have Suvi analyze them.
              </Text>
              <TouchableOpacity 
                style={styles.emptyScanBtn}
                onPress={() => router.push('/(screens)/document-scanner')}
              >
                <Text style={styles.emptyScanText}>Scan Document Now</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => {
            const catInfo = CATEGORY_MAP[item.category] || CATEGORY_MAP['visit-notes'];
            return (
              <GlassCard style={styles.docCard}>
                <TouchableOpacity 
                  style={styles.docCardMain} 
                  onPress={() => setSelectedDoc(selectedDoc?.id === item.id ? null : item)}
                  activeOpacity={0.9}
                >
                  <View style={[styles.docIconBox, { backgroundColor: catInfo.color + '15' }]}>
                    <Text style={styles.docIcon}>{catInfo.icon}</Text>
                  </View>
                  <View style={styles.docInfo}>
                    <Text style={styles.docTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.docDate}>
                      {new Date(item.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })} • {catInfo.label}
                    </Text>
                  </View>
                  <Text style={styles.expandArrow}>{selectedDoc?.id === item.id ? '▼' : '▶'}</Text>
                </TouchableOpacity>

                {/* Expanded AI Insights */}
                {selectedDoc?.id === item.id && (
                  <View style={styles.docDetails}>
                    <View style={styles.divider} />
                    
                    <Text style={styles.sectionLabel}>AI Summary & Findings</Text>
                    <Text style={styles.summaryText}>{item.summary}</Text>

                    {item.extractedMeds && item.extractedMeds.length > 0 && (
                      <View style={styles.medsSection}>
                        <Text style={styles.sectionLabel}>Extracted Medications</Text>
                        <View style={styles.medTags}>
                          {item.extractedMeds.map((med, idx) => (
                            <View key={idx} style={styles.medTag}>
                              <Text style={styles.medTagIcon}>💊</Text>
                              <Text style={styles.medTagText}>{med}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}

                    <View style={styles.actionsRow}>
                      <TouchableOpacity 
                        style={styles.actionBtnDiscuss}
                        onPress={() => router.push('/(tabs)/suvi-chat')}
                      >
                        <Text style={styles.actionDiscussText}>💬 Discuss with Suvi</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={styles.actionBtnDelete}
                        onPress={() => handleDelete(item.id)}
                      >
                        <Text style={styles.actionDeleteText}>🗑️ Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </GlassCard>
            );
          }}
        />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerScanBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  headerScanText: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#221a16',
  },
  clearIcon: {
    fontSize: 16,
    color: '#87736a',
    paddingHorizontal: 8,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryScroll: {
    paddingHorizontal: 24,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    gap: 6,
  },
  chipActive: {
    backgroundColor: '#954921',
    borderColor: '#954921',
  },
  chipIcon: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: '#221a16',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  docCard: {
    padding: 14,
    overflow: 'hidden',
  },
  docCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docIcon: {
    fontSize: 22,
  },
  docInfo: {
    flex: 1,
    gap: 2,
  },
  docTitle: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
  },
  docDate: {
    fontSize: 12,
    fontFamily: 'Lexend',
    color: '#87736a',
  },
  expandArrow: {
    fontSize: 12,
    color: '#87736a',
    paddingHorizontal: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(149, 73, 33, 0.1)',
    marginVertical: 12,
  },
  docDetails: {
    paddingTop: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 6,
  },
  summaryText: {
    fontSize: 13,
    fontFamily: 'Lexend',
    color: '#54433b',
    lineHeight: 18,
    marginBottom: 12,
  },
  medsSection: {
    marginBottom: 12,
  },
  medTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  medTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  medTagIcon: {
    fontSize: 12,
  },
  medTagText: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: '#221a16',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtnDiscuss: {
    flex: 2,
    height: 40,
    backgroundColor: 'rgba(149, 73, 33, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(149, 73, 33, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionDiscussText: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#954921',
  },
  actionBtnDelete: {
    flex: 1,
    height: 40,
    backgroundColor: 'rgba(186, 26, 26, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(186, 26, 26, 0.15)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionDeleteText: {
    fontSize: 12,
    fontFamily: 'Lexend-SemiBold',
    color: '#ba1a1a',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.6,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Lexend-SemiBold',
    color: '#221a16',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Lexend',
    color: '#87736a',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyScanBtn: {
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#954921',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#954921',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyScanText: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: '#ffffff',
  },
});
