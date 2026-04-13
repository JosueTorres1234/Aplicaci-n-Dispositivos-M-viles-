import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons'; // Viene por defecto en Expo

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Mantenemos limpio el diseño superior
        tabBarActiveTintColor: '#6C5CE7', // Morado principal
        tabBarInactiveTintColor: '#8E8E93', // Gris para lo no seleccionado
        tabBarStyle: {
          backgroundColor: '#161618', // Fondo oscuro premium
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 10,
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