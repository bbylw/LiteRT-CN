import React, { useState } from 'react';
import { Sliders, Check, Copy, Zap, HardDrive, Gauge, ShieldAlert } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface QuantPreset {
  id: string;
  name: string;
  badge: string;
  memory: string;
  memPercent: number;
  latency: string;
  speedup: string;
  pplLoss: string;
  bins: number;
  codeSnippet: string;
}

const presets: Record<string, QuantPreset> = {
  fp32: {
    id: 'fp32',
    name: 'FP32 全精度浮点',
    badge: 'Original Uncompressed',
    memory: '7.60 GB',
    memPercent: 100,
    latency: '380 ms',
    speedup: '1.0x (基准)',
    pplLoss: '0.00% (原始)',
    bins: 48,
    codeSnippet: 'litert convert --model gemma-2b --precision fp32'
  },
  fp16: {
    id: 'fp16',
    name: 'FP16 半精度浮点',
    badge: 'Half Precision',
    memory: '3.80 GB',
    memPercent: 50,
    latency: '112 ms',
    speedup: '3.4x 加速',
    pplLoss: '+0.01% (无损)',
    bins: 32,
    codeSnippet: 'litert convert --model gemma-2b --precision fp16 --backend gpu'
  },
  int8: {
    id: 'int8',
    name: 'INT8 全整型 PTQ',
    badge: 'Post-Training Quant',
    memory: '1.90 GB',
    memPercent: 25,
    latency: '42.8 ms',
    speedup: '8.8x 加速',
    pplLoss: '+0.12% (高保真)',
    bins: 16,
    codeSnippet: 'litert quantize --model gemma-2b --scheme int8-ptq --calibration-data ./calib.tfrecord'
  },
  int4: {
    id: 'int4',
    name: 'INT4-AWQ + INT8 KV-Cache',
    badge: 'LiteRT 旗舰极速量化',
    memory: '480 MB',
    memPercent: 6.3,
    latency: '24.2 ms',
    speedup: '15.7x 极限加速',
    pplLoss: '+0.35% (极微小)',
    bins: 8,
    codeSnippet: 'litert quantize --model gemma-2b --scheme int4-awq --kv-cache int8 --target qnn-npu'
  }
};

