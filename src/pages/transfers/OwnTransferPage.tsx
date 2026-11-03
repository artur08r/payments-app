import { useState, type FormEvent } from 'react'
import {
  AccountSelect, AmountInput, Field, SubmitButton, Success, Summary, TransferLayout, amountError, parseAmount,
} from '../../components/transfer'
import { accounts, type Account } from '../../data/mock'

export default function OwnTransferPage() {
  const [from, setFrom] = useState<Account | null>(null)
  const [to, setTo] = useState<Account | null>(null)
  const [rawAmount, setRawAmount] = useState('')
  const [done, setDone] = useState(false)

  const amount = parseAmount(rawAmount)
  const amountErr = amountError(amount, from)
  const valid = !!from && !!to && from.id !== to.id && amount > 0 && !amountErr

  const chooseFrom = (a: Account) => {
    setFrom(a)
    if (to?.id === a.id) setTo(null)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (valid) setDone(true)
  }

  return (
    <TransferLayout title="Перевод между своими счетами">
      {done ? <Success amount={amount} to={to!.title} /> : (
        <form className="form" onSubmit={submit}>
          <Field label="Списать с">
            <AccountSelect accounts={accounts} value={from} onChange={chooseFrom} placeholder="Выберите источник списания" />
          </Field>
          <Field label="Зачислить на">
            <AccountSelect accounts={accounts.filter((a) => a.id !== from?.id)} value={to} onChange={setTo} placeholder="Выберите источник зачисления" />
          </Field>
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
