import { useState } from 'react'
import './WeddingGate.css'

export default function WeddingGate({ groomName, brideName, date }) {
  const [isOpen, setIsOpen] = useState(false)

  // رابط صورة الباب الأندلسي عالية الجودة
  const gateImageUrl = "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop"

  // تشغيل صوت تحلان الباب الملكي
  const handleOpenGate = () => {
    // صوت تحلان باب خسابي فخم
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3')
    audio.volume = 0.6
    audio.play().catch(() => {}) // لتفادي أي حظر تلقائي للصوت فـ بعض المتصفحات
    
    setIsOpen(true)
  }

  return (
    <div className={`gate-overlay ${isOpen ? 'open' : ''}`}>
      <div className="real-arch-wrapper">
        
        {/* خلفية الباب والأعمدة */}
        <img src={gateImageUrl} alt="Moroccan Palace Gate" className="real-gate-bg" />

        {/* الضلف المتحركة (شمال ويمين) */}
        <div 
          className="door-shutter-left" 
          style={{ backgroundImage: `url(${gateImageUrl})` }} 
        />
        <div 
          className="door-shutter-right" 
          style={{ backgroundImage: `url(${gateImageUrl})` }} 
        />

        {/* الواجهة فـ الوسط (الكتابة بوضوح عالي جداً) */}
        <div className="gate-ui-layer">
          
          {/* الشعار الذهبي البارز (Monogram) */}
          <svg className="moroccan-monogram" viewBox="0 0 100 100" fill="none">
            <path 
              d="M50 5 C30 25 20 45 40 65 C50 75 60 80 50 95 C35 80 15 65 25 35 C30 25 45 15 50 5 Z" 
              fill="url(#goldGradient)" 
            />
            <path 
              d="M50 5 C70 25 80 45 60 65 C50 75 40 80 50 95 C65 80 85 65 75 35 C70 25 55 15 50 5 Z" 
              fill="url(#goldGradient)" 
              opacity="0.85" 
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="30%" stopColor="#fff2cb" />
                <stop offset="70%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#aa7c11" />
              </linearGradient>
            </defs>
          </svg>

          <span className="gate-invitation-title">INVITATION DE MARIAGE</span>
          
          <h2 className="gate-couple-names">
            {groomName || 'Ghazi'} &amp; {brideName || 'Nadia'}
          </h2>
          
          <p className="gate-event-date">{date || '12 DÉCEMBRE 2026'}</p>

          <button className="gate-action-btn" onClick={handleOpenGate}>
            OUVRIR L'INVITATION
          </button>
        </div>

      </div>
    </div>
  )
}
