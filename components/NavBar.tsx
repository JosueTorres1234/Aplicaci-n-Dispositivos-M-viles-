import { Ionicons } from '@expo/vector-icons';
import { Href, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (route: Href) => {
    router.push(route);
  };

  const isActive = (route: string) => {
    if (route === '/(tabs)' && pathname === '/(tabs)') return true;
    if (route === '/(tabs)/explore' && pathname === '/(tabs)/explore') return true;
    return false;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.tab, isActive('/(tabs)') && styles.activeTab]} 
        onPress={() => navigateTo('/(tabs)')}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={isActive('/(tabs)') ? '#FF6B35' : '#888'} 
        />
        <Text style={[styles.label, isActive('/(tabs)') && styles.activeLabel]}>
          Inicio
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tab, isActive('/(tabs)/explore') && styles.activeTab]} 
        onPress={() => navigateTo('/(tabs)/explore')}
      >
        <Ionicons 
          name="compass" 
          size={24} 
          color={isActive('/(tabs)/explore') ? '#FF6B35' : '#888'} 
        />
        <Text style={[styles.label, isActive('/(tabs)/explore') && styles.activeLabel]}>
          Explorar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  activeTab: {
    // El color se maneja en los íconos y texto
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  activeLabel: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
});

export default NavBar;