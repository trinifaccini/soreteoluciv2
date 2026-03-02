import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'


export default function Welcome() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="welcome">
      <h1>Sorteo Solidario</h1>

      <div className="welcome-card">
        <p>
          Gracias por colaborar.
        </p>

        <p>
          Cada número comprado es un paso más para cumplir un sueño 💛
        </p>

        <h3>¿Cómo participar?</h3>

        <ol>
          <li>Elegí tu número 🎟️ (del 1 al 1000!)  </li>
          <li>Hacé la transferencia de $10.000 al alias <strong>luchi.ferrari27</strong></li>
          <li>Subí tu comprobante</li>
          <li>Recibí la confirmación por email :) </li>
        </ol>

        <p className="disclaimer" style={{ marginBottom: '16px', color: '#e0e0e072' }}>Tené en cuenta que al seleccionar un número, va a quedar reservado hasta completar el pago.</p>

        <button
          className="welcome-button"
          onClick={() => navigate('/rifa')}
        >
          Ver números disponibles
        </button>
      </div>
    </div>
  )
}
