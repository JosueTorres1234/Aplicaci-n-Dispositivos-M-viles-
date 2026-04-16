import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';

export default function TabLayout() {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLogged(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6C5CE7',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#161618',
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 10,
          // La barra solo existe si el usuario inició sesión
          display: isLogged ? 'flex' : 'none', 
        },
      }}>
      
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      
      <Tabs.Screen 
        name="explore" 
        options={{ 
          title: 'Explorar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }} 
      />

      <Tabs.Screen 
        name="perfil" 
        options={{ 
          title: 'Mi Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}