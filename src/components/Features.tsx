import React from 'react';
import { Settings, MessageSquare, Cpu, Zap, Globe, Terminal, Check, ArrowRight, Layers } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section id="features" aria-label="核心架构特性">
      <div className="container">
        <div className="section-header-block">
          <div className="section-tag">
            <Layers size={14} style={{ marginRight: 4 }} />
            LiteRT V2 核心架构演进
          </div>
          <h2 className="section-title">为端侧 AI 与大模型量身定制的核心支柱</h2>
          <p className="section-description">
            LiteRT 对底层计算图执行、异构硬件调度与模型压缩流水线进行了彻底重构，打造世界顶级工程体验。
          </p>
        </div>

        <div className="bento-container-2">
          {/* Card 1: Featured 8-col Bento Card - Compiled Model */}
          <div className="bento-box-item bento-card-span-8">
            <div>
              <div className="bento-icon-glow glow-blue">
                <Settings size={24} />
              </div>
              <div className="bento-tag tag-blue">核心架构突破</div>
              <h3 className="bento-heading">Compiled Model API 异步异构调度</h3>
              <p className="bento-paragraph">
                彻底告别传统 TFLite 繁琐的显式 Delegate 代理配置。全新的 <code>litert.CompiledModel</code> 具备智能硬件拓扑探查，自动匹配 <strong>NPU &gt; GPU &gt; CPU</strong> 最佳加速路径，并支持真异步非阻塞执行与跨硬件零拷贝内存互操作。
              </p>

              {/* Micro Architecture Diagram */}
              <div className="micro-topology-view">
                <div className="topo-node">PyTorch / TF 模型</div>
                <div className="topo-arrow"><ArrowRight size={14} /></div>
                <div className="topo-node node-active-blue">CompiledModel 编译器</div>
                <div className="topo-arrow"><ArrowRight size={14} /></div>
                <div className="topo-node node-active-emerald">统一 NPU / GPU 硬件</div>
                <div className="topo-arrow"><ArrowRight size={14} /></div>
                <div className="topo-node">零拷贝显存输出</div>
              </div>
            </div>

            <ul className="card-bullets-list">
              <li className="card-bullet-item">
                <Check size={15} strokeWidth={2.5} />
                <span>自动探查当前设备最优算力后端，消灭手动 Delegate 绑定的复杂模板代码</span>
              </li>
              <li className="card-bullet-item">
                <Check size={15} strokeWidth={2.5} />
                <span>支持连续异步推理与共享图形缓冲区（GraphicBuffer / HardwareBuffer）直接互操作</span>
              </li>
            </ul>
          </div>

          {/* Card 2: 4-col Bento Card - LiteRT-LM */}
          <div className="bento-box-item bento-card-span-4">
            <div>
              <div className="bento-icon-glow glow-purple">
                <MessageSquare size={24} />
              </div>
              <div className="bento-tag tag-purple">端侧大模型专用</div>
              <h3 className="bento-heading">LiteRT-LM GenAI 引擎</h3>
              <p className="bento-paragraph">
                专为手机与边缘设备设计的轻量级大模型运行时，原生部署 Gemma、Llama、Qwen 与 Phi，提供丝滑流式生成。
              </p>

              <div className="bento-chips-row">
                <span className="p-chip-purple">INT4-AWQ 权重量化</span>
                <span className="p-chip-purple">INT8 KV-Cache</span>
                <span className="p-chip-purple">跨平台 Tokenizer</span>
              </div>
            </div>

            <ul className="card-bullets-list">
              <li className="card-bullet-item">
                <Check size={15} strokeWidth={2.5} />
                <span>端侧首字延迟（TTFT）低至 40ms 级别</span>
              </li>
            </ul>
          </div>

          {/* Card 3: 4-col Bento Card - Unified NPU */}
          <div className="bento-box-item bento-card-span-4">
            <div>
              <div className="bento-icon-glow glow-emerald">
                <Cpu size={24} />
              </div>
              <div className="bento-tag tag-emerald">芯片原厂贯通</div>
              <h3 className="bento-heading">统一 NPU 硬件加速 API</h3>
              <p className="bento-paragraph">
                一套规范标准 API 直连高通 QNN、联发科 Neuron、三星 ENN、Google Tensor 与 Intel NPU 驱动。
              </p>
            </div>

            <ul className="card-bullets-list">
              <li className="card-bullet-item">
                <Check size={15} strokeWidth={2.5} />
                <span>彻底消灭底层驱动碎片化适配痛点</span>
              </li>
              <li className="card-bullet-item">
                <Check size={15} strokeWidth={2.5} />
                <span>相比 CPU 带来高达 8.8 倍的吞吐提速</span>
              </li>
            </ul>
          </div>

          {/* Card 4: 4-col Bento Card - ML Drift GPU */}
          <div className="bento-box-item bento-card-span-4">
            <div>
              <div className="bento-icon-glow glow-cyan">
                <Zap size={24} />
              </div>
              <div className="bento-tag tag-cyan">显卡级吞吐</div>
              <h3 className="bento-heading">ML Drift GPU 极速架构</h3>
              <p className="bento-paragraph">
                融合前沿 ML Drift 图形加速技术，原生支持 Vulkan 1.3、OpenCL 与 Apple Metal，大幅降低显存带宽开销。
              </p>
            </div>

            <ul className="card-bullets-list">
              <li className="card-bullet-item">
                <Check size={15} strokeWidth={2.5} />
                <span>支持视觉与多模态端侧极限并发</span>
              </li>
              <li className="card-bullet-item">
                <Check size={15} strokeWidth={2.5} />
                <span>跨 GPU 缓冲区格式实现零拷贝调度</span>
              </li>
            </ul>
          </div>

          {/* Card 5: 4-col Bento Card - LiteRT.js */}
          <div className="bento-box-item bento-card-span-4">
            <div>
              <div className="bento-icon-glow glow-pink">
                <Globe size={24} />
              </div>
              <div className="bento-tag tag-pink">浏览器直接运行</div>
              <h3 className="bento-heading">LiteRT.js Web 推理</h3>
              <p className="bento-paragraph">
                利用 WebGPU 与 WebAssembly 技术在纯客户端执行 AI 模型。用户数据 100% 不出端，零服务器成本。
              </p>
            </div>

            <ul className="card-bullets-list">
              <li className="card-bullet-item">
                <Check size={15} strokeWidth={2.5} />
                <span>原生 WebGPU 硬件直连与离线 PWA 支持</span>
              </li>
              <li className="card-bullet-item">
                <Check size={15} strokeWidth={2.5} />
                <span>医疗与金融级端到端隐私隔离保障</span>
              </li>
            </ul>
          </div>

          {/* Card 6: 12-col Full Span Bento Card - LiteRT CLI & Agentic Ecosystem */}
          <div className="bento-box-item bento-card-span-6" style={{ gridColumn: 'span 12' }}>
            <div className="bento-cli-split">
              <div>
                <div className="bento-icon-glow glow-amber">
                  <Terminal size={24} />
                </div>
                <div className="bento-tag tag-amber">开发者工具链 &amp; AI Agent 驱动</div>
                <h3 className="bento-heading">面向 AI 编程智能体的自动化 CLI 工具箱</h3>
                <p className="bento-paragraph">
                  专为现代工程团队与 AI Coding Agents 设计的标准命令行接口。一键完成 PyTorch / HuggingFace 模型探查、INT4-AWQ 量化与全芯片基准自动化评测。
                </p>
              </div>

              <div className="bento-cli-preview">
                <div>$ litert convert --model gemma-2b --backend npu</div>
                <div className="cli-out-ok">✓ Compiled model exported: gemma-2b.litertlm</div>
                <div className="cli-out-info">$ litert benchmark --device qcom-8gen3</div>
                <div className="cli-out-warn">✓ Hexagon NPU TTFT: 48.2ms | Gen: 24.2 tok/s</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
