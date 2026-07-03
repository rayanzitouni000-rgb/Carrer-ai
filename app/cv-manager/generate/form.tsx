import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import {
  Card,
  Icon,
  Input,
  OutlineButton,
  PrimaryButton,
  ScreenContainer,
  Text,
  useTheme,
} from '@/design-system';

import { careerProfileStore } from '@/services/careerProfileStore';
import type {
  GeneratedCvData,
  GeneratedCvEducation,
  GeneratedCvExperience,
} from '@/types/cvGenerator';
import { buildCvDataFromProfile } from '@/features/cv-manager/generate/prefillCvData';
import { cvGeneratorStore } from '@/features/cv-manager/generate/cvGeneratorStore';
import { incrementCvGeneratedCount } from '@/hooks/useCvActionsTracking';

const MAX_EXPERIENCES = 6;
const MAX_EDUCATION = 4;

function createExperience(): GeneratedCvExperience {
  return {
    id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    jobTitle: '',
    company: '',
    duration: '',
    description: '',
  };
}

function createEducation(): GeneratedCvEducation {
  return {
    id: `edu-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    degree: '',
    school: '',
    year: '',
  };
}

function SectionTitle({ children }: { children: string }) {
  const theme = useTheme();
  return (
    <Text variant="label" color={theme.colors.brand.primaryLight} style={styles.sectionTitle}>
      {children}
    </Text>
  );
}

export default function CvFormScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [data, setData] = useState<GeneratedCvData>(() =>
    cvGeneratorStore.getOrEmpty()
  );
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (cvGeneratorStore.hasDraft()) return;
    let mounted = true;
    void careerProfileStore.hydrate().then((profile) => {
      if (!mounted) return;
      setData(buildCvDataFromProfile(profile));
    });
    return () => {
      mounted = false;
    };
  }, []);

  const update = (patch: Partial<GeneratedCvData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  };

  const updateExperience = (id: string, patch: Partial<GeneratedCvExperience>) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, ...patch } : exp
      ),
    }));
  };

  const addExperience = () => {
    setData((prev) =>
      prev.experiences.length >= MAX_EXPERIENCES
        ? prev
        : { ...prev, experiences: [...prev.experiences, createExperience()] }
    );
  };

  const removeExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  const updateEducation = (id: string, patch: Partial<GeneratedCvEducation>) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, ...patch } : edu)),
    }));
  };

  const addEducation = () => {
    setData((prev) =>
      prev.education.length >= MAX_EDUCATION
        ? prev
        : { ...prev, education: [...prev.education, createEducation()] }
    );
  };

  const removeEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    setData((prev) =>
      prev.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())
        ? prev
        : { ...prev, skills: [...prev.skills, trimmed] }
    );
    setSkillInput('');
  };

  const removeSkill = (label: string) => {
    setData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== label) }));
  };

  const canGenerate = useMemo(() => {
    if (data.fullName.trim().length === 0) return false;
    // Seuls jobTitle + company + duration sont requis par expérience.
    return data.experiences.every(
      (exp) =>
        exp.jobTitle.trim().length > 0 &&
        exp.company.trim().length > 0 &&
        exp.duration.trim().length > 0
    );
  }, [data]);

  const handleGenerate = () => {
    cvGeneratorStore.set(data);
    void incrementCvGeneratedCount();
    router.push('/cv-manager/generate/preview');
  };

  return (
    <ScreenContainer scrollable safeAreaBottom showBack title="Mon CV" contentStyle={styles.content}>
      {/* Informations personnelles */}
      <View style={styles.section}>
        <SectionTitle>Informations personnelles</SectionTitle>
        <Card variant="elevated" padding="4" style={styles.card}>
          <Input
            label="Nom complet"
            placeholder="Ex. Rayan Zitouni"
            value={data.fullName}
            onChangeText={(fullName) => update({ fullName })}
            autoCapitalize="words"
          />
          <Input
            label="Email"
            placeholder="prenom.nom@email.com"
            value={data.email}
            onChangeText={(email) => update({ email })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Téléphone"
            placeholder="06 12 34 56 78"
            value={data.phone}
            onChangeText={(phone) => update({ phone })}
            keyboardType="phone-pad"
          />
        </Card>
      </View>

      {/* Titre professionnel */}
      <View style={styles.section}>
        <SectionTitle>Titre professionnel</SectionTitle>
        <Card variant="elevated" padding="4" style={styles.card}>
          <Input
            placeholder="Ex. Développeur Front-end"
            value={data.headline}
            onChangeText={(headline) => update({ headline })}
          />
        </Card>
      </View>

      {/* Résumé */}
      <View style={styles.section}>
        <SectionTitle>Résumé / présentation</SectionTitle>
        <Card variant="elevated" padding="4" style={styles.card}>
          <Input
            placeholder="Quelques lignes pour te présenter (optionnel)"
            value={data.summary}
            onChangeText={(summary) => update({ summary })}
            multiline
            numberOfLines={4}
            style={styles.multiline}
          />
        </Card>
      </View>

      {/* Expériences */}
      <View style={styles.section}>
        <SectionTitle>Expériences</SectionTitle>
        <View style={styles.list}>
          {data.experiences.map((exp, index) => (
            <Card key={exp.id} variant="elevated" padding="4" style={styles.card}>
              <View style={styles.itemHeader}>
                <Text variant="label" color={theme.colors.text.secondary}>
                  Expérience {index + 1}
                </Text>
                <Pressable onPress={() => removeExperience(exp.id)} hitSlop={8}>
                  <Icon name="close-circle-outline" size="sm" color={theme.colors.text.muted} />
                </Pressable>
              </View>
              <Input
                label="Intitulé du poste"
                placeholder="Ex. Assistant commercial"
                value={exp.jobTitle}
                onChangeText={(jobTitle) => updateExperience(exp.id, { jobTitle })}
              />
              <Input
                label="Entreprise"
                placeholder="Ex. Carrefour"
                value={exp.company}
                onChangeText={(company) => updateExperience(exp.id, { company })}
              />
              <Input
                label="Durée"
                placeholder='Ex. 2 ans ou "Jan 2022 - Déc 2023"'
                value={exp.duration}
                onChangeText={(duration) => updateExperience(exp.id, { duration })}
              />
              <Input
                label="Description"
                placeholder="Décris tes missions et réalisations (optionnel)"
                value={exp.description ?? ''}
                onChangeText={(description) => updateExperience(exp.id, { description })}
                multiline
                numberOfLines={3}
                style={styles.multiline}
              />
            </Card>
          ))}
          {data.experiences.length < MAX_EXPERIENCES && (
            <OutlineButton label="+ Ajouter une expérience" onPress={addExperience} fullWidth />
          )}
        </View>
      </View>

      {/* Formation */}
      <View style={styles.section}>
        <SectionTitle>Formation</SectionTitle>
        <View style={styles.list}>
          {data.education.map((edu, index) => (
            <Card key={edu.id} variant="elevated" padding="4" style={styles.card}>
              <View style={styles.itemHeader}>
                <Text variant="label" color={theme.colors.text.secondary}>
                  Formation {index + 1}
                </Text>
                <Pressable onPress={() => removeEducation(edu.id)} hitSlop={8}>
                  <Icon name="close-circle-outline" size="sm" color={theme.colors.text.muted} />
                </Pressable>
              </View>
              <Input
                label="Diplôme"
                placeholder="Ex. Master en informatique"
                value={edu.degree}
                onChangeText={(degree) => updateEducation(edu.id, { degree })}
              />
              <Input
                label="École / établissement"
                placeholder="Ex. Université de Lyon"
                value={edu.school}
                onChangeText={(school) => updateEducation(edu.id, { school })}
              />
              <Input
                label="Année"
                placeholder="Ex. 2023"
                value={edu.year}
                onChangeText={(year) => updateEducation(edu.id, { year })}
              />
            </Card>
          ))}
          {data.education.length < MAX_EDUCATION && (
            <OutlineButton label="+ Ajouter une formation" onPress={addEducation} fullWidth />
          )}
        </View>
      </View>

      {/* Compétences */}
      <View style={styles.section}>
        <SectionTitle>Compétences</SectionTitle>
        <Card variant="elevated" padding="4" style={styles.card}>
          <Input
            placeholder="Ajouter une compétence"
            value={skillInput}
            onChangeText={setSkillInput}
            returnKeyType="done"
            onSubmitEditing={addSkill}
            rightIcon="chevron-forward"
            onRightIconPress={addSkill}
          />
          {data.skills.length > 0 && (
            <View style={styles.chips}>
              {data.skills.map((skill) => (
                <View
                  key={skill}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: 'rgba(43, 108, 255, 0.14)',
                      borderColor: theme.colors.brand.primary,
                      borderRadius: theme.radius.full,
                    },
                  ]}
                >
                  <Text variant="caption" color={theme.colors.brand.primaryLight}>
                    {skill}
                  </Text>
                  <Pressable onPress={() => removeSkill(skill)} hitSlop={8}>
                    <Text variant="caption" color={theme.colors.text.muted}>
                      ✕
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </Card>
      </View>

      <PrimaryButton
        label="Générer mon CV"
        onPress={handleGenerate}
        disabled={!canGenerate}
        fullWidth
        size="lg"
        style={styles.generateBtn}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    gap: 12,
  },
  list: {
    gap: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  multiline: {
    minHeight: 80,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
  },
  generateBtn: {
    marginTop: 4,
  },
});
