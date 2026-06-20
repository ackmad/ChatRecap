# 🚀 Implementation Guide - New Features

## ✨ Fitur Baru yang Ditambahkan

### 1. **Manual API Key Input** 🔑
- User bisa memasukkan API Key sendiri melalui UI
- Support multiple API keys (dipisah per baris)
- Runtime update tanpa perlu restart aplikasi

### 2. **Instagram JSON Support** 📱
- Parse chat dari Instagram JSON export
- Merge dengan WhatsApp untuk analisis gabungan
- Metadata lengkap (platform, jumlah pesan, dll)

### 3. **Reading Strategy Options** 📖
- **Full Analysis**: Baca semua pesan (paling akurat, token tinggi)
- **Smart Sampling**: Baca awal, tengah, akhir (balance)
- **Key Moments**: Fokus momen penting saja
- **Extreme Light**: Super hemat token

---

## 📦 File Baru yang Dibuat

### 1. `components/SettingsModal.tsx`
Modal untuk:
- Input API Keys (multiple)
- Pilih Reading Strategy
- Lihat estimasi token usage

### 2. `utils/instagramParser.ts`
Utility functions:
- `parseInstagramJSON()` - Parse Instagram JSON
- `mergeMessages()` - Merge WhatsApp + Instagram
- `getConversationMetadata()` - Info gabungan

### 3. `constants.ts` (Updated)
- `GEMINI_MODELS` - Array model prioritas
- `ReadingStrategy` - Type definition
- `READING_STRATEGY_CONFIG` - Config per strategy

### 4. `services/geminiService.ts` (Updated)
- `setRuntimeApiKeys()` - Set API keys runtime
- `getRuntimeApiKeys()` - Get current API keys
- `analyzeChatWithGemini()` - Support strategy & custom keys
- `formatChatForPrompt()` - Flexible formatting
- `detectKeyMoments()` - Key moments detection

---

## 🔧 Cara Integrasikan ke App.tsx

### Step 1: Import Dependencies

```tsx
import { SettingsModal, ReadingStrategy } from './components/SettingsModal';
import { parseInstagramJSON, mergeMessages, getConversationMetadata } from './utils/instagramParser';
import { setRuntimeApiKeys, getRuntimeApiKeys } from './services/geminiService';
import { Settings } from 'lucide-react';
```

### Step 2: Add State Management

```tsx
const [showSettings, setShowSettings] = useState(false);
const [readingStrategy, setReadingStrategy] = useState<ReadingStrategy>('smart-sampling');
const [customApiKeys, setCustomApiKeys] = useState<string[]>([]);
const [instagramMessages, setInstagramMessages] = useState<Message[]>([]);
const [isMultiPlatform, setIsMultiPlatform] = useState(false);
```

### Step 3: Add Settings Button (di UI upload page)

```tsx
<button
  onClick={() => setShowSettings(true)}
  className="fixed top-4 right-4 p-3 rounded-full bg-purple-500 text-white shadow-lg hover:bg-purple-600"
  title="Settings"
>
  <Settings size={20} />
</button>

<SettingsModal
  isOpen={showSettings}
  onClose={() => setShowSettings(false)}
  onSave={(keys, strategy) => {
    setCustomApiKeys(keys);
    setReadingStrategy(strategy);
    setRuntimeApiKeys(keys);
    localStorage.setItem('apiKeys', JSON.stringify(keys));
    localStorage.setItem('readingStrategy', strategy);
  }}
  currentApiKeys={customApiKeys}
  currentStrategy={readingStrategy}
/>
```

### Step 4: Load Settings from LocalStorage

```tsx
useEffect(() => {
  const savedKeys = localStorage.getItem('apiKeys');
  const savedStrategy = localStorage.getItem('readingStrategy');
  
  if (savedKeys) {
    const keys = JSON.parse(savedKeys);
    setCustomApiKeys(keys);
    setRuntimeApiKeys(keys);
  }
  
  if (savedStrategy) {
    setReadingStrategy(savedStrategy as ReadingStrategy);
  }
}, []);
```

### Step 5: Add Instagram Upload Handler

```tsx
const handleInstagramUpload = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const jsonContent = e.target?.result as string;
      const igMessages = parseInstagramJSON(jsonContent);
      
      setInstagramMessages(igMessages);
      setIsMultiPlatform(messages.length > 0); // If WA already uploaded
      
      alert(`✅ ${igMessages.length} pesan Instagram berhasil diimport!`);
    } catch (error) {
      alert(`❌ Gagal membaca Instagram JSON: ${error.message}`);
    }
  };
  reader.readAsText(file);
};
```

### Step 6: Update Analysis Function Call