export const QuantizationLab: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('int4');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const current = presets[selectedKey];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.codeSnippet).then(() => {
      setCopied(true);
      showToast('量化指令已成功复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="quantization" className="quant-lab-section" aria-label="模型量化实验室">
      <div className="container">
        <div className="section-header-block">
          <div className="section-tag">
            <Sliders size={14} style={{ marginRight: 4 }} />
            实时量化实验室
          </div>
          <h2 className="section-title">
            端侧模型极限压缩与<br />
            <span className="text-gradient-aurora">权重矩阵离散化推演</span>
          </h2>
          <p className="section-description">
            拖拽或选择量化精度策略，实时探索 LiteRT 如何在损失几乎为零的前提下将大模型压缩 93.7%。
          </p>
        </div>

        <div className="quant-lab-card">
          {/* Preset Buttons */}
          <div className="quant-presets-bar" role="tablist" aria-label="量化策略选择">
            {Object.values(presets).map((p) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={selectedKey === p.id}
                className={`quant-preset-btn ${selectedKey === p.id ? 'active' : ''}`}
                onClick={() => setSelectedKey(p.id)}
              >
                <div className="preset-btn-title">{p.name}</div>
                <div className="preset-btn-sub">{p.badge}</div>
              </button>
            ))}
          </div>

          <div className="quant-dashboard-grid">
            {/* Left: Dynamic Metrics & Histogram */}
            <div className="quant-visual-col">
              <div className="quant-stats-triad">
                <div className="quant-stat-box">
                  <div className="stat-box-label">
                    <HardDrive size={13} style={{ marginRight: 4, color: 'var(--accent-blue)' }} />
                    模型体积 (RAM)
                  </div>
                  <div className="stat-box-val">{current.memory}</div>
                  <div className="stat-box-sub" style={{ color: 'var(--accent-emerald)' }}>
                    节省 {100 - current.memPercent}% 内存
                  </div>
                </div>

                <div className="quant-stat-box">
                  <div className="stat-box-label">
                    <Zap size={13} style={{ marginRight: 4, color: 'var(--accent-emerald)' }} />
                    NPU 单 Token 延迟
                  </div>
                  <div className="stat-box-val" style={{ color: 'var(--tag-emerald)' }}>
                    {current.latency}
                  </div>
                  <div className="stat-box-sub" style={{ color: 'var(--tag-emerald)' }}>
                    {current.speedup}
                  </div>
                </div>

                <div className="quant-stat-box">
                  <div className="stat-box-label">
                    <Gauge size={13} style={{ marginRight: 4, color: 'var(--tag-purple)' }} />
                    困惑度损失 (PPL)
                  </div>
                  <div className="stat-box-val" style={{ color: 'var(--tag-purple)' }}>
                    {current.pplLoss}
                  </div>
                  <div className="stat-box-sub" style={{ color: 'var(--text-tertiary)' }}>
                    MMLU 准确率 98.6%
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Histogram of Weights */}
              <div className="histogram-wrapper">
                <div className="histogram-header">
                  <span>权重矩阵离散化直方图 (Weight Quantization Histogram)</span>
                  <span className="bin-count-tag">{current.bins} 量化簇区间 (Quantized Bins)</span>
                </div>

                <div className="histogram-bars-container">
                  {Array.from({ length: 32 }).map((_, idx) => {
                    const center = 16;
                    const distFromCenter = Math.abs(idx - center);
                    const gaussianBase = Math.exp(-(distFromCenter * distFromCenter) / 36);

                    // If quantized to fewer bins, cluster the heights into stepped discrete levels
                    const quantStep = Math.max(1, Math.floor(32 / current.bins));
                    const quantIdx = Math.floor(idx / quantStep) * quantStep;
                    const quantDist = Math.abs(quantIdx - center);
                    const barHeight = Math.max(12, Math.exp(-(quantDist * quantDist) / 36) * 90);

                    return (
                      <div
                        key={idx}
                        className="histo-bar-col"
                        style={{ height: `${barHeight}%` }}
                        title={`权重区间 ${idx}: 密度 ${(barHeight * 10).toFixed(0)}`}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Code Generation */}
            <div className="quant-code-col">
              <div className="code-editor-card">
                <div className="code-editor-head">
                  <div className="traffic-dots">
                    <div className="traffic-dot dot-1"></div>
                    <div className="traffic-dot dot-2"></div>
                    <div className="traffic-dot dot-3"></div>
                  </div>
                  <span className="editor-filename">quantize_recipe.sh</span>
                  <button
                    className="btn-code-copy-flat"
                    onClick={handleCopy}
                    aria-label="复制代码"
                    title="复制代码"
                  >
                    {copied ? <Check size={12} strokeWidth={2.5} color="var(--accent-emerald)" /> : <Copy size={12} />}
                    <span>{copied ? '已复制' : '复制命令'}</span>
                  </button>
                </div>
                <pre className="editor-pre" tabIndex={0} aria-label="量化指令代码">
                  <code className="str"># 1. 执行 LiteRT 自动化量化配方{'\n'}</code>
                  <code>{current.codeSnippet}{'\n\n'}</code>
                  <code className="cmt"># 2. 导出编译后的 CompiledModel 权重包{'\n'}</code>
                  <code className="fn">litert export</code> <code>--output gemma-2b-optimized.litertlm</code>
                </pre>
              </div>

              <div className="quant-tips-box">
                <ShieldAlert size={16} color="var(--tag-blue)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  <strong>LiteRT-AWQ 架构：</strong>针对激活敏感的权重通道进行自适应保护（Activation-aware Weight Quantization），在将 Gemma / Llama 模型压缩至 4-bit 的同时，保留 99.6% 的指令遵循能力。
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
