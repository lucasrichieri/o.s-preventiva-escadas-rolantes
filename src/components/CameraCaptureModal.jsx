import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, X, Check, AlertCircle, FlipHorizontal, Sparkles } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

export default function CameraCaptureModal({
  isOpen,
  onClose,
  onCapture,
  itemCode,
  itemDescription
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const nativeCameraInputRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (traseira) | 'user' (frontal/webcam)
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [flashEffect, setFlashEffect] = useState(false);

  // Parar streaming de vídeo ao desmontar ou fechar
  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Inicializar câmera ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setCapturedPhoto(null);
      setErrorMessage('');
      startCamera();
      loadDevices();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
  }, [isOpen, facingMode, selectedDeviceId]);

  // Listar dispositivos de vídeo disponíveis
  const loadDevices = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoInputs);
    } catch (err) {
      console.warn('Não foi possível listar dispositivos de vídeo:', err);
    }
  };

  // Iniciar stream da câmera
  const startCamera = async () => {
    setIsLoading(true);
    setErrorMessage('');
    stopStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('Seu navegador não suporta acesso direto à câmera. Use o botão de câmera nativa abaixo.');
      setIsLoading(false);
      return;
    }

    try {
      const constraints = {
        video: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
          : { facingMode: { ideal: facingMode }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Permissão de acesso à câmera negada. Por favor, autorize o acesso nas configurações do navegador.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('Nenhuma câmera ou webcam detectada neste dispositivo.');
      } else {
        setErrorMessage(`Falha ao iniciar a câmera: ${err.message || 'Erro desconhecido'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Alternar entre câmera frontal e traseira
  const handleToggleFacingMode = () => {
    setSelectedDeviceId('');
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Disparar captura da foto
  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    // Disparar efeito visual de flash
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    // Se for câmera frontal, espelhar para visual natural
    if (facingMode === 'user' && !selectedDeviceId) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, width, height);

    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPhoto(photoDataUrl);
    stopStream();
  };

  // Confirmar foto capturada
  const handleConfirmPhoto = async () => {
    if (!capturedPhoto) return;

    try {
      // Converter Data URL para File / Blob para passar pelo compressor
      const res = await fetch(capturedPhoto);
      const blob = await res.blob();
      const file = new File([blob], `camera_${itemCode || 'foto'}_${Date.now()}.jpg`, { type: 'image/jpeg' });

      const compressedBase64 = await compressImage(file, 800, 600, 0.75);
      onCapture?.(compressedBase64);
      onClose();
    } catch (err) {
      console.error('Erro ao processar foto:', err);
      onCapture?.(capturedPhoto);
      onClose();
    }
  };

  // Fallback para câmera nativa via input file
  const handleNativeCapture = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedBase64 = await compressImage(file, 800, 600, 0.75);
      onCapture?.(compressedBase64);
      onClose();
    } catch (err) {
      console.error('Erro ao processar captura nativa:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Canvas invisível para snapshot */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Input nativo oculto para fallback */}
      <input
        type="file"
        ref={nativeCameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleNativeCapture}
        className="hidden"
      />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header do Modal */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-white z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-600 rounded-lg text-white">
              <Camera className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Capturar Foto — Câmera / Webcam
                {itemCode && (
                  <span className="bg-purple-900/70 border border-purple-400 text-purple-200 text-xs px-2 py-0.5 rounded font-mono font-bold">
                    {itemCode}
                  </span>
                )}
              </h3>
              {itemDescription && (
                <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs sm:max-w-md">
                  {itemDescription}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport da Câmera ou Preview da Foto */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[320px] sm:min-h-[420px]">
          {/* Efeito de Flash na Captura */}
          {flashEffect && (
            <div className="absolute inset-0 bg-white z-30 animate-pulse pointer-events-none" />
          )}

          {capturedPhoto ? (
            /* Foto Capturada (Revisão) */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-2">
              <img
                src={capturedPhoto}
                alt="Foto Capturada"
                className="max-h-[55vh] w-auto max-w-full object-contain rounded-lg border border-slate-700 shadow-lg"
              />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-emerald-400 border border-emerald-500/40 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-md">
                <Check className="w-3.5 h-3.5" /> Foto Capturada
              </div>
            </div>
          ) : (
            /* Stream da Câmera ao Vivo */
            <div className="relative w-full h-full flex items-center justify-center">
              {errorMessage ? (
                <div className="p-6 text-center max-w-md">
                  <div className="w-12 h-12 rounded-full bg-red-900/50 border border-red-500 text-red-400 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200 mb-2">{errorMessage}</p>
                  <p className="text-xs text-slate-400 mb-5">
                    Você pode tentar novamente ou acionar a câmera nativa do seu dispositivo pelo botão abaixo.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-600"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Tentar Novamente
                    </button>
                    <button
                      type="button"
                      onClick={() => nativeCameraInputRef.current?.click()}
                      className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                    >
                      <Camera className="w-3.5 h-3.5" /> Abrir Câmera Nativa
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full max-h-[60vh] object-cover sm:object-contain ${
                      facingMode === 'user' && !selectedDeviceId ? '-scale-x-100' : ''
                    }`}
                  />

                  {/* Grid / Mira do Visor (HUD) */}
                  <div className="absolute inset-4 pointer-events-none border border-white/20 rounded-xl">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500" />
                  </div>

                  {/* Indicador de Modo / Câmera Ativa */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-slate-200 text-[11px] px-2.5 py-1 rounded-md border border-white/10 font-mono font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    {facingMode === 'environment' ? 'Câmera Traseira / Ambiente' : 'Câmera Frontal / Webcam'}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Barra de Controles e Ações */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-white flex flex-col gap-3">
          {/* Seletor de Câmeras se houver mais de uma */}
          {devices.length > 1 && !capturedPhoto && (
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 font-medium shrink-0">Dispositivo de Vídeo:</span>
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-purple-500 max-w-[260px] truncate"
              >
                <option value="">Automático ({facingMode === 'environment' ? 'Traseira' : 'Frontal'})</option>
                {devices.map((device, index) => (
                  <option key={device.deviceId || index} value={device.deviceId}>
                    {device.label || `Câmera ${index + 1}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex items-center justify-between gap-3">
            {capturedPhoto ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setCapturedPhoto(null);
                    startCamera();
                  }}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
                >
                  <RefreshCw className="w-4 h-4" /> Tirar Outra Foto
                </button>

                <button
                  type="button"
                  onClick={handleConfirmPhoto}
                  className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950"
                >
                  <Check className="w-4 h-4" /> Confirmar e Anexar
                </button>
              </>
            ) : (
              <>
                {/* Botão de Alternar Câmera / Inverter */}
                <button
                  type="button"
                  onClick={handleToggleFacingMode}
                  disabled={isLoading || !!errorMessage}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold disabled:opacity-50"
                  title="Alternar entre câmera frontal e traseira"
                >
                  <FlipHorizontal className="w-4 h-4 text-orange-400" />
                  <span className="hidden sm:inline">Trocar Câmera</span>
                </button>

                {/* Botão Principal de Disparo */}
                <button
                  type="button"
                  onClick={handleTakePhoto}
                  disabled={isLoading || !!errorMessage || !stream}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-950 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  </div>
                  Capturar Foto Agora
                </button>

                {/* Fallback de Câmera Nativa */}
                <button
                  type="button"
                  onClick={() => nativeCameraInputRef.current?.click()}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  title="Abrir câmera nativa do sistema operacional"
                >
                  <Camera className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">Câmera Nativa</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
