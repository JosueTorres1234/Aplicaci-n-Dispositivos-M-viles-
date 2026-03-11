import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF4500',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          drawerStyle: {
            backgroundColor: '#1a1a1a',
            width: 280,
          },
          drawerLabelStyle: {
            color: '#fff',
            fontSize: 16,
          },
          drawerActiveTintColor: '#FF4500',
          drawerInactiveTintColor: '#fff',
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Inicio',
            title: 'Inicio',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => console.log('Buscar')}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <Drawer.Screen
          name="explore"
          options={{
            drawerLabel: 'Explorar',
            title: 'Explorar',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="compass-outline" size={size} color={color} />
            ),
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => console.log('Buscar')}
                style={{ marginRight: 15 }}
              >
                <Ionicons name="search" size={24} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

function CustomDrawerContent({ navigation }: any) {
  const menuSections = [
    {
      title: 'Mis Suscripciones',
      items: [
        { label: 'Todos los suscripciones', icon: 'grid-outline', route: 'index' },
        { label: 'Suscripciones activas', icon: 'checkmark-circle-outline', route: 'explore' },
        { label: 'Próximo a vencer', icon: 'time-outline', route: 'index' },
        { label: 'Encargos', icon: 'cart-outline', route: 'explore' },
      ]
    },
    {
      title: 'Configuración',
      items: [
        { label: 'Configuración', icon: 'settings-outline', route: 'index' },
        { label: 'Cerrar sesión', icon: 'log-out-outline', route: 'index' },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="book" size={32} color="#FF4500" />
          <Text style={styles.logoText}>MangaReader</Text>
        </View>
        <Text style={styles.subtitle}>Tu espacio de lectura</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.menuItem}
                onPress={() => {
                  navigation.navigate(item.route);
                  navigation.closeDrawer();
                }}
              >
                <Ionicons name={item.icon as any} size={22} color="#FF4500" />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle-outline" size={40} color="#FF4500" />
          <View style={styles.userText}>
            <Text style={styles.userName}>Usuario Manga</Text>
            <Text style={styles.userEmail}>usuario@email.com</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4500',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginLeft: 42,
  },
  menuContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#FF4500',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 15,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userText: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#888',
    fontSize: 14,
  },
});