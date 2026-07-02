import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AiFormSelect } from './AiFormSelect';
import { Input } from '@/design-system';
import {
  SPECIALITES_BTS,
  SPECIALITES_BUT,
  TYPES_BAC_PLUS_2,
} from '@/features/career-onboarding/data/bacPlus2Data';
import {
  CLASSES_LYCEE,
  FILIERES_BAC,
  SERIES_TECHNO,
  SPECIALITES_BAC_GENERAL,
} from '@/features/career-onboarding/data/lyceenData';
import {
  NIVEAUX_ETUDES,
  NIVEAUX_GRANDE_ECOLE,
  TYPES_CONTRAT_ALTERNANCE,
} from '@/features/career-onboarding/data/niveauEtudesData';
import { SECTEURS_ACTIVITE } from '@/features/career-onboarding/data/secteurActiviteData';
import type { CurrentSituation } from '@/features/career-onboarding/types';
import type { SituationDetails } from '@/types/onboarding';

interface ConditionalSituationFieldsProps {
  situationId: CurrentSituation | null;
  details: SituationDetails;
  onChange: (details: Partial<SituationDetails>) => void;
}

function RevealField({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(220).springify()}
      style={styles.field}
    >
      {children}
    </Animated.View>
  );
}

function isMasterNiveauEtudes(niveau?: string) {
  return niveau === 'm1' || niveau === 'm2';
}

function isMasterGrandeEcole(niveau?: string) {
  return niveau === 'master1-ecole' || niveau === 'master2-ecole';
}

