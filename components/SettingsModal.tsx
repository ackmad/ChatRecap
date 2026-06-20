import React, { useState, useEffect } from 'react';

export type ReadingStrategy = 'full' | 'smart-sampling' | 'key-moments' | 'extreme-light';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKeys: string[], strategy: ReadingStrategy) => void;
  currentApiKeys: string[];
  currentStrategy: ReadingStrategy;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentApiKeys,
  currentStrategy
}) => {
  const [apiKeysInput, setApiKeysInput] = useState<string>('');
  const [strategy, setStrategy] = useState<ReadingStrategy>(currentStrategy);

  useEffect(() => {
    setApiKeysInput(currentApiKeys.join('\n'));
    setStrategy(currentStrategy);
  }, [currentApiKeys, currentStrategy, isOpen]);

  const handleSave = () => {
    const keys = apiKeysInput
      .split('\n')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    if (keys.length === 0) {
      alert('Minimal masukkan 1 API Key!');
      return;
    }

    onSave(keys, strategy);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-t-2xl">
          <h2 className="text-2xl font-bold">⚙️ Pengaturan Analisis</h2>
          <p className="text-sm opacity-90 mt-1">Konfigurasi API Key dan strategi membaca chat</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* API Keys Section */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-2">
              🔑 API Keys (Gemini AI)
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Masukkan API key Gemini Anda. Satu baris = satu key. Bisa lebih dari 1 untuk backup otomatis.
            </p>
            <textarea
              value={apiKeysInput}
              onChange={(e) => setApiKeysInput(e.target.value)}
              placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&#10;AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY&#10;AIzaSyZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ"
              className="w-full h-32 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white
                       focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none
                       font-mono text-sm resize-none"
            />
            <div className="flex items-start gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>💡</span>
              <p>
                <strong>Cara dapat API Key:</strong> Buka{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-500 hover:underline"
                >
                  aistudio.google.com/app/apikey
                </a>
                {' '}→ Create API Key → Copy → Paste di sini
              </p>
            </div>
          </div>

          {/* Reading Strategy Section */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 dark:text-white mb-2">
              📖 Strategi Membaca Chat
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Pilih bagaimana AI membaca chat Anda. Semakin lengkap = lebih akurat, tapi butuh token lebih banyak.
            </p>

            <div className="space-y-3">
              {/* Full Analysis */}
              <label className={`
                flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer
                ${strategy === 'full' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                }
              `}>
                <input
                  type="radio"
                  name="strategy"
                  value="full"
                  checked={strategy === 'full'}
                  onChange={(e) => setStrategy(e.target.value as ReadingStrategy)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🔥</span>
                    <h3 className="font-bold text-gray-800 dark:text-white">Full Analysis (Paling Akurat)</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI membaca SEMUA chat dari awal sampai akhir. Hasil paling detail dan akurat.
                  </p>
                  <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Token Usage: <strong>TINGGI</strong> | Butuh: 2-3 API Keys backup</span>
                  </div>
                </div>
              </label>

              {/* Smart Sampling */}
              <label className={`
                flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer
                ${strategy === 'smart-sampling' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                }
              `}>
                <input
                  type="radio"
                  name="strategy"
                  value="smart-sampling"
                  checked={strategy === 'smart-sampling'}
                  onChange={(e) => setStrategy(e.target.value as ReadingStrategy)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">✨</span>
                    <h3 className="font-bold text-gray-800 dark:text-white">Smart Sampling (Rekomendasi)</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI membaca bagian Awal, Tengah, dan Akhir chat. Balance antara akurasi dan efisiensi.
                  </p>
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <span>✅</span>
                    <span>Token Usage: <strong>SEDANG</strong> | Butuh: 1-2 API Keys</span>
                  </div>
                </div>
              </label>

              {/* Key Moments Only */}
              <label className={`
                flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer
                ${strategy === 'key-moments' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                }
              `}>
                <input
                  type="radio"
                  name="strategy"
                  value="key-moments"
                  checked={strategy === 'key-moments'}
                  onChange={(e) => setStrategy(e.target.value as ReadingStrategy)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">⚡</span>
                    <h3 className="font-bold text-gray-800 dark:text-white">Key Moments Only (Cepat)</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI fokus pada momen-momen penting saja (perubahan mood, konflik, momen spesial).
                  </p>
                  <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <span>💨</span>
                    <span>Token Usage: <strong>RENDAH</strong> | Butuh: 1 API Key cukup</span>
                  </div>
                </div>
              </label>

              {/* Extreme Light */}
              <label className={`
                flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer
                ${strategy === 'extreme-light' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                }
              `}>
                <input
                  type="radio"
                  name="strategy"
                  value="extreme-light"
                  checked={strategy === 'extreme-light'}
                  onChange={(e) => setStrategy(e.target.value as ReadingStrategy)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🪶</span>
                    <h3 className="font-bold text-gray-800 dark:text-white">Extreme Light (Hemat Banget)</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    AI hanya membaca ringkasan super singkat. Untuk testing atau quota terbatas.
                  </p>
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <span>🔋</span>
                    <span>Token Usage: <strong>MINIMAL</strong> | Butuh: 1 API Key cukup</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 px-6 py-4 rounded-b-2xl flex gap-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 
                     text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 
                     transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 
                     text-white font-semibold hover:shadow-lg"
          >
            💾 Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};
