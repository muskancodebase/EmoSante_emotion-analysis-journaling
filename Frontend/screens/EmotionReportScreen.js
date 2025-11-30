
import { Animated } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { BarChart } from 'react-native-chart-kit';

import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { API_BASE_URL } from '../config';
import theme from '../theme';
const StatCard = ({ label, value, bg }) => {
    const scale = useRef(new Animated.Value(0.4)).current; // Start small

    useEffect(() => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            friction: 5,
            tension: 120,
        }).start();
    }, []);

    return (
        <Animated.View
            style={{
                width: 140,
                height: 140,
                borderRadius: 100,
                backgroundColor: bg || "#E3F2FD",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
                shadowColor: "#000",
                shadowOpacity: 0.15,
                shadowRadius: 5,
                elevation: 3,
                transform: [{ scale }],
            }}
        >
            <Text style={{ fontSize: 14, color: "#333" }}>{label}</Text>
            <Text style={{ fontSize: 28, fontWeight: "700", marginTop: 4 }}>
                {value}
            </Text>
        </Animated.View>
    );
};
const SCREEN_WIDTH = Dimensions.get("window").width;
const { colors, spacing, radii, typography, shadows } = theme;
const { width } = Dimensions.get('window');

export default function EmotionReportScreen() {
  const { user } = useAuth();
  const { showToast } = useFeedback();

  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMonths, setLoadingMonths] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchAvailableMonths();
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      generateReport(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  const fetchAvailableMonths = async () => {
    try {
      setLoadingMonths(true);

      const res = await fetch(`${API_BASE_URL}/report/available-months`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await res.json();

      if (data.success && data.months.length > 0) {
        setAvailableMonths(data.months);

        setSelectedMonth(data.months[0].month);
        setSelectedYear(data.months[0].year);

        generateReport(data.months[0].month, data.months[0].year);
      } else {
        showToast('info', 'No journal entries found yet');
      }
    } catch {
      showToast('error', 'Failed to load months');
    } finally {
      setLoadingMonths(false);
    }
  };

  const generateReport = async (month, year) => {
    if (!month || !year) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/report/monthly-emotion-trend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          month,
          year,
        }),
      });

      const data = await res.json();

      if (data.success && data.report) {
        setReport(data.report);
      } else {
        setReport(null);
        showToast('info', data.message || 'No data');
      }
    } catch {
      showToast('error', 'Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getEmotionColor = (emotion) => {
    const emotionColors = {
      Happy: '#10B981',
      Sad: '#3B82F6',
      Anxious: '#F59E0B',
      Angry: '#EF4444',
      Neutral: '#6B7280',
      Excited: '#8B5CF6',
      Calm: '#06B6D4',
    };
    return emotionColors[emotion] || colors.primary;
  };
// -------------------  PDF EXPORT ------------------- //
const handleExportPDF = async () => {
  if (!report) {
    alert("Report not ready");
    return;
  }


  const html = `
  <html>
    <body style="font-family: Arial; padding: 32px; background:#FAFAFA;">

      <!-- Report Container -->
      <div style="
        background:#ffffff;
        padding:32px;
        border-radius:12px;
        max-width:800px;
        margin: auto;
        border:1px solid #e5e7eb;
      ">

        <!-- HEADER -->
        <h1 style="
          text-align:center;
          color:${colors.primary};
          margin-bottom:4px;
          font-size:28px;
        ">
          Monthly Emotion Report
        </h1>

        <p style="
          text-align:center;
          color:#6B7280;
          margin-top:0;
          font-size:16px;
        ">
          ${report.month} ${report.year}
        </p>

        <hr style="margin:24px 0; border:none; border-top:1px solid #e5e7eb;" />

        <!-- SUMMARY -->
        <h2 style="color:#111827; font-size:20px; margin-bottom:8px;">
          Summary
        </h2>
        <p style="font-size:15px; color:#374151; line-height:1.6;">
          ${report.summary}
        </p>

        <hr style="margin:24px 0; border:none; border-top:1px solid #e5e7eb;" />

        <!-- QUICK STATS -->
        <h2 style="color:#111827; font-size:20px; margin-bottom:12px;">
          Quick Stats
        </h2>

        <div style="
          display:flex;
          justify-content:space-between;
          margin-bottom:20px;
        ">
          <div style="width:48%; padding:16px; border-radius:10px; background:#F3F4F6;">
            <h3 style="margin:0; color:#374151; font-size:16px;">Total Entries</h3>
            <p style="margin-top:6px; color:#111827; font-size:22px; font-weight:bold;">
              ${report.total_entries}
            </p>
          </div>

          <div style="width:48%; padding:16px; border-radius:10px; background:#F3F4F6;">
            <h3 style="margin:0; color:#374151; font-size:16px;">Most Common Emotion</h3>
            <p style="margin-top:6px; color:#111827; font-size:22px; font-weight:bold;">
              ${report.dominant_emotion}
            </p>
          </div>
        </div>

        <hr style="margin:24px 0; border:none; border-top:1px solid #e5e7eb;" />

        <!-- EMOTION BREAKDOWN -->
        <h2 style="color:#111827; font-size:20px; margin-bottom:10px;">
          Emotion Breakdown
        </h2>

        <ul style="font-size:15px; color:#374151; line-height:1.8;">
          ${Object.entries(report.emotion_breakdown)
            .map(([emo, count]) => `<li><b>${emo}:</b> ${count}</li>`)
            .join("")}
        </ul>

        <hr style="margin:24px 0; border:none; border-top:1px solid #e5e7eb;" />

        <!-- DAILY ENTRIES -->
        <h2 style="color:#111827; font-size:20px; margin-bottom:10px;">
          Daily Entries
        </h2>

        <ul style="font-size:15px; color:#374151; line-height:1.6;">
          ${Object.keys(report.entries_by_date)
            .map(
              (date) => `
                <li style="margin-bottom:10px;">
                  <b>${date}</b>
                  <ul style="margin-top:4px;">
                    ${report.entries_by_date[date]
                      .map(
                        (item) =>
                          `<li>${item.time} - ${item.title} (${item.emotion})</li>`
                      )
                      .join("")}
                  </ul>
                </li>
              `
            )
            .join("")}
        </ul>

        <p style="text-align:center; margin-top:30px; color:#9CA3AF; font-size:13px;">
          Emotion Report • Auto-generated
        </p>

      </div>

    </body>
  </html>
`;



  try {
    const file = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(file.uri);
  } catch (err) {
    console.log("PDF ERROR:", err);
    alert("Failed to generate PDF");
  }
};



  if (loadingMonths) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your data...</Text>
      </View>
    );
  }

  if (availableMonths.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No Journal Entries Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start writing journal entries to see your emotion trends!
        </Text>
      </View>
    );
  }

  return (
    <>
    <ScrollView style={styles.container}>
      
{/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Monthly Emotion Report</Text>
        <Text style={styles.subtitle}>Track your emotional journey</Text>
      </View>

{/* MONTH PICKER */}
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Select Month:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={
              selectedMonth && selectedYear
                ? `${selectedYear}-${selectedMonth}`
                : ''
            }
            onValueChange={(value) => {
              const [year, month] = value.split('-').map(Number);
              setSelectedYear(year);
              setSelectedMonth(month);
            }}
            style={styles.picker}
          >
            {availableMonths.map((item) => (
              <Picker.Item
                key={`${item.year}-${item.month}`}
                label={`${item.label} (${item.count} entries)`} 
                value={`${item.year}-${item.month}`}
              />
            ))}
          </Picker>
        </View>
      </View>

{/* LOADING */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Generating report...</Text>
        </View>
      )}

{/* REPORT CARD */}
      {!loading && report && (
        <View style={styles.reportContainer}>
          
{/* SUMMARY */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Summary</Text>
            <Text style={styles.summaryText}>{report.summary}</Text>
          </View>
          
{/* ------------------- Round Stats Cards ------------------- */}
<View style={{
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal:spacing.lg,     // SAME AS SCREEN
    paddingVertical: 10,
    marginTop: 0,   
    marginBottom: spacing.lg,
}}>
    <StatCard 
        label="Total Entries" 
        value={report?.total_entries ?? 0}
        bg="#FFEBEE"
    />

    <StatCard 
        label="Top Emotion" 
        value={report?.dominant_emotion ?? "None"}
        bg="#E8F5E9"
    />
</View>

          {/* BAR CHART ONLY */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Emotion Breakdown</Text>

            <BarChart
              ref={chartRef}
              data={{
                labels: Object.keys(report.emotion_breakdown),
                datasets: [{ data: Object.values(report.emotion_breakdown) }],
              }}
              width={width - 60}
              height={260}
              fromZero
              chartConfig={{
                backgroundGradientFrom: colors.surface,
                backgroundGradientTo: colors.surface,
                decimalPlaces: 0,
                color: () => colors.primary,
                labelColor: () => colors.text,
              }}
              style={styles.chart}
              showValuesOnTopOfBars
            />
          </View>

        </View>
      )}

    </ScrollView>
    
    
    {/* Floating PDF Button */}
<TouchableOpacity
  onPress={handleExportPDF}
  style={{
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  }}
>
  <Text style={{ fontSize: 26, color: "white" }}>📄</Text>
</TouchableOpacity>

</>
  );
}

/* ----------------- STYLES ----------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },

  header: { padding: spacing.xl, backgroundColor: colors.surface },

  title: {
    fontSize: typography.sizes.title,
    fontWeight: '700',
    color: colors.text,
  },
  
  subtitle: { color: colors.textMuted },

  pickerContainer: { padding: spacing.lg },
  pickerLabel: { fontWeight: '600', marginBottom: spacing.sm },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: radii.md,
  },

  picker: { color: colors.text },

  loadingContainer: { alignItems: 'center', padding: spacing.xl },

  loadingText: { marginTop: spacing.md },

  reportContainer: { padding: spacing.lg },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...shadows.soft,
  },

  cardTitle: { fontWeight: '700', marginBottom: spacing.md },

  summaryText: { color: colors.textMuted },

  chart: { borderRadius: 12 },
});