export function ConditionalSituationFields({
  situationId,
  details,
  onChange,
}: ConditionalSituationFieldsProps) {
  if (!situationId) return null;

  switch (situationId) {
    case 'lyceen':
      return (
        <View style={styles.group}>
          <RevealField>
            <AiFormSelect
              mode="single"
              label="Ma classe"
              options={CLASSES_LYCEE}
              selectedId={details.classe ?? null}
              onSelect={(id) =>
                onChange({
                  classe: id as SituationDetails['classe'],
                  filiere: undefined,
                  specialites: undefined,
                  serieTechno: undefined,
                  filiereProLibre: undefined,
                })
              }
            />
          </RevealField>

          {details.classe ? (
            <RevealField delay={40}>
              <AiFormSelect
                mode="single"
                label="Ma filière"
                options={FILIERES_BAC}
                selectedId={details.filiere ?? null}
                onSelect={(id) =>
                  onChange({
                    filiere: id as SituationDetails['filiere'],
                    specialites: undefined,
                    serieTechno: undefined,
                    filiereProLibre: undefined,
                  })
                }
              />
            </RevealField>
          ) : null}

          {details.filiere === 'general' ? (
            <RevealField delay={80}>
              <AiFormSelect
                mode="multi"
                label="Mes spécialités"
                options={SPECIALITES_BAC_GENERAL}
                selectedIds={details.specialites ?? []}
                onToggle={(id) => {
                  const current = details.specialites ?? [];
                  const updated = current.includes(id)
                    ? current.filter((item) => item !== id)
                    : [...current, id];
                  onChange({ specialites: updated });
                }}
                maxSelection={3}
              />
            </RevealField>
          ) : null}

          {details.filiere === 'techno' ? (
            <RevealField delay={80}>
              <AiFormSelect
                mode="single"
                label="Ma série"
                options={SERIES_TECHNO}
                selectedId={details.serieTechno ?? null}
                onSelect={(id) => onChange({ serieTechno: id })}
              />
            </RevealField>
          ) : null}

          {details.filiere === 'pro' ? (
            <RevealField delay={80}>
              <Input
                label="Ma filière professionnelle"
                placeholder="Ex. Bac Pro Commerce, Bac Pro Systèmes Numériques..."
                value={details.filiereProLibre ?? ''}
                onChangeText={(filiereProLibre) => onChange({ filiereProLibre })}
              />
            </RevealField>
          ) : null}
        </View>
      );

    case 'bac2':
      return (
        <View style={styles.group}>
          <RevealField>
            <AiFormSelect
              mode="single"
              label="BTS ou BUT ?"
              options={TYPES_BAC_PLUS_2}
              selectedId={details.typeBacPlus2 ?? null}
              onSelect={(id) =>
                onChange({
                  typeBacPlus2: id as SituationDetails['typeBacPlus2'],
                  specialiteBacPlus2: undefined,
                  specialiteBacPlus2Libre: undefined,
                })
              }
            />
          </RevealField>

          {details.typeBacPlus2 ? (
            <RevealField delay={40}>
              <AiFormSelect
                mode="single"
                label="Ma spécialité"
                options={details.typeBacPlus2 === 'bts' ? SPECIALITES_BTS : SPECIALITES_BUT}
                selectedId={details.specialiteBacPlus2 ?? null}
                onSelect={(id) =>
                  onChange({
                    specialiteBacPlus2: id,
                    specialiteBacPlus2Libre: undefined,
                  })
                }
                searchable
              />
            </RevealField>
          ) : null}

          {details.specialiteBacPlus2 === 'autre-bts' ? (
            <RevealField delay={80}>
              <Input
                label="Précise ta spécialité"
                placeholder="Ex. BTS Notariat"
                value={details.specialiteBacPlus2Libre ?? ''}
                onChangeText={(specialiteBacPlus2Libre) =>
                  onChange({ specialiteBacPlus2Libre })
                }
              />
            </RevealField>
          ) : null}
        </View>
      );

    case 'etudiant':
      return (
        <View style={styles.group}>
          <RevealField>
            <AiFormSelect
              mode="single"
              label="Mon niveau"
              options={NIVEAUX_ETUDES}
              selectedId={details.niveauEtudes ?? null}
              onSelect={(id) =>
                onChange({
                  niveauEtudes: id,
                  masterSpecialite: isMasterNiveauEtudes(id)
                    ? details.masterSpecialite
                    : undefined,
                })
              }
            />
          </RevealField>

          {isMasterNiveauEtudes(details.niveauEtudes) ? (
            <RevealField delay={40}>
              <Input
                label="Spécialité de mon Master (optionnel)"
                placeholder="Ex. Master Informatique - Intelligence Artificielle"
                value={details.masterSpecialite ?? ''}
                onChangeText={(masterSpecialite) => onChange({ masterSpecialite })}
              />
            </RevealField>
          ) : null}
        </View>
      );

    case 'etudiant-grande-ecole':
      return (
        <View style={styles.group}>
          <RevealField>
            <AiFormSelect
              mode="single"
              label="Mon niveau"
              options={NIVEAUX_GRANDE_ECOLE}
              selectedId={details.niveauGrandeEcole ?? null}
              onSelect={(id) =>
                onChange({
                  niveauGrandeEcole: id,
                  masterSpecialite: isMasterGrandeEcole(id)
                    ? details.masterSpecialite
                    : undefined,
                })
              }
            />
          </RevealField>

          {isMasterGrandeEcole(details.niveauGrandeEcole) ? (
            <RevealField delay={40}>
              <Input
                label="Spécialité de mon Master (optionnel)"
                placeholder="Ex. Master Finance, Master Marketing Digital..."
                value={details.masterSpecialite ?? ''}
                onChangeText={(masterSpecialite) => onChange({ masterSpecialite })}
              />
            </RevealField>
          ) : null}
        </View>
      );

    case 'alternant':
      return (
        <View style={styles.group}>
          <RevealField>
            <AiFormSelect
              mode="single"
              label="Mon niveau"
              options={NIVEAUX_ETUDES}
              selectedId={details.niveauEtudes ?? null}
              onSelect={(id) => onChange({ niveauEtudes: id })}
            />
          </RevealField>
          <RevealField delay={40}>
            <AiFormSelect
              mode="single"
              label="Type de contrat"
              options={TYPES_CONTRAT_ALTERNANCE}
              selectedId={details.typeContratAlternance ?? null}
              onSelect={(id) =>
                onChange({
                  typeContratAlternance: id as SituationDetails['typeContratAlternance'],
                })
              }
            />
          </RevealField>
        </View>
      );

    case 'en-poste':
    case 'freelance':
      return (
        <RevealField>
          <AiFormSelect
            mode="single"
            label="Secteur d'activité"
            options={SECTEURS_ACTIVITE}
            selectedId={details.secteurActivite ?? null}
            onSelect={(id) => onChange({ secteurActivite: id })}
          />
        </RevealField>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  group: {
    gap: 16,
  },
  field: {
    gap: 0,
  },
});
