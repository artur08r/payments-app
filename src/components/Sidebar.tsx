import { ChevronUp, Link2, Wallet } from 'lucide-react'
import { card, wallet } from '../data/mock'
import { formatRub } from '../format'

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <section className="panel">
        <div className="panel-head">
          <h3>Кошельки</h3>
          <ChevronUp size={18} />
        </div>
        <div className="row">
          <div>
            <div className="small">{wallet.title}</div>
            <div className="balance">{formatRub(wallet.balance)}</div>
          </div>
          <span className="round-icon big"><Wallet size={20} /></span>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>Карты</h3>
          <ChevronUp size={18} />
        </div>
        <div className="row">
          <div>
            <div className="small ellipsis">{card.title}</div>
            <div className="balance">{formatRub(card.balance)}</div>
          </div>
          <div className="card-meta">
            <div className="small">·· {card.last4}</div>
            <span className="card-badge">МИР</span>
          </div>
        </div>
        <div className="divider" />
        <div className="row">
          <div className="small">Привязать карту другого банка</div>
          <Link2 size={18} />
        </div>
      </section>
    </aside>
  )
}
