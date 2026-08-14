import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="portal-footer">
      <div className="container">
        <div className="footer-nav-grid">
          <div className="footer-brand-summary">
            <div className="nav-logo-wrap" style={{ marginBottom: 8 }}>
              <div className="logo-badge" style={{ width: 28, height: 28 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <span className="brand-text">LiteRT</span>
            </div>
            <p>
              Google AI Edge 旗下高性能端侧 AI 推理引擎。赋能开发者在移动终端、嵌入式硬件与 Web 浏览器中高效部署前沿深度学习与生成式大模型。
            </p>
          </div>

          <div>
            <div className="footer-heading">官方核心项目</div>
            <ul className="footer-list">
              <li><a href="https://github.com/google-ai-edge/LiteRT" target="_blank" rel="noopener noreferrer">LiteRT 核心引擎</a></li>
              <li><a href="https://github.com/google-ai-edge/LiteRT-LM" target="_blank" rel="noopener noreferrer">LiteRT-LM 大模型框架</a></li>
              <li><a href="https://github.com/google-ai-edge/LiteRT-CLI" target="_blank" rel="noopener noreferrer">LiteRT CLI 工具包</a></li>
              <li><a href="https://github.com/google-ai-edge/litert-torch" target="_blank" rel="noopener noreferrer">LiteRT Torch 转换器</a></li>
              <li><a href="https://github.com/google-ai-edge/litert-samples" target="_blank" rel="noopener noreferrer">官方示例代码库</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-heading">文档与技术指南</div>
            <ul className="footer-list">
              <li><a href="https://ai.google.dev/edge/litert" target="_blank" rel="noopener noreferrer">Google AI Edge 官方文档</a></li>
              <li><a href="https://ai.google.dev/edge/litert/migration" target="_blank" rel="noopener noreferrer">TensorFlow Lite 迁移指南</a></li>
              <li><a href="https://ai.google.dev/edge/litert/next/npu" target="_blank" rel="noopener noreferrer">统一 NPU 加速指南</a></li>
              <li><a href="https://ai.google.dev/edge/litert/web" target="_blank" rel="noopener noreferrer">LiteRT.js Web 推理指南</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-heading">开源社区与政策</div>
            <ul className="footer-list">
              <li><a href="https://github.com/google-ai-edge/LiteRT/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">贡献指南 (Contributing)</a></li>
              <li><a href="https://github.com/google-ai-edge/LiteRT/blob/main/SECURITY.md" target="_blank" rel="noopener noreferrer">安全策略 (Security)</a></li>
              <li><a href="https://github.com/google-ai-edge/LiteRT/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">Apache-2.0 开源许可</a></li>
              <li><a href="https://github.com/google-ai-edge/LiteRT/issues" target="_blank" rel="noopener noreferrer">反馈 Issue / Bug</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div>© 2026 Google AI Edge / LiteRT Community. 遵循 Apache-2.0 开源协议。</div>
          <div>LiteRT 中文开发者门户 · 基于 React + Bun 技术栈构建</div>
        </div>
      </div>
    </footer>
  );
};
