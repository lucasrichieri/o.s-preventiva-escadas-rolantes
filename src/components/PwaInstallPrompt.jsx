import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, WifiOff, CheckCircle } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Detect if already installed / running in standalone mode
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    setIsStandalone(checkStandalone);

    // Listen for install prompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Network status listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Para instalar no iOS: toque no botão Compartilhar do Safari e selecione "Adicionar à Tela de Início".');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {/* Offline Status Alert */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs font-bold px-4 py-2 text-center flex items-center justify-center gap-2 shadow-md sticky top-0 z-50 animate-pulse">
          <WifiOff className="w-4 h-4" />
          <span>Modo Offline: Você está sem internet. O aplicativo continua funcionando normalmente!</span>
        </div>
      )}

      {/* Floating Install Banner for Mobile & Desktop */}
      {isInstallable && !dismissed && !isStandalone && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-slate-900 border-2 border-purple-500/80 rounded-2xl p-4 shadow-2xl backdrop-blur-lg flex items-center justify-between gap-3 animate-bounce-short">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-800 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white">Instalar App TKE no Celular</h4>
              <p className="text-[11px] text-slate-300">Acesse rápido da tela inicial e use mesmo sem sinal.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="tke-btn-gradient px-3.5 py-2 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" /> Instalar
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
