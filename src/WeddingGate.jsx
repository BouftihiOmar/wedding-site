import { useState } from 'react'
import './WeddingGate.css'

export default function WeddingGate({ groomName, brideName, initials, date }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`gate-overlay ${isOpen ? 'open' : 'closed'}`}>
      <div className="arch-frame">
        {/* الباب اليسار واليمن وسط القوس بالضبط */}
        <div className="door-panel-left">
          <div className="door-handle-left" />
        </div>
        <div className="door-panel-right">
          <div className="door-handle-right" />
        </div>

        {/* النصوص والزر */}
        <div className="gate-text-box">
          <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#c79a4b' }}>INVITATION</span>
          <h1 style={{ fontSize: '42px', margin: '10px 0', color: '#e3c384' }}>{initials || 'A & B'}</h1>
          <p style={{ fontSize: '18px', fontStyle: 'italic' }}>{groomName} & {brideName}</p>
          <p style={{ fontSize: '10px', marginTop: '5px', color: '#ccc' }}>{date}</p>
          
          <button className="gate-btn" onClick={() => setIsOpen(true)}>
            Ouvrir l'invitation
          </button>
        </div>
      </div>
    </div>
  )
}
