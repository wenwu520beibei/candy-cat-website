'use client'

import { useState } from 'react'

const tabs = [
  { id: 'about', label: '关于' },
  { id: 'skills', label: '技能' },
  { id: 'experience', label: '经历' },
  { id: 'projects', label: '项目' },
  { id: 'patents', label: '专利' },
  { id: 'contact', label: '联系' },
]

export default function ResumeClient({ name, title }: { name: string; title: string }) {
  const [active, setActive] = useState('about')

  return (
    <div className="resume-tabs">
      <div className="resume-tabs-nav">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`resume-tab ${active === t.id ? 'active' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="resume-content">
        {active === 'about' && <AboutSection name={name} title={title} />}
        {active === 'skills' && <SkillsSection />}
        {active === 'experience' && <ExperienceSection />}
        {active === 'projects' && <ProjectsSection />}
        {active === 'patents' && <PatentsSection />}
        {active === 'contact' && <ContactSection />}
      </div>
    </div>
  )
}

function AboutSection({ name, title }: { name: string; title: string }) {
  return (
    <div>
      <div className="resume-hero">
        <div className="resume-avatar">蒋</div>
        <div>
          <h1 className="resume-name">{name}</h1>
          <p className="resume-title">{title}</p>
        </div>
      </div>
      <div className="resume-card">
        <h3 className="resume-section-title">个人简介</h3>
        <p className="resume-bio">
          主导电池画像算法开发，构建充高放低、热性能恶化、库伦效率、SOH衰减等多维监控体系，接入<strong>2万+台车云端数据</strong>，综合故障识别准确率≥80%。从0到1搭建化成分容容量预测系统，预测误差≤1%覆盖99.5%电芯，能耗比从235%降至175%，已完成45Ah方案验证并投产。带领3人团队累计产出<strong>发明专利6项</strong>，团队人均专利产出位列部门第一。
        </p>
      </div>
      <div className="resume-card">
        <h3 className="resume-section-title">教育背景</h3>
        <div className="resume-item">
          <div className="resume-item-header">
            <span className="resume-item-title">车辆工程 · 硕士</span>
            <span className="resume-item-date">2017-2020</span>
          </div>
          <p className="resume-item-desc">研究方向：超级电容器电极材料改性制备与电化学性能优化。系统学习机器学习与深度学习算法，为后续从事电池算法研发奠定理论基础。</p>
        </div>
        <div className="resume-item">
          <div className="resume-item-header">
            <span className="resume-item-title">汽车服务工程 · 学士</span>
            <span className="resume-item-date">2013-2017</span>
          </div>
          <p className="resume-item-desc">系统学习汽车构造、汽车原理、汽车电子技术、发动机原理等专业核心课程。</p>
        </div>
      </div>
      <div className="resume-card">
        <h3 className="resume-section-title">荣誉资质</h3>
        <div className="resume-tags">
          <span className="resume-tag">🏅 国家中级工程师</span>
          <span className="resume-tag">🎖️ 6 Sigma 绿带</span>
          <span className="resume-tag">🏆 中国研究生数学建模竞赛三等奖</span>
          <span className="resume-tag">🥉 全国高中数学联合竞赛三等奖</span>
        </div>
      </div>
    </div>
  )
}

function SkillsSection() {
  const skills = [
    { icon: '🤖', title: 'AI与工程化能力', items: ['CNN-DNN深度学习', 'Transformer', 'XGBoost', '聚类/DNN故障识别', '半监督学习'] },
    { icon: '🧠', title: '算法模型与工具', items: ['SOH/SOC/SOP估计', 'EIS等效电路模型', '卡尔曼滤波(EKF)', '容量预测', '寿命预测(MAPE<3%)'] },
    { icon: '🔋', title: '业务领域', items: ['电池画像算法', '热失控预警', '析锂/内短路检测', '产线分选配组', '云端均衡'] },
    { icon: '👁️', title: '视觉检测', items: ['缺陷识别', '极耳检测', '矿石转化率识别', '正烧正确率＞98%'] },
    { icon: '⚡', title: '嵌入式部署', items: ['C代码嵌入式', '云端协同', 'A0版算法转C部署', '实时推理'] },
    { icon: '🧪', title: '电化学与仿真', items: ['等效电路模拟', '膨胀力建模', 'DRT阻抗分析', '加速老化模型'] },
  ]
  return (
    <div className="resume-grid-3">
      {skills.map(s => (
        <div key={s.title} className="resume-card">
          <div className="resume-skill-header">
            <span className="resume-skill-icon">{s.icon}</span>
            <h3 className="resume-skill-title">{s.title}</h3>
          </div>
          <div className="resume-tags">
            {s.items.map(i => <span key={i} className="resume-tag-sm">{i}</span>)}
          </div>
        </div>
      ))}
    </div>
  )
}

function ExperienceSection() {
  const items = [
    {
      title: '智能化部 · 算法团队负责人',
      date: '2022 - 至今',
      desc: '主导电池画像算法开发，接入2万+台车云端数据，综合故障识别准确率≥80%。负责热失控提前10min预警（准确率≥90%）、析锂/内短路预警算法。带领3人团队产出6项发明专利，团队人均专利产出部门第一。',
      tags: ['AI算法', '团队管理', '电池安全', '云端系统'],
    },
    {
      title: '算法工程师',
      date: '2020 - 2022',
      desc: '从0到1搭建化成分容容量预测系统，预测误差≤1%覆盖99.5%电芯，能耗比从235%降至175%，已完成45Ah方案验证投产。推进IC曲线动态分选配组率提升33%，EIS快速分选，K值异常预测准确率＞95%。',
      tags: ['容量预测', '分选配组', 'EIS', '产线算法'],
    },
  ]
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="resume-card resume-timeline-card">
          <div className="resume-timeline-dot" />
          <div className="resume-item">
            <div className="resume-item-header">
              <span className="resume-item-title">{item.title}</span>
              <span className="resume-item-date">{item.date}</span>
            </div>
            <p className="resume-item-desc">{item.desc}</p>
            <div className="resume-tags">
              {item.tags.map(t => <span key={t} className="resume-tag">{t}</span>)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProjectsSection() {
  const projects = [
    { title: '电池画像算法', desc: '基于长周期+实时数据的多维监控体系，接入2万+台车，准确率≥80%。', color: 'var(--purple)' },
    { title: '热失控预警系统', desc: '提前10min预警（≥90%准确率）、析锂/内短路预警，云端+嵌入式双端部署。', color: 'var(--red)' },
    { title: '容量预测系统', desc: 'XGBoost+二级残差修正，误差≤1%覆盖99.5%电芯，能耗比175%，已投产。', color: 'var(--cyan)' },
    { title: '动态分选配组', desc: 'IC曲线特征动态分选，配组率提升33%，EIS快速分选，K值预测＞95%。', color: 'var(--amber)' },
    { title: 'SOH估计', desc: '稀疏数据误差＜6%，EKF嵌入式精度±3%，极耳断裂召回率＞99%。', color: 'var(--emerald)' },
    { title: 'AI前沿探索', desc: 'Transformer预测EIS(R²0.85)，材料大模型，DRT阻抗分析。', color: 'var(--purple)' },
  ]
  return (
    <div className="resume-grid-2">
      {projects.map(p => (
        <div key={p.title} className="resume-card resume-project-card" style={{borderLeftColor: p.color}}>
          <h3 className="resume-project-title" style={{color: p.color}}>{p.title}</h3>
          <p className="resume-item-desc">{p.desc}</p>
        </div>
      ))}
    </div>
  )
}

function PatentsSection() {
  const patents = [
    '基于EIS的等效电路模型参数辨识方法、装置、终端及存储介质',
    '一种实车电池容量预测方法',
    '一种基于人工智能的锂电池健康度检测方法及系统',
    '一种EIS动态特征的电池安全监测方法、装置、终端及存储介质',
    '一种基于增量容量曲线特征的磷酸铁锂电池动态分选配组方法',
    '一种基于二级残差修正的锂离子电池容量预测算法',
  ]
  return (
    <div className="resume-card">
      <h3 className="resume-section-title">已公示发明专利 · 6项</h3>
      <div className="resume-patents">
        {patents.map((p, i) => (
          <div key={i} className="resume-patent-item">
            <span className="resume-patent-num">{String(i+1).padStart(2,'0')}</span>
            <span>{p}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContactSection() {
  return (
    <div className="resume-card resume-contact-card">
      <h3 className="resume-section-title">联系方式</h3>
      <div className="resume-contact-grid">
        <div className="resume-contact-item">
          <span className="resume-contact-icon">📍</span>
          <span>上海</span>
        </div>
        <div className="resume-contact-item">
          <span className="resume-contact-icon">💻</span>
          <span>github.com/wenwu520beibei</span>
        </div>
        <div className="resume-contact-item">
          <span className="resume-contact-icon">📊</span>
          <span>jiangwenwu.com</span>
        </div>
      </div>
      <p className="resume-contact-note">
        专注于AI算法与电池工程化融合，长期招聘算法实习生，有兴趣可联系。
      </p>
    </div>
  )
}
