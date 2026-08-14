import React from 'react';
import { Cpu } from 'lucide-react';
import { hardwareMatrix, buildMatrix } from '../data/portalData';

export const HardwareMatrix: React.FC = () => {
  return (
    <section id="matrix" aria-label="芯片生态与构建状态">
      <div className="container">
        <div className="section-header-block">
          <div className="section-tag">
            <Cpu size={14} style={{ marginRight: 4 }} />
            芯片生态与构建状态
          </div>
          <h2 className="section-title">全平台芯片厂商深度支持与持续集成</h2>
          <p className="section-description">
            LiteRT 统一接口直达底层硬件加速器，并提供持续严格的自动化构建矩阵。
          </p>
        </div>

        {/* Hardware Table */}
        <div className="clean-table-card" role="region" aria-label="芯片厂商生态支持矩阵" tabIndex={0}>
          <table className="matrix-table">
            <thead>
              <tr>
                <th scope="col">硬件架构 / 芯片厂商</th>
                <th scope="col">底层驱动与加速引擎</th>
                <th scope="col">推荐量化精度</th>
                <th scope="col">适配平台</th>
                <th scope="col">生态状态</th>
              </tr>
            </thead>
            <tbody>
              {hardwareMatrix.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.vendor}</strong></td>
                  <td>{row.driver}</td>
                  <td>{row.precision}</td>
                  <td>{row.platform}</td>
                  <td>
                    <span className={`status-badge ${row.statusType}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Build Table */}
        <div className="clean-table-card" role="region" aria-label="持续集成与构建发布矩阵" tabIndex={0}>
          <table className="matrix-table">
            <thead>
              <tr>
                <th scope="col">构建类别</th>
                <th scope="col">目标操作系统与平台架构</th>
                <th scope="col">分发形式</th>
                <th scope="col">发布周期</th>
                <th scope="col">CI 状态</th>
              </tr>
            </thead>
            <tbody>
              {buildMatrix.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>{row.category}</strong></td>
                  <td>{row.platform}</td>
                  <td>{row.distribution}</td>
                  <td>{row.cycle}</td>
                  <td>
                    <span className="status-badge ok">
                      {row.ciStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

