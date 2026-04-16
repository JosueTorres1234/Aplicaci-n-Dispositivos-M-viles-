import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Image, Dimensions, ActivityIndicator, TextInput, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ExploreScreen() {
  const [mangas, setMangas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedManga, setSelectedManga] = useState<any>(null); // Para guardar el manga clicado

  useEffect(() => {
    fetchMangas();
  }, []);

  const fetchMangas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "mangas"));
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMangas(docs);
    } catch (error) {
      console.error("Error explorando:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Descubre nuevos mangas</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput placeholder="Buscar..." placeholderTextColor="#8E8E93" style={styles.searchInput} />
        </View>
      </View>

      <FlatList
        data={mangas}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.gridCard} 
            onPress={() => setSelectedManga(item)} // Al dar click, guardamos el manga
          >
            <Image source={{ uri: item.Imagen }} style={styles.gridImg} />
            <View style={styles.cardInfo}>
              <Text style={styles.mangaTitle} numberOfLines={1}>{item.Titulo}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* VENTANA EMERGENTE (MODAL) */}
      <Modal
        visible={!!selectedManga}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedManga(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedManga(null)}>
              <Ionicons name="close-circle" size={35} color="white" />
            </TouchableOpacity>

            <ScrollView>
              <Image source={{ uri: selectedManga?.Imagen }} style={styles.modalImg} />
              <View style={styles.modalPadding}>
                <Text style={styles.modalTitle}>{selectedManga?.Titulo}</Text>
                
                <View style={styles.statsRow}>
                  <View style={styles.statBadge}>
                    <Text style={styles.statText}>{selectedManga?.Capitulos || '?' } Capítulos</Text>
                  </View>
                </View>

                <Text style={styles.sinopsisTitle}>Sinopsis</Text>
                <Text style={styles.sinopsisText}>
                  {selectedManga?.Sinopsis || "No hay sinopsis disponible para este manga todavía."}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingTop: 60, paddingHorizontal: 20, marginBottom: 10 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  searchBar: { flexDirection: 'row', backgroundColor: '#1C1C1E', padding: 12, borderRadius: 10, alignItems: 'center' },
  searchInput: { color: 'white', marginLeft: 10, flex: 1 },
  listContent: { paddingHorizontal: 10, paddingBottom: 20 },
  gridCard: { width: (width / 2) - 20, margin: 10, backgroundColor: '#1C1C1E', borderRadius: 12, overflow: 'hidden' },
  gridImg: { width: '100%', height: 220 },
  cardInfo: { padding: 8 },
  mangaTitle: { color: 'white', fontSize: 14, fontWeight: '600' },
  // ESTILOS DEL MODAL
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#161618', height: height * 0.8, borderTopLeftRadius: 25, borderTopRightRadius: 25, overflow: 'hidden' },
  closeButton: { position: 'absolute', top: 20, right: 20, zIndex: 10 },
  modalImg: { width: '100%', height: 250, resizeMode: 'cover' },
  modalPadding: { padding: 20 },
  modalTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', marginTop: 10 },
  statBadge: { backgroundColor: '#6C5CE7', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  statText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  sinopsisTitle: { color: '#8E8E93', fontSize: 16, fontWeight: 'bold', marginTop: 25, marginBottom: 10 },
  sinopsisText: { color: '#D1D1D1', fontSize: 15, lineHeight: 22 },
});