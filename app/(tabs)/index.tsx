import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Image, RefreshControl, SafeAreaView, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions
} from 'react-native';

// Importaciones de Firebase
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Asegúrate que esta ruta sea correcta

const { width } = Dimensions.get('window');

// 1. Interfaz de datos profesional
interface Manga {
  id: string;
  titulo: string;
  imagen: string;
  progreso: number;
  status?: string;
  descripcion?: string;
}

const COLORS = {
  background: '#0B0B0C',
  surface: '#161618',
  accent: '#FF4500', // Naranja Tachiyomi
  textMain: '#FFFFFF',
  textSec: '#8E8E93',
  border: '#2C2C2E'
};

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mangas, setMangas] = useState<Manga[]>([]);

  // 2. Lógica de conexión real a Firebase
  useEffect(() => {
    const q = query(collection(db, 'mangas'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const fData = doc.data();
        return {
          id: doc.id,
          titulo: fData.Titulo || 'Sin título',
          imagen: fData.Imagen || '',
          progreso: Number(fData.Progreso) || 0,
          status: fData.Status || 'Manga',
          descripcion: fData.Descripcion || 'Sin descripción disponible.'
        } as Manga;
      });
      setMangas(data);
    });

    return () => unsub();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filteredMangas = mangas.filter(manga =>
    manga.titulo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: mangas.length,
    reading: mangas.filter(m => m.progreso > 0 && m.progreso < 100).length,
    completed: mangas.filter(m => m.progreso === 100).length
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Premium */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandText}>TACHIYOMI</Text>
          <Text style={styles.greeting}>Hola, Josué</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle" size={36} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
      >
        {/* Buscador Estilizado */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={COLORS.textSec} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar mangas..."
            placeholderTextColor={COLORS.textSec}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Banner Destacado (Tipo Crunchyroll) */}
        {!searchQuery && mangas.length > 0 && (
          <View style={styles.featuredBox}>
            <Image source={{ uri: mangas[0].imagen }} style={styles.featuredImage} />
            <View style={styles.featuredOverlay}>
              <View style={styles.tag}><Text style={styles.tagText}>POPULAR</Text></View>
              <Text style={styles.featuredTitle}>{mangas[0].titulo}</Text>
              <TouchableOpacity style={styles.playButton}>
                <Ionicons name="play" size={18} color="white" />
                <Text style={styles.playButtonText}>Empezar a leer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Estadísticas Rápidas */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.total}</Text>
            <Text style={styles.statLab}>Mangas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{stats.reading}</Text>
            <Text style={styles.statLab}>Leyendo</Text>
          </View>
          <View style={[styles.statItem, { borderRightWidth: 0 }]}>
            <Text style={styles.statNum}>{stats.completed}</Text>
            <Text style={styles.statLab}>Listos</Text>
          </View>
        </View>

        {/* Sección Horizontal: Continuar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continuar Leyendo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20 }}>
            {filteredMangas.map((manga) => (
              <TouchableOpacity key={manga.id} style={styles.hCard}>
                <View style={styles.hImageContainer}>
                  <Image source={{ uri: manga.imagen }} style={styles.hImage} />
                  <View style={styles.hProgressContainer}>
                    <View style={[styles.hProgressFill, { width: `${manga.progreso}%` }]} />
                  </View>
                </View>
                <Text style={styles.hTitle} numberOfLines={1}>{manga.titulo}</Text>
                <Text style={styles.hSub}>Cap. {manga.progreso}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sección Vertical: Biblioteca Completa */}
        <View style={[styles.section, { paddingHorizontal: 20 }]}>
          <Text style={styles.sectionTitle}>Mi Biblioteca</Text>
          {filteredMangas.map((manga) => (
            <TouchableOpacity key={manga.id} style={styles.vCard}>
              <Image source={{ uri: manga.imagen }} style={styles.vImage} />
              <View style={styles.vInfo}>
                <Text style={styles.vTitle}>{manga.titulo}</Text>
                <Text style={styles.vStatus}>{manga.status}</Text>
                <View style={styles.vProgressBox}>
                  <View style={styles.vBar}><View style={[styles.vFill, { width: `${manga.progreso}%` }]} /></View>
                  <Text style={styles.vPercent}>{manga.progreso}%</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  brandText: { color: COLORS.accent, fontSize: 10, fontWeight: 'bold', letterSpacing: 3 },
  greeting: { fontSize: 26, fontWeight: 'bold', color: COLORS.textMain },
  profileButton: { padding: 4 },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, marginHorizontal: 20, paddingHorizontal: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, paddingVertical: 12, color: COLORS.textMain, marginLeft: 10 },

  featuredBox: { marginHorizontal: 20, height: 220, borderRadius: 20, overflow: 'hidden', marginBottom: 25 },
  featuredImage: { width: '100%', height: '100%', opacity: 0.6 },
  featuredOverlay: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  tag: { backgroundColor: COLORS.accent, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 8 },
  tagText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  featuredTitle: { color: 'white', fontSize: 28, fontWeight: 'bold', marginBottom: 12 },
  playButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  playButtonText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },

  statsRow: { flexDirection: 'row', backgroundColor: COLORS.surface, marginHorizontal: 20, borderRadius: 15, padding: 15, marginBottom: 25, borderWidth: 1, borderColor: COLORS.border },
  statItem: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: COLORS.border },
  statNum: { color: COLORS.textMain, fontSize: 18, fontWeight: 'bold' },
  statLab: { color: COLORS.textSec, fontSize: 10, textTransform: 'uppercase', marginTop: 2 },

  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 15, marginLeft: 20 },

  hCard: { width: 150, marginRight: 18 },
  hImageContainer: { height: 210, borderRadius: 15, overflow: 'hidden', backgroundColor: COLORS.surface },
  hImage: { width: '100%', height: '100%' },
  hProgressContainer: { position: 'absolute', bottom: 0, width: '100%', height: 4, backgroundColor: 'rgba(0,0,0,0.5)' },
  hProgressFill: { height: '100%', backgroundColor: COLORS.accent },
  hTitle: { color: COLORS.textMain, fontWeight: '600', marginTop: 10, fontSize: 14 },
  hSub: { color: COLORS.textSec, fontSize: 12, marginTop: 2 },

  vCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, padding: 12, borderRadius: 18, marginBottom: 12 },
  vImage: { width: 70, height: 90, borderRadius: 12, backgroundColor: COLORS.background },
  vInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  vTitle: { color: COLORS.textMain, fontSize: 16, fontWeight: 'bold' },
  vStatus: { color: COLORS.accent, fontSize: 12, marginVertical: 4 },
  vProgressBox: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  vBar: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2 },
  vFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 2 },
  vPercent: { color: COLORS.textSec, fontSize: 10, marginLeft: 10 }
});