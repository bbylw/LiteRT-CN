import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Play, Terminal, Cpu, Sparkles, Zap, Activity } from 'lucide-react';
import { telemetryData } from '../data/portalData';
import { useToast } from '../context/ToastContext';

const samplePrompts: Record<string, { label: string; streamText: string }> = {
  gemma: {
    label: '端侧大模型推理',
    streamText: `>>> [LiteRT-LM Engine] Initializing Gemma-2B-IT (INT4-AWQ + INT8 KV-Cache)...
>>> Target Hardware: Qualcomm Snapdragon 8 Gen 3 (Hexagon NPU)
>>> Loading weights from 'gemma-2b-int4.litertlm' (Zero-Copy Buffer: 1.24 GB)...

[Prompt]: "请简要解释端侧 AI 相比云端 API 的核心技术优势。"
[LiteRT-LM Output]:
1. 🛡️ 极致隐私安全：模型完全驻留设备端，Prompt 与上下文永不出网，符合 GDPR / 医疗级合规要求；
2. ⚡ 零网络延迟与高吞吐：消除网络往返波动（RTT），TTFT 首次 Token 延迟低至 48ms，流式生成达 24.2 tok/s；
3. 🔋 超低功耗协同：统一 NPU 硬件加速 API 释放峰值算力，功耗仅为云端集群开销的 1/10；
4. 📶 离线可用性：在飞行模式或无网环境下保证 100% 服务可用。`
  },
  mobilenet: {
    label: '实时视觉分类',
    streamText: `>>> [LiteRT CompiledModel] Loading MobileNet-V4.tflite (INT8 PTQ)...
>>> Backend: MediaTek Dimensity 9300 (Neuron NPU APU-990)
>>> Binding Async Direct Memory IO (Shared GraphicBuffer)...

[Frame Input]: 224x224x3 RGB Stream (Camera Feed)
[Inference Result]:
• Top-1 Prediction : "Eskimo Dog / Husky" (Score: 98.4%)
• Latency Breakdown: Preprocess: 0.3ms | NPU Execute: 2.14ms | Postprocess: 0.1ms
• Sustained Rate   : 467 FPS @ 100% Local Inference [Stable]`
  },
  webgpu: {
    label: '浏览器 WebGPU 推理',
    streamText: `>>> [LiteRT.js WebEngine] Requesting navigator.gpu adapter...
>>> Device: Apple M3 Max / Google Chrome 128+ Direct Compute
>>> Allocating GPUBuffer with MAP_READ | COPY_DST flags...

[Web Task]: Client-Side Semantic Search & Embeddings
• Backend        : WebGPU Compute Shader (Zero-WASM Trampoline)
• Memory Interop : SharedArrayBuffer (45.2 MB)
• Security Sandbox: 100% Browser Native Sandbox [Active]`
  }
};

