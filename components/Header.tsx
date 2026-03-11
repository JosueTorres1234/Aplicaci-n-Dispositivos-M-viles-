import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title: string;
  showSearch?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showSearch = true }) => {
  const router = useRouter();

  const handleSearch = () => {
    // Aquí puedes navegar a una pantalla de búsqueda
    console.log('Abriendo búsqueda...');
    // Por ahora solo mostramos un mensaje
    alert('Funcionalidad de búsqueda próximamente');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showSearch && (
        <TouchableOpacity onPress={handleSearch} style={styles.icon}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF4500', // Naranja/rojo más vibrante (como el de One Piece)
    padding: 15,
    paddingTop: 15, // Reducido porque SafeAreaView ya maneja el notch
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  icon: {
    padding: 5,
  },
});

export default Header;