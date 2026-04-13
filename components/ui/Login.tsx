// components/ui/Login.tsx
import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  StatusBar, 
  ImageBackground, 
  Dimensions,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface LoginProps {
  onLogin: () => void;
  onGoogleLogin: () => void;
}

export default function Login({ onLogin, onGoogleLogin }: LoginProps) {
  return (
    <ImageBackground 
      source={require('../../assets/images/descarga.jpg')} 
      style={styles.backgroundImage}
      resizeMode="cover"
      // Se redujo el blur para que la imagen de buena calidad sea visible
      blurRadius={Platform.OS === 'ios' ? 3 : 1.5} 
    >
      <StatusBar barStyle="light-content" />
      
      <View style={styles.overlay}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Tachiyomi</Text>
          <Text style={styles.subtitle}>Bienvenido de vuelta, gestiona tus mangas.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput 
              style={styles.input} 
              placeholder="ejemplo@manga.com" 
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Min. 6 caracteres" 
              placeholderTextColor="#666"
              secureTextEntry
            />
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={onGoogleLogin}>
            <Ionicons name="logo-google" size={20} color="black" />
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: width,
    height: height,
    flex: 1,
  },
  overlay: {
    flex: 1,
    // Se aumentó la opacidad a 0.82 para que el texto sea legible con el fondo más nítido
    backgroundColor: 'rgba(0, 0, 0, 0.82)', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  formContainer: {
    width: '90%',
    maxWidth: 400, 
    backgroundColor: '#161618', 
    padding: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20, 
  },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, color: '#8E8E93', textAlign: 'center', marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  label: { color: 'white', marginBottom: 8, fontSize: 14, fontWeight: '600' },
  input: { backgroundColor: '#2C2C2E', color: 'white', padding: 15, borderRadius: 12, fontSize: 16 },
  forgotPassword: { color: '#6C5CE7', textAlign: 'right', fontSize: 12, marginBottom: 30 },
  loginButton: { backgroundColor: '#6C5CE7', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  loginButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#2C2C2E' },
  dividerText: { color: '#666', marginHorizontal: 15 },
  googleButton: { flexDirection: 'row', backgroundColor: 'white', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  googleButtonText: { color: 'black', fontWeight: 'bold', marginLeft: 10, fontSize: 16 },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 25 },
  registerText: { color: '#8E8E93' },
  registerLink: { color: '#6C5CE7', fontWeight: 'bold' }
});