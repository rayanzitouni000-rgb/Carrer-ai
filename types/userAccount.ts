export interface UserAccount {
  id: string;
  email: string;
  /** Mock local only — replace with secure auth in production */
  password: string;
  firstName: string;
  createdAt: string;
}

export interface UserSession {
  userId: string;
  email: string;
  loggedInAt: string;
}

export const EMPTY_USER_ACCOUNT: UserAccount = {
  id: '',
  email: '',
  password: '',
  firstName: '',
  createdAt: '',
};
