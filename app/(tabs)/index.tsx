import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Datos de ejemplo con imágenes reales de One Piece
const MANGAS = [
  {
    id: 1,
    title: 'One Piece',
    imageUri: 'https://cdn.myanimelist.net/images/manga/2/253146.jpg',
    progress: 75,
    chapters: 1089,
    rating: 4.8,
    status: 'En emisión'
  },
  {
    id: 2,
    title: 'Naruto',
    imageUri: 'https://cdn.myanimelist.net/images/manga/3/117051.jpg',
    progress: 100,
    chapters: 700,
    rating: 4.9,
    status: 'Completado'
  },
  {
    id: 3,
    title: 'Jujutsu Kaisen',
    imageUri: 'https://cdn.myanimelist.net/images/manga/3/222287.jpg',
    progress: 30,
    chapters: 200,
    rating: 4.7,
    status: 'En emisión'
  },
  {
    id: 4,
    title: 'Dragon Ball Super',
    imageUri: 'https://cdn.myanimelist.net/images/manga/2/214853.jpg',
    progress: 45,
    chapters: 150,
    rating: 4.6,
    status: 'En emisión'
  },
  {
    id: 5,
    title: 'Attack on Titan',
    imageUri: 'https://cdn.myanimelist.net/images/manga/2/185533.jpg',
    progress: 90,
    chapters: 139,
    rating: 4.9,
    status: 'Finalizado'
  }
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCardPress = (manga: typeof MANGAS[0]) => {
    console.log(`Abriendo detalles de ${manga.title}`);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const filteredMangas = MANGAS.filter(manga =>
    manga.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: MANGAS.length,
    reading: MANGAS.filter(m => m.progress < 100).length,
    completed: MANGAS.filter(m => m.progress === 100).length
  };

  return (
    <View style={styles.container}>
      {/* Header personalizado */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Bienvenido!</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications-outline" size={24} color="#FF4500" />
        </View>
      </View>

      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar mangas..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Estadísticas rápidas */}
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
          <Text style={styles.statLabel}>Completados</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Sección de continuación */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continuar leyendo</Text>
            <Text style={styles.seeAll}>Ver todos</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {filteredMangas.slice(0, 3).map((manga) => (
              <TouchableOpacity 
                key={manga.id} 
                style={styles.horizontalCard}
                onPress={() => handleCardPress(manga)}
                activeOpacity={0.7}
              >
                <Image 
                  source={{ uri: manga.imageUri }} 
                  style={styles.horizontalImage}
                  onError={() => console.log(`Error cargando imagen de ${manga.title}`)}
                />
                <View style={styles.horizontalInfo}>
                  <Text style={styles.horizontalTitle} numberOfLines={2}>{manga.title}</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${manga.progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{manga.progress}%</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sección de populares */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mangas Populares</Text>
            <Text style={styles.seeAll}>Ver todos</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Los más leídos de la semana</Text>
          
          {filteredMangas.map((manga) => (
            <TouchableOpacity 
              key={manga.id} 
              style={styles.card}
              onPress={() => handleCardPress(manga)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: manga.imageUri }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{manga.title}</Text>
                
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.detailText}>{manga.rating.toFixed(1)}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="book-outline" size={14} color="#888" />
                    <Text style={styles.detailText}>{manga.chapters} caps</Text>
                  </View>
                  <View style={[styles.statusBadge, 
                    manga.status === 'Completado' ? styles.statusCompleted : 
                    manga.status === 'Finalizado' ? styles.statusFinished : 
                    styles.statusOngoing
                  ]}>
                    <Text style={styles.statusText}>{manga.status}</Text>
                  </View>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${manga.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{manga.progress}%</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#FF4500" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#FF4500',
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  horizontalCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  horizontalImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  horizontalInfo: {
    padding: 10,
  },
  horizontalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  cardImage: {
    width: 60,
    height: 90,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusFinished: {
    backgroundColor: '#9C27B0',
  },
  statusOngoing: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF4500',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#FF4500',
    fontWeight: '600',
    minWidth: 40,
  },
  bottomSpace: {
    height: 20,
  },
});