'use client'

import { useState } from 'react'
import { ChevronDown, Search, Copy, Check } from 'lucide-react'

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText('import dectra\nclient = dectra.Client()\nresult = client.verify(document="passport.jpg")')
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 1500)
  }

  return (
    <div style={{ '--bg-base': '#0c0c0e', '--bg-surface': '#131316', '--bg-elevated': '#1a1a1f', '--border-subtle': 'rgba(255,255,255,.07)', '--border-default': 'rgba(255,255,255,.12)', '--text-primary': '#f0eff4', '--text-secondary': '#9997a8', '--text-muted': '#5e5c70', '--accent': '#7c6ff7', '--accent-hover': '#9487fa', '--success': '#34c97a', '--code-bg': '#161619', '--code-keyword': '#c792ea', '--code-string': '#c3e88d', '--code-comment': '#546e7a', '--code-fn': '#82aaff', '--code-plain': '#d0d0e0' } as React.CSSProperties}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { font-family: 'Inter', system-ui, sans-serif; }
        body { background-color: var(--bg-base); color: var(--text-primary); }
        .topbar { position: fixed; top: 0; left: 0; right: 0; height: 56px; background-color: var(--bg-surface); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; z-index: 100; }
        .topbar-left { display: flex; align-items: center; gap: 12px; }
        .logo-mark { width: 24px; height: 24px; background: linear-gradient(135deg, var(--accent), #a78bfa); border-radius: 6px; }
        .logo { font-size: 15px; font-weight: 600; }
        .docs-dropdown { background: none; border: none; color: var(--text-secondary); font-size: 14px; display: flex; align-items: center; gap: 4px; cursor: pointer; }
        .search-box { background-color: var(--bg-elevated); border: 1px solid var(--border-default); border-radius: 6px; padding: 6px 12px; color: var(--text-secondary); font-size: 13px; display: flex; align-items: center; gap: 6px; }
        .api-btn { background-color: var(--accent); color: white; border: none; border-radius: 6px; padding: 6px 13px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .sidebar { position: fixed; left: 0; top: 56px; width: 260px; height: calc(100vh - 56px); background-color: var(--bg-surface); border-right: 1px solid var(--border-subtle); overflow-y: auto; padding: 24px 0; }
        .sidebar-title { font-size: 11px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); padding: 12px 16px; letter-spacing: 0.07em; }
        .sidebar-item { font-size: 14px; color: var(--text-secondary); padding: 7px 16px; cursor: pointer; display: block; text-decoration: none; }
        .sidebar-item.active { border-left: 2px solid var(--accent); background-color: var(--accent-dim); color: var(--text-primary); padding-left: 14px; }
        .main { margin-left: 260px; margin-top: 56px; padding: 48px; max-width: 800px; }
        .hero { background: linear-gradient(135deg, var(--bg-surface), var(--bg-elevated)); border: 1px solid var(--border-default); border-radius: 16px; padding: 48px; margin-bottom: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
        .status-pill { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--border-default); background-color: var(--bg-elevated); border-radius: 99px; padding: 8px 12px; font-size: 13px; color: var(--text-secondary); margin-bottom: 24px; width: fit-content; }
        .status-dot { width: 8px; height: 8px; background-color: var(--success); border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 var(--success); } 50% { box-shadow: 0 0 0 6px rgba(52,201,122,0.2); } }
        h1 { font-size: 40px; font-weight: 600; line-height: 1.2; margin-bottom: 16px; }
        h2 { font-size: 28px; font-weight: 600; margin-bottom: 24px; margin-top: 48px; }
        .gradient-text { background: linear-gradient(135deg, var(--accent), #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        p { font-size: 15px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 16px; }
        .buttons { display: flex; gap: 12px; margin-top: 24px; }
        .btn { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; }
        .btn-primary { background-color: var(--accent); color: white; }
        .btn-ghost { background: transparent; border: 1px solid var(--border-default); color: var(--text-secondary); }
        .code-block { background-color: var(--code-bg); border: 1px solid var(--border-default); border-radius: 12px; overflow: hidden; }
        .code-header { background-color: var(--bg-elevated); border-bottom: 1px solid var(--border-subtle); padding: 0 8px; display: flex; justify-content: space-between; align-items: center; height: 40px; }
        .code-tabs { display: flex; gap: 2px; }
        .code-tab { padding: 10px 12px; font-size: 13px; color: var(--text-muted); cursor: pointer; border: none; background: none; }
        .code-tab.active { color: var(--text-primary); border-bottom: 2px solid var(--accent); }
        .code-copy { width: 28px; height: 28px; background: transparent; border: 1px solid var(--border-subtle); border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-secondary); }
        .code-body { background-color: var(--code-bg); padding: 20px; overflow-x: auto; }
        pre { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 13px; line-height: 1.6; }
        code { color: var(--code-plain); }
        .kw { color: var(--code-keyword); }
        .str { color: var(--code-string); }
        .cm { color: var(--code-comment); }
        .fn { color: var(--code-fn); }
        .models { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 48px; }
        .model-card { background-color: var(--bg-surface); border: 1px solid var(--border-default); border-radius: 12px; padding: 24px; }
        .model-card.featured { border-left: 3px solid var(--accent); }
        .model-card h3 { margin-bottom: 8px; }
        .specs { border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); padding: 12px 0; margin: 16px 0; font-size: 13px; }
        .spec-row { display: flex; justify-content: space-between; padding: 6px 0; }
        .spec-label { color: var(--text-muted); }
        .spec-value { color: var(--text-primary); font-weight: 600; }
        .playground { display: grid; grid-template-columns: 60% 40%; gap: 32px; margin-bottom: 48px; }
        .playground-tabs { display: flex; gap: 4px; background-color: var(--bg-elevated); border-radius: 99px; padding: 4px; width: fit-content; margin-bottom: 20px; }
        .play-tab { padding: 8px 14px; border-radius: 99px; border: none; background: transparent; color: var(--text-secondary); font-size: 13px; cursor: pointer; }
        .play-tab.active { background-color: var(--accent); color: white; }
        a { color: var(--accent); text-decoration: none; }
        .footer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-bottom: 48px; padding-top: 32px; border-top: 1px solid var(--border-subtle); }
        .footer-col h3 { font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--text-muted); margin-bottom: 16px; }
        .footer-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border-subtle); font-size: 14px; }
        @media (max-width: 768px) { .sidebar { display: none; } .main { margin-left: 0; } .footer-grid { grid-template-columns: 1fr; } .hero { grid-template-columns: 1fr; } .playground { grid-template-columns: 1fr; } }
      `}</style>

      <div className="topbar">
        <div className="topbar-left">
          <div className="logo-mark"></div>
          <div className="logo">Dectra</div>
        </div>
        <button className="docs-dropdown">Docs <ChevronDown size={14} /></button>
        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          <div className="search-box"><Search size={14} /> ⌘K</div>
          <button className="api-btn">API Console</button>
        </div>
      </div>

      <div className="sidebar">
        <div style={{marginBottom: '24px'}}>
          <div className="sidebar-title">Get Started</div>
          <a href="#" className="sidebar-item active">Welcome</a>
          <a href="#" className="sidebar-item">Quickstart</a>
          <a href="#" className="sidebar-item">Models</a>
          <a href="#" className="sidebar-item">Pricing</a>
        </div>
        <div style={{marginBottom: '24px'}}>
          <div className="sidebar-title">Build</div>
          <a href="#" className="sidebar-item">Getting Started</a>
          <a href="#" className="sidebar-item">Integration</a>
          <a href="#" className="sidebar-item">API Reference</a>
        </div>
        <div>
          <div className="sidebar-title">Resources</div>
          <a href="#" className="sidebar-item">Verification</a>
          <a href="#" className="sidebar-item">Compliance</a>
          <a href="#" className="sidebar-item">Security</a>
        </div>
      </div>

      <div className="main">
        <div className="hero">
          <div>
            <div className="status-pill"><span className="status-dot"></span>Available</div>
            <h1>Accelerate <span className="gradient-text">Identity Verification</span></h1>
            <p>Complete identity verification solution with document validation, face recognition, and compliance reporting.</p>
            <div className="buttons">
              <button className="btn btn-primary">Create API key →</button>
              <button className="btn btn-ghost">Get Started</button>
            </div>
          </div>

          <div className="code-block">
            <div className="code-header">
              <div className="code-tabs">
                <button className="code-tab active">Python</button>
                <button className="code-tab">JavaScript</button>
              </div>
              <button className="code-copy" onClick={copyToClipboard}>{copiedCode ? <Check size={14} /> : <Copy size={14} />}</button>
            </div>
            <div className="code-body">
              <pre><code><span className="kw">import</span> dectra<br/><span className="cm"># Init</span><br/>client <span className="fn">=</span> dectra.Client()<br/><br/>result <span className="fn">=</span> client.verify(<br/>  doc<span className="fn">=</span><span className="str">&quot;passport.jpg&quot;</span><br/>)</code></pre>
            </div>
          </div>
        </div>

        <h2>Models</h2>
        <div className="models">
          <div className="model-card featured">
            <h3>Document Verification</h3>
            <p>Extract and verify identity documents with 99.8% accuracy</p>
            <div className="specs">
              <div className="spec-row"><span className="spec-label">Accuracy</span><span className="spec-value">99.8%</span></div>
              <div className="spec-row"><span className="spec-label">Speed</span><span className="spec-value">&lt;200ms</span></div>
            </div>
          </div>

          <div className="model-card">
            <h3>Face Recognition</h3>
            <p>Liveness detection and facial matching</p>
            <div className="specs">
              <div className="spec-row"><span className="spec-label">Accuracy</span><span className="spec-value">99.2%</span></div>
              <div className="spec-row"><span className="spec-label">Speed</span><span className="spec-value">&lt;150ms</span></div>
            </div>
          </div>

          <div className="model-card">
            <h3>Risk Assessment</h3>
            <p>Real-time risk scoring and fraud detection</p>
            <div className="specs">
              <div className="spec-row"><span className="spec-label">Coverage</span><span className="spec-value">180+ Countries</span></div>
              <div className="spec-row"><span className="spec-label">Updates</span><span className="spec-value">Real-time</span></div>
            </div>
          </div>
        </div>

        <h2>Jump straight in</h2>
        <div className="playground">
          <div>
            <div className="playground-tabs">
              <button className="play-tab active">Text</button>
              <button className="play-tab">Voice</button>
              <button className="play-tab">Image</button>
              <button className="play-tab">Video</button>
            </div>
            <div className="code-block">
              <div className="code-body">
                <pre><code><span className="kw">const</span> client <span className="fn">=</span> <span className="kw">new</span> DectraClient()<br/><span className="kw">const</span> result <span className="fn">=</span> <span className="kw">await</span> client.verify()</code></pre>
              </div>
            </div>
          </div>
          <div>
            <h3>Document Verification</h3>
            <ul style={{marginLeft: '16px', marginBottom: '16px', color: 'var(--text-secondary)'}}>
              <li>✓ Real-time verification</li>
              <li>✓ Global coverage</li>
              <li>✓ 99.8% accuracy</li>
            </ul>
            <div style={{fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px'}}>Starting from</div>
            <div style={{fontSize: '24px', fontWeight: '700', marginBottom: '16px'}}>$0.50</div>
            <a href="#">Read docs →</a>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <h3>Getting Started</h3>
            <div className="footer-item"><a href="#">Quickstart</a><span>↗</span></div>
            <div className="footer-item"><a href="#">API Reference</a><span>↗</span></div>
          </div>
          <div className="footer-col">
            <h3>Integration</h3>
            <div className="footer-item"><a href="#">SDK Guides</a><span>↗</span></div>
            <div className="footer-item"><a href="#">Webhooks</a><span>↗</span></div>
          </div>
          <div className="footer-col">
            <h3>Resources</h3>
            <div className="footer-item"><a href="#">Community</a><span>↗</span></div>
            <div className="footer-item"><a href="#">Status</a><span>↗</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}