import React, { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';
import { sdkSnippets } from '../data/portalData';
import { useToast } from '../context/ToastContext';

export const SdkWorkbench: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('py');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const currentSnippet = sdkSnippets.find((s) => s.id === activeTab) || sdkSnippets[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.rawCode).then(() => {
      setCopied(true);
      showToast(`${currentSnippet.language} 示例代码已复制到剪贴板`);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="ide" aria-label="多语言 SDK 工作台">
      <div className="container">
        <div className="section-header-block">
          <div className="section-tag">
            <Code2 size={14} style={{ marginRight: 4 }} />
            多语言原生 SDK
          </div>
          <h2 className="section-title">5 行代码，快速开启端侧推理</h2>
          <p className="section-description">
            提供 Python、C++、Android (Kotlin)、iOS (Swift) 与 Web (JavaScript) 官方原生 SDK。
          </p>
        </div>

        <div className="ide-workbench-box">
          <div className="ide-tab-bar">
            <div className="ide-file-tabs" role="tablist" aria-label="SDK 语言选项卡">
              {sdkSnippets.map((snippet) => (
                <button
                  key={snippet.id}
                  role="tab"
                  aria-selected={activeTab === snippet.id}
                  className={`ide-file-tab ${activeTab === snippet.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(snippet.id)}
                >
                  <Code2 size={14} />
                  <span>{snippet.filename}</span>
                </button>
              ))}
            </div>

            <button
              className="btn-code-copy-flat"
              onClick={handleCopy}
              aria-label="复制当前 SDK 代码"
              title="复制代码"
            >
              {copied ? <Check size={12} strokeWidth={2.5} color="#34d399" /> : <Copy size={12} />}
              <span>{copied ? '已复制' : '复制代码'}</span>
            </button>
          </div>

          <div className="ide-content-panel active">
            <pre className="editor-pre" tabIndex={0} aria-label={`${currentSnippet.language} 代码示例`}>
              <code dangerouslySetInnerHTML={{ __html: currentSnippet.codeHtml }} />
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

