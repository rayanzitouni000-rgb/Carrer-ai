import { Href, Redirect } from 'expo-router';

/** Redirection legacy — l'entretien est désormais un onglet principal. */
export default function InterviewRedirect() {
  return <Redirect href={'/(tabs)/interview-simulator' as Href} />;
}