```tsx
const handleAnalyze = async () => {
  setCurrentStatus('analyzing');
  setStatusMessage('Memulai analisis...');

  try {
    // Merge messages if multi-platform
    let messagesToAnalyze = messages;
    if (isMultiPlatform && instagramMessages.length > 0) {
      messagesToAnalyze = mergeMessages(messages, instagramMessages);
      const metadata = getConversationMetadata(messages, instagramMessages);
      
      setStatusMessage(`
        📊 Menganalisis ${metadata.totalMessages} pesan dari ${metadata.platforms.join(' + ')}
      `);
    }

    // Call with custom parameters
    const result = await analyzeChatWithGemini(
      messagesToAnalyze,
      setStatusMessage,
      readingStrategy,
      customApiKeys.length > 0 ? customApiKeys : undefined
    );

    setAnalysisResult(result);
    setCurrentStatus('results');
  } catch (error) {
    setCurrentStatus('error');
    setStatusMessage(error.userMsg || error.message);
  }
};
```

### Step 7: Update UI untuk Multiple Upload

```tsx
<div className="space-y-4">
  {/* WhatsApp Upload */}
  <div className="border-2 border-dashed rounded-xl p-6">
    <h3 className="font-bold mb-2">📱 WhatsApp Chat</h3>
    <input
      type="file"
      accept=".txt"
      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
      className="block w-full"
    />
    {messages.length > 0 && (
      <p className="text-sm text-green-600 mt-2">
        ✅ {messages.length} pesan WhatsApp loaded
      </p>
    )}
  </div>

  {/* Instagram Upload */}
  <div className="border-2 border-dashed rounded-xl p-6">
    <h3 className="font-bold mb-2">💬 Instagram Chat (Optional)</h3>
    <input
      type="file"
      accept=".json"
      onChange={(e) => e.target.files?.[0] && handleInstagramUpload(e.target.files[0])}
      className="block w-full"
    />
    {instagramMessages.length > 0 && (
      <p className="text-sm text-green-600 mt-2">
        ✅ {instagramMessages.length} pesan Instagram loaded
      </p>
    )}
    <p className="text-xs text-gray-500 mt-2">
      Format: message_1.json dari Instagram Data Download
    </p>
  </div>
</div>
```

---

## 🎨 UI Enhancement - Display Current Settings

```tsx
<div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
  <h4 className="font-semibold mb-2">⚙️ Current Settings</h4>
  <div className="space-y-1 text-sm">
    <p>
      🔑 API Keys: <span className="font-mono">{customApiKeys.length || 'Using .env'}</span>
    </p>
    <p>
      📖 Strategy: <span className="font-semibold capitalize">{readingStrategy.replace('-', ' ')}</span>
    </p>
    {isMultiPlatform && (
      <p className="text-purple-600 font-semibold">
        🌐 Multi-Platform Analysis Active
      </p>
    )}
  </div>
</div>
```

---

## 🧪 Testing Checklist

- [ ] Settings modal terbuka dan menutup dengan benar
- [ ] API Keys tersimpan di localStorage
- [ ] Reading Strategy tersimpan di localStorage
- [ ] Instagram JSON ter-parse dengan benar
- [ ] Merge WhatsApp + Instagram berfungsi
- [ ] Analisis berjalan dengan custom API keys
- [ ] Fallback ke .env jika no custom keys
- [ ] Model fallback berfungsi (coba 5 model)
- [ ] Error handling untuk invalid JSON
- [ ] Token usage berbeda per strategy

---

## 📚 API Key Acquisition Guide

Tambahkan ke UI Help/Info:

```markdown
### Cara Mendapatkan API Key Gemini

1. Buka: https://aistudio.google.com/app/apikey
2. Login dengan akun Google
3. Klik "Create API Key"
4. Copy API key (format: AQ.Ab... atau AIza...)
5. Paste ke Settings
6. (Optional) Tambah 2-3 keys untuk backup

### Format Instagram JSON

1. Buka Instagram > Settings > Privacy & Security
2. "Download Your Information"
3. Request JSON format
4. Extract file: messages/inbox/[username]/message_1.json
5. Upload file tersebut
```

---

## 🚀 Performance Tips

### Token Usage Estimates

| Strategy | Token Usage | Best For |
|----------|-------------|----------|
| Full | ~50,000+ | Analisis mendalam, banyak API keys |
| Smart Sampling | ~20,000 | Balance (RECOMMENDED) |
| Key Moments | ~10,000 | Quick insights |
| Extreme Light | ~5,000 | Testing, limited quota |

### Recommended API Key Setup

- **1 API Key**: Use Extreme Light or Key Moments
- **2 API Keys**: Use Smart Sampling (default)
- **3+ API Keys**: Safe untuk Full Analysis

---

## 🔄 Future Enhancements

- [ ] Telegram JSON support
- [ ] Facebook Messenger support
- [ ] Export settings as JSON
- [ ] API key validation before save
- [ ] Real-time token usage display
- [ ] Strategy recommendation based on message count

---

## 📝 Notes

- Settings disimpan di localStorage (persist between sessions)
- Runtime API keys prioritas lebih tinggi dari .env
- Instagram timestamp dalam milliseconds
- Merge messages by chronological order
- Key moments detection: question marks, exclamation, emoji, length

