import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import theme from '../theme';
import { API_BASE_URL } from '../config';
import { useFeedback } from '../context/FeedbackContext';

const { colors, spacing, radii, typography, shadows } = theme;

export default function AudioToTextScreen({ navigation }) {
  const { showToast } = useFeedback();
  const [phase, setPhase] = useState('idle');
  const [recording, setRecording] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [emotion, setEmotion] = useState('Neutral');

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        showToast('error', 'Microphone permission is required');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setTranscript('');
      setEmotion('Neutral');
      setPhase('recording');
    } catch (err) {
      showToast('error', 'Could not start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setPhase('uploading');
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (!uri) {
        showToast('error', 'No audio captured');
        setPhase('idle');
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'entry.m4a',
        type: 'audio/m4a',
      });

      const res = await fetch(`${API_BASE_URL}/analyze/audio`, {
        method: 'POST',
        // Let fetch/React Native set the multipart boundary automatically.
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.message || 'Could not transcribe audio';
        showToast('error', message);
        setPhase('idle');
        return;
      }

      setTranscript(data.transcript || '');
      setEmotion(data.emotion || 'Neutral');
      setPhase('done');
    } catch (err) {
      showToast('error', 'Error while processing audio');
      setPhase('idle');
    }
  };

  const handleUseTranscription = () => {
    if (!transcript.trim()) {
      showToast('error', 'No transcription to use');
      return;
    }

    navigation.navigate('AddJournal', {
      transcription: transcript,
      emotion,
    });
  };

  const handleTryAgain = () => {
    setTranscript('');
    setEmotion('Neutral');
    setPhase('idle');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio to Text</Text>

      <View style={styles.card}>
        {phase === 'idle' && (
          <>
            <View style={styles.micCircle}>
              <Text style={styles.micIcon}>🎙️</Text>
            </View>
            <Text style={styles.cardHint}>
              Record a short audio note and we will turn it into text and analyze its emotion.
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={startRecording}
              >
                <Text style={styles.primaryButtonText}>Start recording</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {phase === 'recording' && (
          <View style={styles.loadingBox}>
            <Text style={styles.loadingText}>Recording... tap stop when you are done.</Text>
            <TouchableOpacity style={styles.useButton} onPress={stopRecording}>
              <Text style={styles.useButtonText}>Stop & Transcribe</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'uploading' && (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>Transcribing your audio and analyzing emotion...</Text>
          </View>
        )}

        {phase === 'done' && (
          <>
            <View style={styles.previewBox}>
              <Text style={styles.previewLabel}>Transcription preview</Text>
              <Text style={styles.previewText}>{transcript}</Text>
              <Text style={styles.emotionLabel}>Detected emotion: {emotion}</Text>
            </View>

            <TouchableOpacity
              style={styles.useButton}
              onPress={handleUseTranscription}
            >
              <Text style={styles.useButtonText}>Use Transcription</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tryAgainButton} onPress={handleTryAgain}>
              <Text style={styles.tryAgainText}>Record Again</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    ...shadows.soft,
  },
  micCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.secondaryLight,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  micIcon: {
    fontSize: 40,
  },
  cardHint: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.textOnPrimary,
    fontWeight: '600',
    fontSize: typography.sizes.subtitle,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.primary,
    fontSize: typography.sizes.subtitle,
  },
  loadingBox: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
  },
  previewBox: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    marginBottom: spacing.lg,
  },
  previewLabel: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  previewText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emotionLabel: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  useButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  useButtonText: {
    fontFamily: typography.fontFamilyPrimary,
    color: colors.textOnPrimary,
    fontWeight: '600',
    fontSize: typography.sizes.subtitle,
  },
  tryAgainButton: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  tryAgainText: {
    fontFamily: typography.fontFamilyPrimary,
    fontSize: typography.sizes.body,
    color: colors.primary,
  },
});
