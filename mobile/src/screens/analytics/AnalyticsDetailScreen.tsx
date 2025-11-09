import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { analyticsApi } from '../../services/api/analyticsApi';
import { AnalyticsStackParamList } from '../../navigation/MainNavigator';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { theme } from '../../theme';

type AnalyticsDetailScreenRouteProp = RouteProp<AnalyticsStackParamList, 'AnalyticsDetail'>;

const AnalyticsDetailScreen: React.FC = () => {
  const route = useRoute<AnalyticsDetailScreenRouteProp>();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await analyticsApi.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Category Breakdown
          </Text>
          {categories.length === 0 ? (
            <Text variant="bodyMedium" style={styles.emptyText}>
              No category data available
            </Text>
          ) : (
            <FlatList
              data={categories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.categoryItem}>
                  <Text variant="bodyLarge" style={styles.categoryName}>
                    {item.category || 'Uncategorized'}
                  </Text>
                  <View style={styles.categoryDetails}>
                    <Text variant="bodyMedium" style={styles.categoryAmount}>
                      {formatCurrency(item.amount)}
                    </Text>
                    <Text variant="bodySmall" style={styles.categoryCount}>
                      {item.count} loan{item.count !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.placeholder + '30',
  },
  categoryName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryAmount: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  categoryCount: {
    color: theme.colors.placeholder,
  },
  emptyText: {
    color: theme.colors.placeholder,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 24,
  },
});

export default AnalyticsDetailScreen;

