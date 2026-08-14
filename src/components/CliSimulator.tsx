import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { cliCommands } from '../data/portalData';
import { useToast } from '../context/ToastContext';

interface HistoryItem {
  id: number;
  cmd: string;
  output: string;
}

export const CliSimulator: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 1,
      cmd: cliCommands.help.cmd,
      output: cliCommands.help.output
    }
  ]);
  const termBodyRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const runCmd = (key: keyof typeof cliCommands) => {
    const item = cliCommands[key];
    if (!item) return;
    setHistory((prev) => [
      ...prev,
      {
        id: Date.now(),
        cmd: item.cmd,
        output: item.output
      }
    ]);
  };

  const clearTerm = () => {
    setHistory([]);
    showToast('终端输出已清空');
  };

  useEffect(() => {
    if (termBodyRef.current) {
      termBodyRef.current.scrollTop = termBodyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <section id="cli" aria-label="CLI 命令行模拟器">
      <div className="container">
        <div className="section-header-block">
          <div className="section-tag">
            <Terminal size={14} style={{ marginRight: 4 }} />
            命令行实战演练
          </div>
          <h2 className="section-title">LiteRT CLI 工具箱交互模拟器</h2>
          <p className="section-description">
            体验面向开发者与 AI Agent 设计的极速命令行工作流，一键探查硬件后端与基准数据。
          </p>
        </div>

        <div className="cli-terminal-card">
          <div className="cli-terminal-head">
            <div className="traffic-dots">
              <div className="traffic-dot dot-1"></div>
              <div className="traffic-dot dot-2"></div>
              <div className="traffic-dot dot-3"></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
              <Terminal size={14} />
              <span>litert-agentic-terminal ~ bash</span>
            </div>
            <button
              onClick={clearTerm}
              className="btn-code-copy-flat"
              aria-label="清空终端输出"
              title="清空终端"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              <Trash2 size={12} />
              <span>清空</span>
            </button>
          </div>

          <div className="cli-actions-row" role="toolbar" aria-label="CLI 快捷指令工具栏">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', alignSelf: 'center', marginRight: 4 }}>快捷执行:</span>
            <button className="term-action-btn" onClick={() => runCmd('help')}>
              $ litert --help
            </button>
            <button className="term-action-btn" onClick={() => runCmd('convert')}>
              $ litert convert (PyTorch -&gt; NPU)
            </button>
            <button className="term-action-btn" onClick={() => runCmd('benchmark')}>
              $ litert benchmark (Hexagon NPU)
            </button>
            <button className="term-action-btn" onClick={() => runCmd('devices')}>
              $ litert devices (异构探查)
            </button>
          </div>

          <div className="cli-terminal-body" ref={termBodyRef} tabIndex={0} aria-label="终端输出历史" role="log">
            {history.length === 0 ? (
              <div style={{ color: '#64748b', fontStyle: 'italic' }}>
                终端已清空。点击上方命令按钮即可运行交互。
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} style={{ marginBottom: '14px' }}>
                  <div style={{ color: '#93c5fd', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', marginBottom: '4px' }}>
                    $ {item.cmd}
                  </div>
                  <pre style={{ color: '#cbd5e1', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {item.output}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

