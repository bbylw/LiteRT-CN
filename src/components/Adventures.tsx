import React from 'react';
import { FastForward, Play, Box, MessageSquare, Cpu, Globe, Compass, ExternalLink } from 'lucide-react';
import { adventures } from '../data/portalData';

export const Adventures: React.FC = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'arrow':
        return <FastForward size={20} />;
      case 'play':
        return <Play size={20} />;
      case 'box':
        return <Box size={20} />;
      case 'message':
        return <MessageSquare size={20} />;
      case 'chip':
        return <Cpu size={20} />;
      case 'globe':
        return <Globe size={20} />;
      default:
        return <Box size={20} />;
    }
  };

  return (
    <section id="adventure" aria-label="开发旅程指南">
      <div className="container">
        <div className="section-header-block">
          <div className="section-tag">
            <Compass size={14} style={{ marginRight: 4 }} />
            Choose Your Adventure
          </div>
          <h2 className="section-title">选择适合您的开发旅程</h2>
          <p className="section-description">
            根据您的业务目标与技术栈，快速定位对应的官方文档与上手路径。
          </p>
        </div>

        <div className="adventures-grid">
          {adventures.map((adv, idx) => (
            <div key={idx} className="adv-card">
              <div>
                <div className="adv-icon-badge">
                  {getIcon(adv.iconName)}
                </div>
                <h4>{adv.title}</h4>
                <p>{adv.description}</p>
              </div>
              <div className="adv-foot">
                <span className="adv-tag">{adv.tag}</span>
                <a
                  href={adv.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="adv-link"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <span>{adv.linkText}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

