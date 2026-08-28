import { useState } from 'react'
import './WeddingGate.css'

export default function WeddingGate({ groomName, brideName, initials, date }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`gate-overlay ${isOpen ? 'open' : 'closed'}`}>
      <div className="royal-palace-frame">
        
        {/* التاج القوسي أعلى الباب الأندلسي */}
        <div className="arch-carving-top">
          <svg className="arch-pattern-svg" viewBox="0 0 200 100" preserveAspectRatio="none">
            <path 
              d="M0,100 Q100,-20 200,100 Z" 
              fill="none" 
              stroke="#d4af37" 
              strokeWidth="2" 
            />
            <path 
              d="M20,100 Q100,0 180,100 Z" 
              fill="none" 
              stroke="#8a6d2b" 
              strokeWidth="1.5" 
              strokeDasharray="4 2" 
            />
          </svg>
        </div>

        {/* الأبواب الذهبية والمنقوشة */}
        <div className="doors-container">
          <div className="royal-door-left">
            <div className="door-engraving" />
            <div className="royal-handle-left" />
          </div>
          
          <div className="royal-door-right">
            <div className="door-engraving" />
            <div className="royal-handle-right" />
          </div>

          {/* محتوى الشعار والنصوص والزر فـ الوسط */}
          <div className="gate-content-layer">
            
            {/* الشعار الذهبي المتوهج (Calligraphy Arabic Symbol SVG) */}
            <div className="glowing-monogram">
              <svg width="75" height="75" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M50 10 C30 30 25 50 45 65 C55 72 65 78 50 90 C35 75 20 60 30 35 C35 28 45 20 50 10 Z" 
                  fill="url(#goldGrad)" 
                />
                <path 
                  d="M55 20 C70 35 75 55 60 70 C50 80 40 85 55 95 C70 80 85 65 75 40 C70 30 60 22 55 20 Z" 
                  fill="url(#goldGrad)" 
                  opacity="0.85" 
                />
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fff3cc" />
                    <stop offset="50%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#aa7c11" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <span className="royal-subtitle">INVITATION DE MARIAGE</span>
            
            <h2 className="royal-names">
              {groomName || 'Ghazi'} &amp; {brideName || 'Nadia'}
            </h2>
            
            <p className="royal-date">{date || '12 DÉCEMBRE 2026'}</p>

            <button className="royal-open-btn" onClick={() => setIsOpen(true)}>
              OUVRIR L'INVITATION
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
