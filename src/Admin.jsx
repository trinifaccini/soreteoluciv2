import { useState } from 'react'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [numbers, setNumbers] = useState(null)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [emailFilter, setEmailFilter] = useState('')

  const ITEMS_PER_PAGE = 20

  const login = async () => {
    setError(null)

    const res = await fetch('/.netlify/functions/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })

    if (!res.ok) {
      setError('Password incorrecta')
      return
    }

    const data = await res.json()
    setNumbers(data.numbers)
  }

  const exportCSV = () => {
    const taken = Object.entries(numbers)
      .filter(([_, data]) => data.status === 'taken')

    if (taken.length === 0) {
      alert('No hay números vendidos')
      return
    }

    let csv = 'Numero,Nombre,Email,Fecha\n'

    taken.forEach(([num, data]) => {
      csv += `${num},"${data.name}","${data.email}",${data.date}\n`
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'rifa_vendidos.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // LOGIN
  if (!numbers) {
    return (
      <div className="admin-container">
        <h2>Panel Interno</h2>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input"
        />

        <button onClick={login} className="admin-button">
          Entrar
        </button>

        {error && <p className="admin-error">{error}</p>}
      </div>
    )
  }

  // FILTRO
  const vendidos = Object.entries(numbers)
    .filter(([_, data]) => data.status === 'taken')
    .filter(([_, data]) =>
      data.email?.toLowerCase().includes(emailFilter.toLowerCase())
    )
    .sort((a, b) => Number(a[0]) - Number(b[0]))

  const totalPages = Math.ceil(vendidos.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedVendidos = vendidos.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  return (
    <div className="admin-container">
      <h2>Panel Interno</h2>

      <div className="admin-toolbar">
        <strong>Total vendidos: {vendidos.length}</strong>

        <button onClick={exportCSV} className="admin-button">
          Exportar CSV
        </button>

        <input
          type="text"
          placeholder="Filtrar por email..."
          value={emailFilter}
          onChange={(e) => {
            setEmailFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="admin-input"
        />
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            ←
          </button>

          <span>
            Página {currentPage} de {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            →
          </button>
        </div>
      )}

      {/* TABLA COMPACTA */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>📎</th>
            </tr>
          </thead>

          <tbody>
            {paginatedVendidos.map(([num, data]) => (
              <tr key={num}>
                <td>{num}</td>
                <td>{data.name}</td>
                <td className="admin-email">
                  {data.email?.length > 28
                    ? data.email.slice(0, 28) + '...'
                    : data.email}
                </td>
                <td>
                  {data.proofKey ? (
                    <a
                      href={`/.netlify/functions/download?key=${data.proofKey}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vendidos.length === 0 && (
        <p>No hay resultados para ese filtro.</p>
      )}
    </div>
  )
}
