import { useEffect } from 'react';

import { StyleSheet, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import Animated from 'react-native-reanimated';



import { Card, Icon, Text, useFadeIn, usePulseAnimation, useTheme } from '@/design-system';



import {
  CAREER_GOAL_OPTIONS,
  getCurrentProfileLabel,
  getOptionLabel,
} from '../constants';

import { formatProfileEducationSummary } from '../utils/profileEducationLabel';

import { formatUserSkillsSummary } from '../skills/skillUtils';

import type { CareerProfile } from '../types';



interface SummaryStepProps {

  profile: CareerProfile;

}



function SummaryRow({ label, value }: { label: string; value: string }) {

  const theme = useTheme();



  return (

    <View style={styles.row}>

      <Text variant="caption" color={theme.colors.text.muted}>

        {label}

      </Text>

      <Text variant="label" color={theme.colors.text.primary} style={styles.value}>

        {value}

      </Text>

    </View>

  );

}



function formatExperiences(profile: CareerProfile): string {

  if (profile.hasNoExperience) return 'Pas encore d\'expérience';

  const filled = profile.experiences.filter((exp) => exp.jobTitle.trim().length > 0);

  if (filled.length === 0) return '—';

  return filled

    .map((exp) => {

      const parts = [exp.jobTitle.trim()];

      if (exp.company.trim()) parts.push(exp.company.trim());

      if (exp.duration.trim()) parts.push(exp.duration.trim());

      if (exp.isCurrent) parts.push('(actuel)');

      return parts.join(' · ');

    })

    .join(' / ');

}



export function SummaryStep({ profile }: SummaryStepProps) {

  const theme = useTheme();

  const { animatedStyle, start } = useFadeIn(100, 550);

  const glowStyle = usePulseAnimation(0.98, 1.02);



  useEffect(() => {

    start();

  }, [start]);



  const profileSummary = getCurrentProfileLabel(profile);

  const education = formatProfileEducationSummary(profile);



  const experiences = formatExperiences(profile);

  const goal = getOptionLabel(CAREER_GOAL_OPTIONS, profile.careerGoal);

  const targetRoles =

    profile.targetRoles.length > 0 ? profile.targetRoles.join(' · ') : '—';

  const skills = formatUserSkillsSummary(profile.skills);



  return (

    <Animated.View style={[styles.container, animatedStyle]}>

      <Text variant="h2" color={theme.colors.text.primary}>

        Ton profil carrière IA est prêt

      </Text>

      <Text variant="body" color={theme.colors.text.secondary}>

        CareerPilot te connaît mieux et peut personnaliser ton expérience.

      </Text>



      <Animated.View style={glowStyle}>

        <Card variant="elevated" padding="0" style={styles.card}>

          <LinearGradient

            colors={['#111827', '#1E293B', '#0F172A']}

            start={{ x: 0, y: 0 }}

            end={{ x: 1, y: 1 }}

            style={[styles.gradient, { borderRadius: theme.radius.xl }]}

          >

            <LinearGradient

              colors={['rgba(59,130,246,0.18)', 'transparent']}

              start={{ x: 0, y: 0 }}

              end={{ x: 1, y: 1 }}

              style={[StyleSheet.absoluteFill, { borderRadius: theme.radius.xl }]}

            />

            <View style={styles.header}>

              <View

                style={[

                  styles.avatar,

                  { backgroundColor: 'rgba(43, 108, 255, 0.2)', borderRadius: theme.radius.full },

                ]}

              >

                <Text variant="h2" color={theme.colors.brand.primary}>

                  {profile.firstName.charAt(0).toUpperCase() || '?'}

                </Text>

              </View>

              <View style={styles.headerText}>

                <Text variant="h3" color={theme.colors.text.primary}>

                  {profile.firstName}

                </Text>

                <View style={styles.badgeRow}>

                  <Icon name="sparkles" size="sm" color={theme.colors.brand.accent} />

                  <Text variant="caption" color={theme.colors.brand.accent}>

                    Profil personnalisé

                  </Text>

                </View>

              </View>

            </View>



            <View style={[styles.divider, { backgroundColor: theme.colors.border.subtle }]} />



            <SummaryRow label="Profil" value={profileSummary} />
            <SummaryRow label="Formation" value={education || '—'} />

            <SummaryRow label="Expérience" value={experiences} />

            <SummaryRow label="Objectif" value={goal} />

            <SummaryRow label="Postes visés" value={targetRoles} />

            <SummaryRow label="Compétences" value={skills} />

          </LinearGradient>

        </Card>

      </Animated.View>

    </Animated.View>

  );

}



const styles = StyleSheet.create({

  container: {

    gap: 16,

  },

  card: {

    overflow: 'hidden',

    marginTop: 4,

  },

  gradient: {

    padding: 20,

    gap: 14,

    borderWidth: 1,

    borderColor: 'rgba(43, 108, 255, 0.25)',

  },

  header: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 14,

  },

  avatar: {

    width: 52,

    height: 52,

    alignItems: 'center',

    justifyContent: 'center',

  },

  headerText: {

    flex: 1,

    gap: 4,

  },

  badgeRow: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,

  },

  divider: {

    height: 1,

    marginVertical: 4,

  },

  row: {

    gap: 4,

  },

  value: {

    lineHeight: 22,

  },

});