export const Hero: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<'gemma' | 'mobilenet' | 'webgpu'>('gemma');
  const [copied, setCopied] = useState(false);
  const [streamOutput, setStreamOutput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const { showToast } = useToast();
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentTel = telemetryData[selectedModel];

  const handleCopyInstall = () => {
    navigator.clipboard.writeText('uv pip install litert-cli-nightly').then(() => {
      setCopied(true);
      showToast('安装命令已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const startStreamSimulation = (modelKey: 'gemma' | 'mobilenet' | 'webgpu') => {
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
    }
    const fullText = samplePrompts[modelKey].streamText;
    setStreamOutput('');
    setIsStreaming(true);

    let charIndex = 0;
    streamTimerRef.current = setInterval(() => {
      charIndex += 4;
      if (charIndex >= fullText.length) {
        setStreamOutput(fullText);
        setIsStreaming(false);
        if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      } else {
        setStreamOutput(fullText.slice(0, charIndex));
      }
    }, 18);
  };

  useEffect(() => {
    startStreamSimulation(selectedModel);
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [selectedModel]);

  return (
    <section className="hero-section" aria-label="欢迎英雄区">
      <div className="container">
        <div className="hero-grid-split">
          <div className="hero-text-block">
            <div className="hero-beacon">
              <span className="beacon-dot"></span>
              <Sparkles size={15} className="beacon-sparkle" />
              <span>Google AI Edge 官方端侧运行时 · v2.1 稳定发布</span>
            </div>

            <h1 className="hero-headline">
              面向端侧智能的<br />
              <span className="text-gradient-aurora">高性能 AI 推理引擎</span>
            </h1>

            <p className="hero-subtext">
              <strong>LiteRT</strong> 延续 TensorFlow Lite 的卓越工程基石，专为移动终端、边缘硬件与现代 Web 打造。具备全新 <strong>Compiled Model 架构</strong>、<strong>统一 NPU 加速 API</strong> 与 <strong>ML Drift GPU 技术</strong>，让大语言模型与前沿深度学习在毫秒级与毫瓦级功耗下流畅运行。
            </p>

            {/* Quick Install Bar */}
            <div className="hero-install-bar">
              <div className="install-cmd" id="install-cmd">
                <span>uv pip install</span> litert-cli-nightly
              </div>
              <button
                className="btn-install-copy"
                id="btn-copy-install"
                onClick={handleCopyInstall}
                aria-label="复制安装命令"
                title="复制安装命令"
              >
                {copied ? <Check size={14} strokeWidth={2.5} color="var(--accent-emerald)" /> : <Copy size={14} strokeWidth={2} />}
                <span>{copied ? '已复制' : '复制'}</span>
              </button>
            </div>

            <div className="hero-cta-buttons">
              <a href="#ide" className="btn-solid-primary">
                <Play size={16} fill="currentColor" />
                <span>浏览多语言 SDK</span>
              </a>
              <a href="#builder" className="btn-outline-secondary">
                <Terminal size={16} />
                <span>模型转换配置台</span>
              </a>
            </div>
          </div>

          {/* Hero Right: Live GenAI Inference Sandbox */}
          <div className="hero-widget-block">
            <div className="sandbox-card">
              <div className="sandbox-header">
                <div className="sandbox-title">
                  <Activity size={18} className="sandbox-title-icon" />
                  <span>端侧运行时实时推演沙盒</span>
                </div>
                <span className="sandbox-status-pill">
                  <span className="pulse-led"></span>
                  {isStreaming ? 'STREAMING...' : 'COMPILED & READY'}
                </span>
              </div>

              <div className="sandbox-model-selector" role="tablist" aria-label="模型推演选择">
                <button
                  role="tab"
                  aria-selected={selectedModel === 'gemma'}
                  className={`sandbox-model-tab ${selectedModel === 'gemma' ? 'active' : ''}`}
                  onClick={() => setSelectedModel('gemma')}
                >
                  Gemma-2B (GenAI)
                </button>
                <button
                  role="tab"
                  aria-selected={selectedModel === 'mobilenet'}
                  className={`sandbox-model-tab ${selectedModel === 'mobilenet' ? 'active' : ''}`}
                  onClick={() => setSelectedModel('mobilenet')}
                >
                  MobileNet-V4 (CV)
                </button>
                <button
                  role="tab"
                  aria-selected={selectedModel === 'webgpu'}
                  className={`sandbox-model-tab ${selectedModel === 'webgpu' ? 'active' : ''}`}
                  onClick={() => setSelectedModel('webgpu')}
                >
                  LiteRT.js (WebGPU)
                </button>
              </div>

              <div className="sandbox-body">
                {/* Metric Gauges */}
                <div className="sandbox-gauges">
                  <div className="gauge-box">
                    <div className="gauge-label">推理延迟 (Latency)</div>
                    <div className="gauge-value">
                      {currentTel.latency} <span>{currentTel.latencyUnit}</span>
                    </div>
                  </div>

                  <div className="gauge-box">
                    <div className="gauge-label">内存占用 (Memory)</div>
                    <div className="gauge-value">
                      {currentTel.memory} <span>{currentTel.memoryUnit}</span>
                    </div>
                  </div>

                  <div className="gauge-box">
                    <div className="gauge-label">加速比 (Speedup)</div>
                    <div className="gauge-value" style={{ color: 'var(--accent-emerald)' }}>
                      {currentTel.speedup} <span style={{ color: 'var(--accent-emerald)' }}>{currentTel.speedupUnit}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Prompts */}
                <div className="prompt-chips-row">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>演练用例:</span>
                  <button
                    className="prompt-chip-btn"
                    onClick={() => startStreamSimulation(selectedModel)}
                  >
                    ▶ 重新流式生成
                  </button>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                    {samplePrompts[selectedModel].label}
                  </span>
                </div>

                {/* Stream Console */}
                <pre className="sandbox-stream-terminal" tabIndex={0} aria-label="端侧流式推理日志">
                  {streamOutput}
                  {isStreaming && <span className="typing-cursor"></span>}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
