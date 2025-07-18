import React, { useState } from 'react'
import { useTransfer } from '../contexts/TransferContext'
import '../styles/transfer-form.css'

export default function TransferForm() {
  const { loading, error, client, clients, processTransfer } = useTransfer()

  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    toAccount: '',
    description: '',
    referenceCode: '',
  })

  const [formErrors, setFormErrors] = useState({})

  // Genera un código de referencia único
  const generateReferenceCode = () => {
    const code =
      'TRF' +
      Date.now().toString().slice(-8) +
      Math.random().toString(36).substr(2, 4).toUpperCase()
    setFormData((prev) => ({ ...prev, referenceCode: code }))
  }

  // Maneja el cambio en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Validación simple del formulario
  const validateForm = () => {
    const errors = {}

    if (!formData.amount || Number(formData.amount) <= 0) {
      errors.amount = 'El monto debe ser mayor a 0'
    }

    if (!formData.toAccount) {
      errors.toAccount = 'Debes seleccionar una cuenta destino'
    }

    if (!formData.referenceCode) {
      errors.referenceCode = 'El código de referencia es requerido'
    }

    if (formData.description && formData.description.length > 200) {
      errors.description = 'La descripción no puede exceder 200 caracteres'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    // Prepara el payload
    const transferPayload = {
      ...formData,
      amount: Number(formData.amount),
      fromAccount: client?._id,
    }

    try {
      const result = await processTransfer(transferPayload)

      if (result.success) {
        alert('Transferencia creada con éxito')
        setFormData({
          amount: '',
          currency: 'USD',
          toAccount: '',
          description: '',
          referenceCode: '',
        })
      } else {
        alert('Error: ' + result.message)
      }
    } catch (err) {
      alert('Error inesperado: ' + err.message)
    }
  }

  // Filtra la lista para no mostrar la cuenta origen en destino
  const filteredClients = clients?.filter((c) => c._id !== client?._id) || []

  return (
    <div className="transfer-container">
      <div className="transfer-header">
        <h1>Nueva Transferencia</h1>
        <p>Completa los datos para realizar una transferencia</p>
      </div>

      {loading && <p>Cargando datos...</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="transfer-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Monto *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className={formErrors.amount ? 'error' : ''}
            />
            {formErrors.amount && (
              <span className="error-message">{formErrors.amount}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="currency">Moneda *</label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
            >
              <option value="USD">USD - Dólar Americano</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - Libra Esterlina</option>
              <option value="JPY">JPY - Yen Japonés</option>
              <option value="PEN">PEN - Sol Peruano</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Cuenta Origen</label>
          <input
            type="text"
            readOnly
            value={client ? `${client.name} - ${client.accountNumber}` : ''}
            placeholder="Cargando cuenta..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="toAccount">Cuenta Destino *</label>
          <select
            id="toAccount"
            name="toAccount"
            value={formData.toAccount}
            onChange={handleInputChange}
            className={formErrors.toAccount ? 'error' : ''}
          >
            <option value="">Selecciona cuenta destino</option>
            {filteredClients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} - {c.accountNumber}
              </option>
            ))}
          </select>
          {formErrors.toAccount && (
            <span className="error-message">{formErrors.toAccount}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="referenceCode">Código de Referencia *</label>
          <div className="reference-input">
            <input
              type="text"
              id="referenceCode"
              name="referenceCode"
              value={formData.referenceCode}
              onChange={handleInputChange}
              placeholder="Ingresa o genera un código"
              className={formErrors.referenceCode ? 'error' : ''}
            />
            <button
              type="button"
              onClick={generateReferenceCode}
              className="generate-btn"
            >
              Generar
            </button>
          </div>
          {formErrors.referenceCode && (
            <span className="error-message">{formErrors.referenceCode}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción (Opcional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Concepto de la transferencia..."
            maxLength="200"
            rows="3"
            className={formErrors.description ? 'error' : ''}
          />
          <div className="char-count">{formData.description.length}/200 caracteres</div>
          {formErrors.description && (
            <span className="error-message">{formErrors.description}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Procesando...' : 'Crear Transferencia'}
          </button>
        </div>
      </form>
    </div>
  )
}
