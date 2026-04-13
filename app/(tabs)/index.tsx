import React, { useState, useEffect } from 'react';
import { 
  View, StyleSheet, ActivityIndicator, TouchableOpacity, 
  Text, ScrollView, Image, FlatList, Dimensions, StatusBar, Modal, Switch 
} from 'react-native'; 
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'; 
import { auth, db } from '../firebaseConfig'; 
import Login from '../../components/ui/Login';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mangasDB, setMangasDB] = useState<any[]>([]); 
  const [selectedManga, setSelectedManga] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [viewMode, setViewMode] = useState<'home' | 'fav' | 'hist'>('home');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchMangas = async () => {
      if (!user) return;
      try {
        const querySnapshot = await getDocs(collection(db, "mangas"));
        const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMangasDB(docs);
      } catch (error) { console.error("Error Firebase:", error); } 
      finally { setLoading(false); }
    };
    fetchMangas();
  }, [user]);

  const toggleFavorite = async (manga: any) => {
    try {
      const mangaRef = doc(db, "mangas", manga.id);
      const nuevoEstado = !manga.Favorito;
      await updateDoc(mangaRef, { Favorito: nuevoEstado });
      setMangasDB(prev => prev.map(m => m.id === manga.id ? {...m, Favorito: nuevoEstado} : m));
      if(selectedManga?.id === manga.id) setSelectedManga({...selectedManga, Favorito: nuevoEstado});
    } catch (e) { console.log("Error favorito", e); }
  };

  const handleLogout = async () => { 
    try { await signOut(auth); setMenuVisible(false); } catch (e) { console.log(e); } 
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#6C5CE7" /></View>;
  if (!user) return <Login onGoogleLogin={async () => await signInWithPopup(auth, new GoogleAuthProvider())} onLogin={() => {}} />;

  // --- VISTA DE LISTA (FAVORITOS / HISTORIAL) ---
  const renderMangaList = (data: any[], title: string) => (
    <View style={styles.fullListView}>
      <TouchableOpacity style={styles.backBtnInline} onPress={() => setViewMode('home')}>
        <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} />
        <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : 'black', marginTop: 0, marginLeft: 15 }]}>{title}</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.gridCard} onPress={() => {setSelectedManga(item); setViewMode('home');}}>
            <Image source={{ uri: item.Imagen }} style={styles.gridImage} />
            <Text style={[styles.cardTitle, { color: isDarkMode ? 'white' : 'black' }]} numberOfLines={1}>{item.Titulo}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  // --- VISTA DE DETALLE / SINOPSIS ---
  if (selectedManga) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#FFF' }]}>
        <ScrollView>
          <View style={styles.detailHero}>
            <Image source={{ uri: selectedManga.Banner || selectedManga.Imagen }} style={styles.detailImage} />
            <LinearGradient colors={['transparent', isDarkMode ? '#000' : '#FFF']} style={styles.heroGradient} />
            <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedManga(null)}>
              <Ionicons name="chevron-back" size={30} color={isDarkMode ? "white" : "black"} />
            </TouchableOpacity>
          </View>
          <View style={styles.padding20}>
            <View style={styles.detailHeaderRow}>
                <Text style={[styles.detailTitle, { color: isDarkMode ? 'white' : 'black' }]}>{selectedManga.Titulo}</Text>
                <TouchableOpacity onPress={() => toggleFavorite(selectedManga)}>
                    <Ionicons name={selectedManga.Favorito ? "heart" : "heart-outline"} size={35} color={selectedManga.Favorito ? "#FF4757" : "#8E8E93"} />
                </TouchableOpacity>
            </View>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : 'black', marginTop: 10 }]}>Sinopsis</Text>
            <Text style={[styles.synopsisText, { color: isDarkMode ? '#ccc' : '#444' }]}>{selectedManga.Sinopsis || "Sin sinopsis disponible."}</Text>
            <TouchableOpacity style={styles.readNowBtn}><Text style={styles.readNowText}>CONTINUAR LECTURA</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#F5F5F7' }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* HEADER PRINCIPAL */}
      <View style={styles.customHeader}>
        <Text style={[styles.logoText, { color: isDarkMode ? 'white' : 'black' }]}>Tachiyomi<Text style={{color:'#6C5CE7'}}>App</Text></Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {viewMode === 'fav' ? renderMangaList(mangasDB.filter(m => m.Favorito), "Mis Favoritos") :
       viewMode === 'hist' ? renderMangaList(mangasDB.filter(m => m.Progreso > 0), "Historial") : (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* TENDENCIA */}
          {mangasDB.length > 0 && (
            <TouchableOpacity style={styles.hero} onPress={() => setSelectedManga(mangasDB[0])}>
              <Image source={{ uri: mangasDB[0].Banner || mangasDB[0].Imagen }} style={styles.heroImage} />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.heroGradient} />
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>{mangasDB[0].Titulo}</Text>
                <View style={styles.heroBtn}><Text style={styles.heroBtnText}>VER AHORA</Text></View>
              </View>
            </TouchableOpacity>
          )}

          <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : 'black', marginLeft: 20 }]}>Continuar leyendo</Text>
          <FlatList
            horizontal
            data={mangasDB.filter(m => m.Progreso > 0)}
            keyExtractor={(item) => `hist-${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.continueCard} onPress={() => setSelectedManga(item)}>
                <Image source={{ uri: item.Imagen }} style={styles.continueImage} />
                <View style={styles.miniProgress}><View style={[styles.miniBar, { width: `${item.Progreso}%` }]} /></View>
                <Text style={[styles.cardTitle, { color: isDarkMode ? 'white' : 'black' }]} numberOfLines={1}>{item.Titulo}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingLeft: 20 }}
          />

          <Text style={[styles.sectionTitle, { color: isDarkMode ? 'white' : 'black', marginLeft: 20 }]}>Todo el catálogo</Text>
          <FlatList
            horizontal
            data={mangasDB}
            keyExtractor={(item) => `all-${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.stdCard} onPress={() => setSelectedManga(item)}>
                <Image source={{ uri: item.Imagen }} style={styles.stdImage} />
                <Text style={[styles.cardTitle, { color: isDarkMode ? 'white' : 'black' }]} numberOfLines={1}>{item.Titulo}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingLeft: 20 }}
          />
        </ScrollView>
      )}

      {/* MODAL CONFIGURACIÓN (Estilo Crunchyroll) */}
      <Modal visible={menuVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalCloseArea} activeOpacity={1} onPress={() => setMenuVisible(false)} />
          
          <View style={[styles.sideMenu, { backgroundColor: isDarkMode ? '#111' : '#FFF' }]}>
            <View style={styles.profileHeader}>
              <Image source={{ uri: user.photoURL }} style={styles.menuAvatar} />
              <View>
                <Text style={[styles.menuNameText, { color: isDarkMode ? 'white' : 'black' }]}>{user.displayName || "Usuario"}</Text>
                <View style={styles.premiumBadge}>
                  <Ionicons name="star" size={10} color="#FFB900" />
                  <Text style={styles.premiumText}> Miembro Premium</Text>
                </View>
              </View>
            </View>

            <View style={styles.menuDivider} />

            <TouchableOpacity style={styles.menuItemRow} onPress={() => {setViewMode('fav'); setMenuVisible(false);}}>
              <Ionicons name="bookmark-outline" size={24} color={isDarkMode ? "#CCC" : "#666"} />
              <Text style={[styles.menuLabel, { color: isDarkMode ? 'white' : 'black' }]}>Favoritos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItemRow} onPress={() => {setViewMode('hist'); setMenuVisible(false);}}>
              <Ionicons name="time-outline" size={24} color={isDarkMode ? "#CCC" : "#666"} />
              <Text style={[styles.menuLabel, { color: isDarkMode ? 'white' : 'black' }]}>Historial</Text>
            </TouchableOpacity>

            <View style={styles.menuDivider} />

            <View style={styles.menuItemRow}>
              <Ionicons name={isDarkMode ? "moon-outline" : "sunny-outline"} size={24} color={isDarkMode ? "#CCC" : "#666"} />
              <Text style={[styles.menuLabel, { color: isDarkMode ? 'white' : 'black', flex: 1 }]}>Modo Oscuro</Text>
              <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
            </View>

            <TouchableOpacity style={styles.menuLogoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#FF4757" />
              <Text style={styles.logoutText}>Desconectar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  customHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15 },
  logoText: { fontSize: 22, fontWeight: '900' },
  avatar: { width: 35, height: 35, borderRadius: 10 },
  hero: { width: width - 40, height: 210, alignSelf: 'center', borderRadius: 20, overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroGradient: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  heroText: { position: 'absolute', bottom: 20, left: 20 },
  heroTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  heroBtn: { backgroundColor: 'white', padding: 8, borderRadius: 5, marginTop: 10, alignSelf: 'flex-start' },
  heroBtnText: { fontWeight: 'bold', fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 15 },
  continueCard: { marginRight: 15, width: 150 },
  continueImage: { width: 150, height: 85, borderRadius: 10 },
  miniProgress: { height: 3, backgroundColor: '#333', marginTop: 5 },
  miniBar: { height: '100%', backgroundColor: '#6C5CE7' },
  stdCard: { marginRight: 15, width: 110 },
  stdImage: { width: 110, height: 160, borderRadius: 10 },
  cardTitle: { marginTop: 8, fontSize: 12, fontWeight: '600' },
  // Detalle
  detailHero: { width: '100%', height: 350 },
  detailImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 15, padding: 5, zIndex: 10 },
  padding20: { paddingHorizontal: 20 },
  detailHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -20 },
  detailTitle: { fontSize: 28, fontWeight: 'bold', flex: 1, marginRight: 10 },
  synopsisText: { lineHeight: 22, marginTop: 10, fontSize: 15 },
  readNowBtn: { backgroundColor: '#6C5CE7', padding: 15, borderRadius: 15, marginTop: 30, alignItems: 'center' },
  readNowText: { color: 'white', fontWeight: 'bold' },
  // Modal Lateral
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', flexDirection: 'row' },
  modalCloseArea: { flex: 1 },
  sideMenu: { width: 280, height: '100%', paddingHorizontal: 20, paddingTop: 60 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  menuAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  menuNameText: { fontSize: 18, fontWeight: 'bold' },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  premiumText: { color: '#FFB900', fontSize: 12, fontWeight: '600' },
  menuDivider: { height: 1, backgroundColor: '#333', marginVertical: 20, opacity: 0.5 },
  menuItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
  menuLabel: { marginLeft: 20, fontSize: 16, fontWeight: '500' },
  menuLogoutBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 'auto', marginBottom: 40, paddingVertical: 15 },
  logoutText: { color: '#FF4757', marginLeft: 20, fontSize: 16, fontWeight: 'bold' },
  // Listas
  fullListView: { flex: 1, paddingTop: 10 },
  backBtnInline: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  gridCard: { width: (width / 2) - 20, margin: 10 },
  gridImage: { width: '100%', height: 220, borderRadius: 10 }
});