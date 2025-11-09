import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Chip, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { analyticsApi } from '../../services/api/analyticsApi';
import { AnalyticsStackParamList } from '../../navigation/MainNavigator';
import { formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { theme } from '../../theme';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

type AnalyticsScreenNavigationProp = StackNavigationProp<AnalyticsStackParamList, 'Analytics'>;

const AnalyticsScreen: React.FC = () => {
  const navigation = useNavigation<AnalyticsScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [summaryResponse, monthlyResponse] = await Promise.all([
        analyticsApi.getSummary(),
        period === 'monthly' ? analyticsApi.getMonthly(new Date().toISOString().slice(0, 7)) : analyticsApi.getYearly(new Date().getFullYear()),
      ]);

      if (summaryResponse.success && summaryResponse.data) {
        setSummary(summaryResponse.data);
      }

      if (monthlyResponse.success && monthlyResponse.data) {
        // Prepare chart data
        if (period === 'monthly') {
          setChartData({
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
              {
                data: [monthlyResponse.data.given || 0],
                color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
              },
            ],
          });
        }
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return <LoadingSpinner />;
  }

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.periodSelector}>
        <Chip
          selected={period === 'monthly'}
          onPress={() => setPeriod('monthly')}
          style={styles.chip}
        >
          Monthly
        </Chip>
        <Chip
          selected={period === 'yearly'}
          onPress={() => setPeriod('yearly')}
          style={styles.chip}
        >
          Yearly
        </Chip>
      </View>

      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="labelLarge" style={styles.label}>
              Total Given
            </Text>
            <Text variant="headlineMedium" style={styles.amount}>
              {formatCurrency(summary.totalGiven)}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text variant="labelLarge" style={styles.label}>
              Total Received
            </Text>
            <Text variant="headlineMedium" style={styles.amount}>
              {formatCurrency(summary.totalReceived)}
            </Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Net Position
          </Text>
          <Text
            variant="headlineLarge"
            style={[
              styles.netAmount,
              { color: summary.netPosition >= 0 ? theme.colors.primary : theme.colors.error },
            ]}
          >
            {formatCurrency(summary.netPosition)}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Active Loans
          </Text>
          <Text variant="headlineMedium" style={styles.amount}>
            {summary.activeLoansCount}
          </Text>
        </Card.Content>
      </Card>

      {chartData && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              {period === 'monthly' ? 'Monthly' : 'Yearly'} Overview
            </Text>
            <LineChart
              data={chartData}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                backgroundColor: theme.colors.surface,
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Category Breakdown
          </Text>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('AnalyticsDetail', {})}
            style={styles.button}
          >
            View Details
          </Button>
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
  periodSelector: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'center',
  },
  chip: {
    marginHorizontal: 8,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 8,
    elevation: 2,
  },
  label: {
    color: theme.colors.placeholder,
    marginBottom: 8,
  },
  amount: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  netAmount: {
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default AnalyticsScreen;

