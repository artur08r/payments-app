import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, ChevronLeft, CircleCheck, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Account } from '../data/mock'
import { formatRub } from '../format'

// Общие куски форм переводов: каркас страницы, выбор счёта, сумма, итог

export function TransferLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="panel transfer">
      <div className="transfer-head">
        <Link to="/?tab=transfers" className="back"><ChevronLeft size={18} /> Переводы</Link>
        <h1>{title}</h1>
      </div>
      <div className="transfer-body">{children}</div>
    </section>
  )
}

export function Field({ label, hint, error, children }: { label: string; hint?: ReactNode; error?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {error ? <span className="field-error">{error}</span> : hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

function AccountIcon({ account }: { account: Account }) {
  return account.kind === 'card'
    ? <span className="card-badge">МИР</span>
    : <span className="round-icon tiny"><Wallet size={14} /></span>
}

export function AccountSelect({ accounts, value, onChange, placeholder = 'Выберите счёт' }: {
  accounts: Account[]
  value: Account | null
  onChange: (a: Account) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div className="select" ref={ref}>
      <button type="button" className={open ? 'input select-btn focused' : 'input select-btn'} onClick={() => setOpen(!open)}>
        {value ? (
          <>
            <AccountIcon account={value} />
            <span className="select-title">{value.title}</span>
            <span>{formatRub(value.balance)}</span>
          </>
        ) : (
          <span className="placeholder select-title">{placeholder}</span>
        )}
        <ChevronDown size={20} className="muted" />
      </button>
      {open && (
        <div className="select-menu">
          {accounts.map((a) => (
            <button type="button" key={a.id} className="select-option" onClick={() => { onChange(a); setOpen(false) }}>
              <AccountIcon account={a} />
              <span className="select-title">{a.title}</span>
              <span>{formatRub(a.balance)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function parseAmount(raw: string) {
  const n = Number(raw.replace(/\s/g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

export function amountError(amount: number, from: Account | null) {
  if (from && amount > from.balance) return 'Недостаточно средств'
  return undefined
}

export function AmountInput({ value, onChange, placeholder = '0 ₽' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      className="input"
      inputMode="decimal"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ''))}
    />
  )
}

// Комиссии пока нет — блок готов к тому, чтобы её посчитать
export function Summary({ amount }: { amount: number }) {
  if (amount <= 0) return <div className="summary muted-text">Здесь мы рассчитываем итоговую сумму</div>
  return (
    <div className="summary">
      <div className="summary-row"><span>Комиссия</span><span>{formatRub(0)}</span></div>
      <div className="summary-row total"><span>Итого к списанию</span><span>{formatRub(amount)}</span></div>
    </div>
  )
}

export function SubmitButton({ disabled, children }: { disabled: boolean; children: ReactNode }) {
  return <button type="submit" className="btn-primary" disabled={disabled}>{children}</button>
}

export function Success({ amount, to }: { amount: number; to: string }) {
  return (
    <div className="success">
      <CircleCheck size={56} strokeWidth={1.5} className="success-icon" />
      <h2>Перевод отправлен</h2>
      <p className="muted-text">{formatRub(amount)} · {to}</p>
      <Link to="/?tab=transfers" className="btn-primary link">Вернуться к переводам</Link>
    </div>
  )
}
