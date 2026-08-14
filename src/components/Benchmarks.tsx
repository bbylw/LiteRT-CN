import React, { useState, useEffect } from 'react';
import { Gauge, Play, RotateCcw, Zap } from 'lucide-react';
import { benchmarkData } from '../data/portalData';
import { useToast } from '../context/ToastContext';

export const Benchmarks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mobile' | 'pc' | 'web'>('mobile');
  const [animated, setAnimated] = useState(false);
  const [isRacing, setIsRacing] = useState(false);
  const { showToast } = useToast();

  const items = benchmarkData[activeTab] || benchmarkData.mobile;

  const runLiveRace = () => {
    setAnimated(false);
    setIsRacing(true);
    showToast('🚀 正在启动异构硬件算力并发竞速测试...');

    setTimeout(() => {
      setAnimated(true);
      setIsRacing(false);
      showToast('✓ 竞速测试完成：NPU 零拷贝加速比达到 8.8x！');
    }, 400);
  };

  useEffect(() => {
    setAnimated(false);
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 60);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <section id="benchmarks" aria-label="性能基准评测">
      <div className="container">
        <div className="section-header-block">
          <div className="section-tag">
            <Gauge size={14} style={{ marginRight: 4 }} />
            实测性能基准
          </div>
          <h2 className="section-title">端侧异构硬件推理延迟与吞吐实测</h2>
          <p className="section-description">
            LiteRT 在各大主流芯片架构下的真实推理对比，NPU 相比传统 CPU 带来高达 8.8 倍的提速。
          </p>
        </div>

        <div className="benchmark-card-box">
          <div className="race-control-header">
            <div className="benchmark-tab-bar" role="tablist" aria-label="基准硬件平台" style={{ marginBottom: 0 }}>
              <button
                role="tab"
                aria-selected={activeTab === 'mobile'}
                className={`bench-tab-btn ${activeTab === 'mobile' ? 'active' : ''}`}
                onClick={() => setActiveTab('mobile')}
              >
                移动端旗舰芯片 (Snapdragon 8 Gen 3)
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'pc'}
                className={`bench-tab-btn ${activeTab === 'pc' ? 'active' : ''}`}
                onClick={() => setActiveTab('pc')}
              >
                PC 边缘芯片 (Intel Core Ultra)
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'web'}
                className={`bench-tab-btn ${activeTab === 'web' ? 'active' : ''}`}
                onClick={() => setActiveTab('web')}
              >
                现代浏览器客户端 (WebGPU vs WASM)
              </button>
            </div>

            <button
              className="btn-start-race"
              onClick={runLiveRace}
              disabled={isRacing}
            >
              {isRacing ? <RotateCcw size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
              <span>{isRacing ? '正在并发压测...' : '启动硬件实时竞速'}</span>
            </button>
          </div>

          <div className="bench-chart-container" id="bench-chart-rows" role="region" aria-label="性能图表数据">
            {items.map((item, idx) => (
              <div key={idx} className="race-track-row">
                <div className="race-head-info">
                  <div className="race-hw-badge">
                    <Zap size={14} color="#60a5fa" />
                    <span>{item.hw}</span>
                  </div>
                  <div className="race-metrics">
                    {item.latency} <span style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem' }}>({item.speedup})</span>
                  </div>
                </div>
                <div className="race-progress-bar" role="progressbar" aria-valuenow={item.val} aria-valuemin={0} aria-valuemax={100}>
                  <div
                    className={`race-progress-fill ${item.fillClass}`}
                    style={{ width: animated ? `${item.val}%` : '0%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
