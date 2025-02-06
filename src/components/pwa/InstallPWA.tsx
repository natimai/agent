import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } catch (error) {
      console.error('התרחשה שגיאה בתהליך ההתקנה:', error);
    }
  };

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex flex-col items-start">
        <h3 className="text-lg font-semibold mb-2">התקן את האפליקציה</h3>
        <p className="text-sm text-gray-600 mb-3">
          התקן את האפליקציה למסך הבית שלך לגישה מהירה ונוחה יותר
        </p>
        <div className="flex space-x-2">
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            התקן עכשיו
          </button>
          <button
            onClick={() => setIsInstallable(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            אחר כך
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA; 