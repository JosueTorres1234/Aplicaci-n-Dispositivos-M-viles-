import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Image, RefreshControl, SafeAreaView, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';

// Importaciones de Firebase
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ajustado a tu estructura

// 1. Interfaz de datos
interface Manga {
  id: string;
  titulo: string;
  imagen: string;
  progreso: number;
  status?: string;
}

const COLORS = {
  background: '#121212',
  cardBg: '#1E1E1E',
  accent: '#FF4500',
  textMain: '#FFFFFF',
  textSec: '#AAAAAA',
  border: '#333333'
};

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mangas, setMangas] = useState<Manga[]>([]);

  // 2. Lógica de conexión real a Firebase
  useEffect(() => {
    console.log("Conectando a Firebase...");
    const unsub = onSnapshot(collection(db, 'mangas'), (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const fData = doc.data();
        
        // MAPEADO CRÍTICO: Firebase (Mayúscula) -> Código (minúscula)
        return {
          id: doc.id,
          titulo: fData.Titulo || 'Sin título',   //
          imagen: fData.Imagen || 'https://via.placeholder.com/150', //
          progreso: Number(fData.Progreso) || 0, //
          status: fData.Status || 'En emisión'
        } as Manga;
      });
      
      console.log("Mangas cargados:", data.length);
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
    reading: mangas.filter(m => m.progreso < 100).length,
    completed: mangas.filter(m => m.progreso === 100).length
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Tachiyomi</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>
        <TouchableOpacity style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textSec} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar en mi biblioteca..."
          placeholderTextColor={COLORS.textSec}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />
        }
      >
        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.reading}</Text>
            <Text style={styles.statLabel}>Leyendo</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Listo</Text>
          </View>
        </View>

        {/* Sección Horizontal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continuar leyendo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {filteredMangas.map((manga) => (
              <TouchableOpacity key={manga.id} style={styles.horizontalCard} activeOpacity={0.8}>
                <Image 
                  source={{ uri: manga.imagen }} 
                  style={styles.horizontalImage} 
                  resizeMode="cover" // Importante para que se vea la imagen
                />
                <View style={styles.horizontalInfo}>
                  <Text style={styles.horizontalTitle} numberOfLines={1}>{manga.titulo}</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${manga.progreso}%` }]} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sección Vertical */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Biblioteca</Text>
          {filteredMangas.map((manga) => (
            <TouchableOpacity key={manga.id} style={styles.card} activeOpacity={0.7}>
              <Image 
                source={{ uri: manga.imagen }} 
                style={styles.cardImage} 
                resizeMode="cover"
              />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{manga.titulo}</Text>
                <Text style={styles.cardSub}>{manga.status}</Text>
                <View style={styles.progressRow}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${manga.progreso}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{manga.progreso}%</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.accent} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: COLORS.accent },
  date: { fontSize: 14, color: COLORS.textSec, textTransform: 'capitalize' },
  headerIcons: { backgroundColor: COLORS.cardBg, padding: 10, borderRadius: 12 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBg, marginHorizontal: 20, paddingHorizontal: 15, borderRadius: 12, marginBottom: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 12, color: COLORS.textMain, fontSize: 16 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 25 },
  statCard: { backgroundColor: COLORS.cardBg, padding: 15, borderRadius: 15, alignItems: 'center', width: '30%', borderWidth: 1, borderColor: COLORS.border },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: COLORS.textMain },
  statLabel: { fontSize: 11, color: COLORS.textSec, marginTop: 4, textTransform: 'uppercase' },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain, marginLeft: 20, marginBottom: 15 },
  horizontalScroll: { paddingLeft: 20 },
  horizontalCard: { width: 140, marginRight: 15, backgroundColor: COLORS.cardBg, borderRadius: 15, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  horizontalImage: { width: '100%', height: 190, backgroundColor: '#333' }, // Fondo gris mientras carga
  horizontalInfo: { padding: 10 },
  horizontalTitle: { color: COLORS.textMain, fontWeight: 'bold', fontSize: 13, marginBottom: 8 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBg, marginHorizontal: 20, marginBottom: 12, padding: 10, borderRadius: 15, borderWidth: 1, borderColor: COLORS.border },
  cardImage: { width: 60, height: 80, borderRadius: 10, backgroundColor: '#333' },
  cardInfo: { flex: 1, marginLeft: 15, marginRight: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
  cardSub: { fontSize: 12, color: COLORS.accent, marginTop: 2, marginBottom: 8 },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  progressBar: { flex: 1, height: 4, backgroundColor: COLORS.border, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 2 },
  progressText: { fontSize: 11, color: COLORS.textSec, marginLeft: 8 },
});