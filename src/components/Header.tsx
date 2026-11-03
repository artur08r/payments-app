import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <span className="logo">Pay</span>
        <nav className="nav">
          <NavLink to="/" end className="nav-link">Платежи и переводы</NavLink>
          <NavLink to="/history" className="nav-link">История</NavLink>
        </nav>
      </div>
    </header>
  )
}
