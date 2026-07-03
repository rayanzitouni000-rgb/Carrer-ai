import { supabase } from '@/lib/supabaseClient';
import { isCloudSyncApplyingRemote, scheduleCloudPush } from '@/services/cloudSyncService';

export function notifyCloudDataChanged(): void {
  if (isCloudSyncApplyingRemote()) return;
  void supabase.auth.getSession().then(({ data }) => {
    const userId = data.session?.user?.id;
    if (userId) scheduleCloudPush(userId);
  });
}
