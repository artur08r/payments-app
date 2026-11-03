import { useState, type FormEvent } from 'react'
import {
  AccountSelect, AmountInput, Field, SubmitButton, Success, Summary, TransferLayout, amountError, parseAmount,
} from '../../components/transfer'
import { accounts } from '../../data/mock'

function formatCard(raw: string) {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
}

// Алгоритм Луна — контрольная сумма номера карты
function luhn(digits: string) {
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let n = Number(digits[digits.length - 1 - i])
    if (i % 2 === 1) n = n * 2 > 9 ? n * 2 - 9 : n * 2
    sum += n
  }
  return sum % 10 === 0
}

export default function CardTransferPage() {
  const [from, setFrom] = useState(accounts[0])
  const [cardNumber, setCardNumber] = useState('')
  const [rawAmount, setRawAmount] = useState('')
  const [done, setDone] = useState(false)

  const digits = cardNumber.replace(/\D/g, '')
  const cardErr = digits.length === 16 && !luhn(digits) ? 'Проверьте номер карты' : undefined
  const amount = parseAmount(rawAmount)
  const amountErr = amountError(amount, from)
  const valid = digits.length === 16 && !cardErr && amount > 0 && !amountErr

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (valid) setDone(true)
  }

  return (
    <TransferLayout title="Перевод по номеру карты">
      {done ? <Success amount={amount} to={`карта ·· ${digits.slice(-4)}`} /> : (
        <form className="form" onSubmit={submit}>
          <div className="group">
            <h3>Списать с</h3>
            <AccountSelect accounts={accounts} value={from} onChange={setFrom} />
          </div>
          <div className="group">
            <h3>Карта получателя</h3>
            <Field label="Номер карты" error={cardErr}>
              <input className="input" inputMode="numeric" placeholder="1234 4567 8901 2345" value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))} />
            </Field>
          </div>
          <Field label="Сумма перевода" error={amountErr}>
            <AmountInput value={rawAmount} onChange={setRawAmount} />
          </Field>
          <Summary amount={amount} />
          <SubmitButton disabled={!valid}>Перевести</SubmitButton>
        </form>
      )}
    </TransferLayout>
  )
}
