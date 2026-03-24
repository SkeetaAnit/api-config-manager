import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Settings2, Server, Moon, Sun } from 'lucide-react';
import Editor from '@monaco-editor/react';

type Config = {
  id: string;
  name: string;
  content: string;
  isActive: boolean;
};

const initialConfigs: Config[] = [
  { 
    id: '1', 
    name: 'default', 
    content: '{\n  "apiKey": "sk-default-123456789",\n  "model": "gpt-4",\n  "baseUrl": "https://api.openai.com/v1"\n}', 
    isActive: true 
  },
  { 
    id: '2', 
    name: 'dev', 
    content: '{\n  "apiKey": "sk-dev-abcdefgh",\n  "model": "gpt-3.5-turbo",\n  "baseUrl": "https://dev.api.example.com",\n  "debug": true\n}', 
    isActive: false 
  },
  { 
    id: '3', 
    name: 'prod', 
    content: '{\n  "apiKey": "sk-prod-xyz98765",\n  "model": "gpt-4-turbo",\n  "baseUrl": "https://api.production.com",\n  "timeout": 5000\n}', 
    isActive: false 
  },
];

export default function App() {
  const [configs, setConfigs] = useState<Config[]>(initialConfigs);
  const [selectedId, setSelectedId] = useState<string>(initialConfigs[0].id);
  const [isDark, setIsDark] = useState(false);

  // Initialize dark mode based on system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const selectedConfig = configs.find(c => c.id === selectedId) || configs[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleAdd = () => {
    const newConfig: Config = {
      id: Date.now().toString(),
      name: 'New Config',
      content: '{\n  \n}',
      isActive: false,
    };
    setConfigs([...configs, newConfig]);
    setSelectedId(newConfig.id);
  };

  const handleDelete = (id: string) => {
    const newConfigs = configs.filter(c => c.id !== id);
    setConfigs(newConfigs);
    if (selectedId === id) {
      setSelectedId(newConfigs[0]?.id || '');
    }
  };

  const handleSwitchActive = (id: string) => {
    setConfigs(configs.map(c => ({
      ...c,
      isActive: c.id === id
    })));
  };

  const handleUpdateConfig = (id: string, updates: Partial<Config>) => {
    setConfigs(configs.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  return (
    <div className="h-screen w-full flex bg-white dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200 overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-50 dark:bg-[#18181b] border-r border-gray-200 dark:border-white/10 flex flex-col shrink-0">
        <div className="p-5 border-b border-gray-200 dark:border-white/10 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h1 className="font-semibold text-sm tracking-wide text-gray-700 dark:text-gray-300">API 配置管理</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {configs.map(config => (
            <div
              key={config.id}
              onClick={() => handleSelect(config.id)}
              className={`group relative w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedId === config.id 
                  ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <div className="w-2 flex justify-center shrink-0">
                  {config.isActive && (
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="当前使用中"></div>
                  )}
                </div>
                <Server className="w-4 h-4 opacity-70 shrink-0" />
                <span className="truncate">{config.name || '未命名配置'}</span>
              </div>
              
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Hover Actions */}
                <div className="hidden group-hover:flex items-center gap-1">
                  {!config.isActive && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSwitchActive(config.id); }}
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded"
                      title="设为当前配置"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(config.id); }}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded"
                    title="删除配置"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-white/10 flex flex-col gap-3">
          <button 
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white dark:bg-[#27272a] border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#3f3f46] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            添加新配置
          </button>
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            {isDark ? '切换亮色模式' : '切换暗黑模式'}
          </button>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-[#09090b] overflow-hidden">
        {selectedConfig ? (
          <>
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-white/50 dark:bg-[#09090b]/50 backdrop-blur-sm sticky top-0 z-10 shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {selectedConfig.name || '未命名配置'}
                </h2>
                {selectedConfig.isActive && (
                  <span className="px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium border border-green-200 dark:border-green-500/20 flex items-center gap-1">
                    <Check className="w-3 h-3" /> 当前使用中
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-gray-500">
                <Check className="w-3.5 h-3.5" />
                已自动保存
              </div>
            </div>

            {/* Form & Editor */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-8 py-4 border-b border-gray-200 dark:border-white/10 shrink-0">
                <div className="max-w-xl space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    配置名称
                  </label>
                  <input 
                    type="text" 
                    value={selectedConfig.name}
                    onChange={(e) => handleUpdateConfig(selectedConfig.id, { name: e.target.value })}
                    className="w-full px-4 py-2 bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 transition-all text-gray-900 dark:text-gray-100"
                    placeholder="例如: Production API"
                  />
                </div>
              </div>
              
              {/* Monaco Editor Container */}
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  defaultLanguage="json"
                  theme={isDark ? 'vs-dark' : 'light'}
                  value={selectedConfig.content}
                  onChange={(value) => handleUpdateConfig(selectedConfig.id, { content: value || '' })}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    formatOnPaste: true,
                    formatOnType: true,
                    scrollBeyondLastLine: false,
                    padding: { top: 16, bottom: 16 },
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                  }}
                  className="absolute inset-0"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600">
            <Settings2 className="w-12 h-12 mb-4 opacity-20" />
            <p>请选择或创建一个配置</p>
          </div>
        )}
      </div>
    </div>
  );
}
