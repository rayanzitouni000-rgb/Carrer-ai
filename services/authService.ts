import { careerProfileStore } from '@/services/careerProfileStore';
import { persistenceService } from '@/services/persistence';
import type { UserAccount, UserSession } from '@/types/userAccount';

function createId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export const authService = {
  async register(input: {
    email: string;
    password: string;
    firstName: string;
  }): Promise<{ success: true; account: UserAccount } | { success: false; error: string }> {
    const email = input.email.trim().toLowerCase();
    const password = input.password.trim();
    const firstName = input.firstName.trim();

    if (!firstName) {
      return { success: false, error: 'Le prénom est requis.' };
    }
    if (!isValidEmail(email)) {
      return { success: false, error: 'Veuillez saisir une adresse email valide.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' };
    }

    const existing = await persistenceService.getUserAccount();
    if (existing && existing.email === email) {
      return { success: false, error: 'Un compte existe déjà avec cet email.' };
    }

    const account: UserAccount = {
      id: createId(),
      email,
      password,
      firstName,
      createdAt: new Date().toISOString(),
    };

    await persistenceService.saveUserAccount(account);

    const profile = careerProfileStore.get();
    await persistenceService.saveCareerProfile({
      ...profile,
      firstName: firstName || profile.firstName,
      completedAt: profile.completedAt ?? new Date().toISOString(),
    });

    const session: UserSession = {
      userId: account.id,
      email: account.email,
      loggedInAt: new Date().toISOString(),
    };
    await persistenceService.saveSession(session);

    return { success: true, account };
  },

  async login(input: {
    email: string;
    password: string;
  }): Promise<{ success: true } | { success: false; error: string }> {
    const email = input.email.trim().toLowerCase();
    const password = input.password.trim();

    if (!isValidEmail(email)) {
      return { success: false, error: 'Veuillez saisir une adresse email valide.' };
    }

    const account = await persistenceService.getUserAccount();
    if (!account || account.email !== email || account.password !== password) {
      return { success: false, error: 'Email ou mot de passe incorrect.' };
    }

    const session: UserSession = {
      userId: account.id,
      email: account.email,
      loggedInAt: new Date().toISOString(),
    };
    await persistenceService.saveSession(session);

    return { success: true };
  },

  async logout(): Promise<void> {
    await persistenceService.clearSession();
  },

  async getCurrentAccount(): Promise<UserAccount | null> {
    const session = await persistenceService.getSession();
    if (!session) return null;
    const account = await persistenceService.getUserAccount();
    if (!account || account.id !== session.userId) return null;
    return account;
  },

  async isLoggedIn(): Promise<boolean> {
    const session = await persistenceService.getSession();
    return session !== null;
  },
};
