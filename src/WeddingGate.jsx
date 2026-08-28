import { useState } from 'react'
import './WeddingGate.css'

export default function WeddingGate({ groomName, brideName, date }) {
  const [isOpen, setIsOpen] = useState(false)

  // رابط الصورة الأندلسية الفاخرة ذات الجودة العالية
  const gateImageUrl = "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop"

  return (
    <div className={`gate-overlay ${isOpen ? 'open' : ''}`}>
      <div className="real-arch-wrapper">
        
        {/* خلفية الباب والأعمدة الرخامية */}
        <img src={gateImageUrl} alt="Moroccan Gate" className="real-gate-bg" />
        <div className="gate-glow-overlay" />

        {/* الضلف المتحركة (شمال ويمين) */}
        <div 
          className="door-shutter-left" 
          style={{ backgroundImage: `url(${gateImageUrl})` }} 
        />
        <div 
          className="door-shutter-right" 
          style={{ backgroundImage: `url(${gateImageUrl})` }} 
        />

        {/* الواجهة فـ الوسط (الشعار والكتابة والزر) */}
        <div className="gate-ui-layer">
          
          {/* الشعار الذهبي (Monogram) */}
          <svg className="moroccan-monogram" viewBox="0 0 100 100" fill="none">
            <path 
              d="M50 5 C30 25 20 45 40 65 C50 75 60 80 50 95 C35 80 15 65 25 35 C30 25 45 15 50 5 Z" 
              fill="url(#goldGradient)" 
            />
            <path 
              d="M50 5 C70 25 80 45 60 65 C50 75 40 80 50 95 C65 80 85 65 75 35 C70 25 55 15 50 5 Z" 
              fill="url(#goldGradient)" 
              opacity="0.8" 
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fff2cb" />
                <stop offset="50%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#99751e" />
              </linearGradient>
            </defs>
          </svg>

          <span className="gate-invitation-title">INVITATION</span>
          
          <h2 className="gate-couple-names">
            {groomName || 'Ghazi'} &amp; {brideName || 'Nadia'}
          </h2>
          
          <p className="gate-event-date">{date || '12 DÉCEMBRE 2026'}</p>

          <button className="gate-action-btn" onClick={() => setIsOpen(true)}>
            OUVRIR L'INVITATION
          </button>
        </div>

      </div>
    </div>
  )
}
