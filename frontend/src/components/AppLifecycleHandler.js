'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { App } from '@capacitor/app';

export default function AppLifecycleHandler() {
  const router = useRouter();

  useEffect(() => {
    let listenerHandle = null;

    const setupListener = async () => {
      try {
        listenerHandle = await App.addListener('appRestoredResult', (result) => {
          console.log('[AppLifecycle] Restored plugin result:', result);
          if (
            result?.pluginId === 'Camera' &&
            result?.methodName === 'getPhoto' &&
            result?.success &&
            result?.data
          ) {
            const photo = result.data;
            const targetPath = photo.webPath || photo.path || photo.dataUrl;
            if (targetPath) {
              console.log('[AppLifecycle] Recovered camera photo after OS pause:', targetPath);
              sessionStorage.setItem('transformai_restored_photo_uri', targetPath);
              router.push('/capture?mode=camera&restored=1');
            }
          }
        });
      } catch (e) {
        console.warn('[AppLifecycle] App plugin listener warning:', e);
      }
    };

    setupListener();

    return () => {
      if (listenerHandle && listenerHandle.remove) {
        listenerHandle.remove();
      }
    };
  }, [router]);

  return null;
}
