import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CardProps {
  title: string;
  imageUri: string;
  progress: number;
  onPress: () => void;
  variant?: 'vertical' | 'horizontal';
  showDetails?: boolean;
  chapters?: number;
  rating?: number;
  status?: string;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  imageUri, 
  progress, 
  onPress,
  variant = 'vertical',
  showDetails = false,
  chapters,
  rating,
  status 
}) => {
  if (variant === 'horizontal') {
    return (
      <TouchableOpacity style={styles.horizontalContainer} onPress={onPress} activeOpacity={0.7}>
        <Image source={{ uri: imageUri }} style={styles.horizontalImage} />
        <View style={styles.horizontalInfo}>
          <Text style={styles.horizontalTitle} numberOfLines={2}>{title}</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        
        {showDetails && (
          <View style={styles.detailsRow}>
            {rating && (
              <View style={styles.detailItem}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.detailText}>{rating.toFixed(1)}</Text>
              </View>
            )}
            {chapters && (
              <View style={styles.detailItem}>
                <Ionicons name="book-outline" size={14} color="#888" />
                <Text style={styles.detailText}>{chapters} caps</Text>
              </View>
            )}
            {status && (
              <View style={[styles.statusBadge, 
                status === 'Completado' ? styles.statusCompleted : 
                status === 'Finalizado' ? styles.statusFinished : 
                styles.statusOngoing
              ]}>
                <Text style={styles.statusText}>{status}</Text>
              </View>
            )}
          </View>
        )}
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#FF4500" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  image: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  // Estilos para horizontal
  horizontalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: 160,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  horizontalImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
});

export default Card;