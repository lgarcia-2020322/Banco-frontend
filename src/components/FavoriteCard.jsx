import { FaUniversity, FaMoneyBillWave, FaHashtag, FaCalendarAlt } from 'react-icons/fa'

export const FavoriteCard = ({ fav, onDelete, index, exiting }) => {
  const fecha = new Date(fav.createdAt).toLocaleDateString()

  return (
    <div
      className={`favorite-item ${exiting ? 'exit' : ''}`}
      style={{ animationDelay: `${index * 0.07}s` }}
    >
      <img
        src={`/src/assets/banks/${fav.bankName.toLowerCase()}.png`}
        alt={fav.bankName}
        className="bank-logo"
        onError={(e) => { e.target.style.display = 'none' }}
      />

      <h3>{fav.alias}</h3>

      <p><FaHashtag /> Cuenta: {fav.accountNumber}</p>
      <p><FaUniversity /> Banco: {fav.bankName}</p>
      <p>
        <FaMoneyBillWave /> Moneda:{' '}
        <span style={{
          color:
            fav.currency === 'GTQ' ? '#66ff99' :
            fav.currency === 'USD' ? '#66ccff' :
            fav.currency === 'EUR' ? '#ffc266' :
            '#ffffff'
        }}>
          {fav.currency}
        </span>
      </p>

      <p><FaCalendarAlt /> Agregado el: {fecha}</p>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => onDelete(fav._id)}>Eliminar</button>
      </div>
    </div>
  )
}
