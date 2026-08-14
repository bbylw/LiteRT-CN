import React, { useState } from 'react';
import { Layers, Cpu, Box, Zap, Sparkles, ChevronRight } from 'lucide-react';

interface LayerInfo {
  id: string;
  name: string;
  category: string;
  badge: string;
  color: string;
  description: string;
  techs: string[];
  metrics: { label: string; value: string }[];
}

const layers: LayerInfo[] = [
  {
    id: 'layer-4',
    name: '应用框架与模型输入层',
    category: 'Layer 04 · Input & Definition',
    badge: 'PyTorch / HuggingFace',
    color: 'var(--tag-purple)',
    description: '原生无缝对接 PyTorch 2.x、HuggingFace Transformers、TensorFlow 与 JAX 计算图，保留原始计算拓扑与高阶张量元数据。',
    techs: ['PyTorch 2.x nn.Module', 'HuggingFace SafeTensors', 'JAX FX Graph', 'TensorFlow SavedModel'],
    metrics: [
      { label: '支持算子覆盖', value: '99.4%' },
      { label: '导入解析耗时', value: '< 12ms' }
    ]
  },
  {
    id: 'layer-3',
    name: 'LiteRT 编译优化与图融合核心',
    category: 'Layer 03 · Graph Optimization',
    badge: 'CompiledModel Core',
    color: 'var(--tag-blue)',
    description: '执行算子融合（Conv+BatchNorm+ReLU）、常量折叠、权重量化（INT4-AWQ / PTQ）与跨芯片调度路径全局寻优。',
    techs: ['CompiledModel 统一编译', 'AI-Edge Quantizer', '算子自动融合引擎', 'INT4-AWQ 压缩'],
    metrics: [
      { label: '图节点缩减比', value: '42.6%' },
      { label: '内存带宽优化', value: '3.4x' }
    ]
  },
  {
    id: 'layer-2',
    name: '统一异构硬件加速 HAL 层',
    category: 'Layer 02 · Hardware Abstraction',
    badge: 'Unified HAL & Zero-Copy',
    color: 'var(--tag-emerald)',
    description: '一套高抽象度 C/C++ 驱动桥接规范，支持硬件共享图形缓冲区（GraphicBuffer）跨芯片零拷贝直接调度。',
    techs: ['Zero-Copy Memory Interop', '异步非阻塞流调度', '统一 NPU 加速标准', 'ML Drift GPU 管道'],
    metrics: [
      { label: '零拷贝传输开销', value: '0.00 ms' },
      { label: '并发流水线吞吐', value: '+380%' }
    ]
  },
  {
    id: 'layer-1',
    name: '物理硅基芯片加速硬件',
    category: 'Layer 01 · Physical Silicon',
    badge: 'Native Silicon Acceleration',
    color: 'var(--tag-cyan)',
    description: '直达各大芯片原厂底层微架构与专用神经计算单元，发挥端侧极致能效比与毫瓦级功耗。',
    techs: ['Qualcomm Hexagon NPU', 'MediaTek Neuron APU', 'Apple Neural Engine (ANE)', 'Intel NPU / WebGPU'],
    metrics: [
      { label: '峰值 NPU 算力', value: '45 TOPS' },
      { label: '端侧大模型能效比', value: '1.2 W' }
    ]
  }
];

export const ExplodedStack: React.FC = () => {
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-3');
  const [isExploded, setIsExploded] = useState<boolean>(true);

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || layers[1];

  return (
    <section id="architecture" className="exploded-stack-section" aria-label="3D分层架构透视">
      <div className="container">
        <div className="section-header-block">
          <div className="section-tag">
            <Box size={14} style={{ marginRight: 4 }} />
            空间动力学架构透视
          </div>
          <h2 className="section-title">
            从模型框架到物理芯片的<br />
            <span className="text-gradient-aurora">四层立体执行引擎</span>
          </h2>
          <p className="section-description">
            LiteRT 构建了贯通应用层、编译器、硬件抽象层与物理硅基单元的垂直一体化架构。
          </p>
        </div>

        <div className="exploded-main-grid">
          {/* Left: 3D Isometric Visual Stack */}
          <div className="isometric-stack-viewport">
            <div className="stack-actions-bar">
              <button
                className={`btn-explode-toggle ${isExploded ? 'active' : ''}`}
                onClick={() => setIsExploded(!isExploded)}
                aria-label="切换 3D 分层展开透视"
              >
                <Sparkles size={14} />
                <span>{isExploded ? '合拢架构透视' : '展开 3D 分层透视'}</span>
              </button>
            </div>

            <div className={`isometric-layers-container ${isExploded ? 'exploded' : 'collapsed'}`}>
              {layers.map((layer, index) => {
                const isActive = selectedLayerId === layer.id;
                return (
                  <div
                    key={layer.id}
                    className={`iso-layer-card ${isActive ? 'active' : ''}`}
                    style={{
                      '--layer-offset': `${index * (isExploded ? 68 : 22)}px`,
                      '--layer-color': layer.color
                    } as React.CSSProperties}
                    onClick={() => setSelectedLayerId(layer.id)}
                  >
                    <div className="iso-layer-header">
                      <div className="iso-layer-indicator" style={{ backgroundColor: layer.color }}></div>
                      <span className="iso-layer-tag">{layer.category}</span>
                      <span className="iso-layer-badge">{layer.badge}</span>
                    </div>
                    <div className="iso-layer-title">{layer.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Layer Deep-Dive Inspector */}
          <div className="layer-inspector-card">
            <div className="inspector-head">
              <div>
                <span className="inspector-category" style={{ color: selectedLayer.color }}>
                  {selectedLayer.category}
                </span>
                <h3 className="inspector-title">{selectedLayer.name}</h3>
              </div>
              <span className="inspector-badge">{selectedLayer.badge}</span>
            </div>

            <p className="inspector-desc">{selectedLayer.description}</p>

            <div className="inspector-metrics-grid">
              {selectedLayer.metrics.map((m, idx) => (
                <div key={idx} className="inspector-metric-box">
                  <div className="inspector-metric-label">{m.label}</div>
                  <div className="inspector-metric-value" style={{ color: selectedLayer.color }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="inspector-tech-stack">
              <div className="inspector-tech-title">核心技术特性与规范：</div>
              <div className="inspector-tech-pills">
                {selectedLayer.techs.map((t, idx) => (
                  <div key={idx} className="inspector-tech-pill">
                    <ChevronRight size={13} style={{ color: selectedLayer.color }} />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
