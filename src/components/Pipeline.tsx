import React, { useState } from 'react';
import { Copy, Check, GitBranch, ArrowRight } from 'lucide-react';
import { archNodes } from '../data/portalData';
import { useToast } from '../context/ToastContext';

export const Pipeline: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<string>('node1');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const currentStep = archNodes[activeStepId];
  const stepsList = Object.values(archNodes);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentStep.rawCode).then(() => {
      setCopied(true);
      showToast('代码已成功复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section id="pipeline" aria-label="全链路架构流水线">
      <div className="container">
        <div className="section-header-block">
          <div className="section-tag">
            <GitBranch size={14} style={{ marginRight: 4 }} />
            端到端流水线
          </div>
          <h2 className="section-title">全链路模型转换与异构执行流水线</h2>
          <p className="section-description">
            点击流水线各阶段节点，直观探索 LiteRT 如何将主流深度学习模型转化并调度至端侧芯片。
          </p>
        </div>

        <div className="pipeline-canvas-box">
          {/* Circuit Stepper Track */}
          <div className="pipeline-stepper-track" role="tablist" aria-label="流水线步骤选择">
            {stepsList.map((step, idx) => (
              <React.Fragment key={step.id}>
                <button
                  role="tab"
                  aria-selected={activeStepId === step.id}
                  className={`step-node-button ${activeStepId === step.id ? 'active' : ''}`}
                  onClick={() => setActiveStepId(step.id)}
                >
                  <div className="step-number-tag">{step.stepNum}</div>
                  <div className="step-name-title">{step.title}</div>
                  <div className="step-desc-sub">{step.sub}</div>
                </button>
                {idx < stepsList.length - 1 && (
                  <div className="topo-arrow" style={{ display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                    <ArrowRight size={16} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="pipeline-detail-viewport">
            <div className="pipeline-info-col">
              <h4>{currentStep.detailTitle}</h4>
              <p>{currentStep.desc}</p>
              <div className="pipeline-chips-wrap">
                {currentStep.chips.map((chip, idx) => (
                  <span key={idx} className="p-chip-blue">
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="code-editor-card">
              <div className="code-editor-head">
                <div className="traffic-dots">
                  <div className="traffic-dot dot-1"></div>
                  <div className="traffic-dot dot-2"></div>
                  <div className="traffic-dot dot-3"></div>
                </div>
                <span className="editor-filename">{currentStep.filename}</span>
                <button
                  className="btn-code-copy-flat"
                  onClick={handleCopy}
                  aria-label="复制代码"
                  title="复制代码"
                >
                  {copied ? <Check size={12} strokeWidth={2.5} color="var(--accent-emerald)" /> : <Copy size={12} />}
                  <span>{copied ? '已复制' : '复制代码'}</span>
                </button>
              </div>
              <pre className="editor-pre" tabIndex={0} aria-label="流水线示例代码">
                <code dangerouslySetInnerHTML={{ __html: currentStep.codeHtml }} />
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
