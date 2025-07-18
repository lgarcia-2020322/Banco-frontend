import React, { useState, useEffect } from "react";
import { useDepositMovement } from "../contexts/DepositMovementContext"; 
import styles from "../styles/DepositForm.module.css"; 
const DepositPage = () => {
  const { processDepositAndMovement } = useDepositMovement();
  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    account: "", // This will be set from the client ID
    method: "cash",
    referenceCode: "",
    status: "pending",
    balanceAfter: "", // Added for the movement schema
    description: "", // Added for the movement schema
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [clientAccounts, setClientAccounts] = useState([
    { _id: "client1", name: "Cliente 001 - Juan Pérez" },
    { _id: "client2", name: "Cliente 002 - María García" },
    { _id: "client3", name: "Cliente 003 - Carlos López" },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateReferenceCode = () => {
    const code = "DEP-" + Date.now().toString().slice(-8);
    setFormData((prev) => ({
      ...prev,
      referenceCode: code,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic client-side validation
    if (
      !formData.amount ||
      !formData.currency ||
      !formData.method ||
      !formData.referenceCode ||
      !formData.account // Ensure account is selected
    ) {
      setMessage("Por favor, complete todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    const result = await processDepositAndMovement({
      ...formData,
      balanceAfter: parseFloat(formData.amount) + 1000, // Placeholder: Replace with actual balance logic
    });

    if (result.success) {
      setMessage("Depósito y movimiento creados con éxito!");
      // Reset form on success
      setFormData({
        amount: "",
        currency: "USD",
        account: "",
        method: "cash",
        referenceCode: "",
        status: "pending",
        balanceAfter: "",
        description: "",
      });
    } else {
      setMessage(`Error: ${result.message}`);
    }
    setLoading(false);
  };

  return (
    <div className={styles["deposit-container"]}>
      <div className={styles["deposit-header"]}>
        <h1>Crear Depósito</h1>
        <p>Complete la información para registrar un nuevo depósito</p>
      </div>

      <div className={styles["deposit-form-wrapper"]}>
        {message && (
          <p
            className={
              message.includes("Error") ? styles.errorMessage : styles.successMessage
            }
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className={styles["deposit-form"]}>
          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="amount">Monto *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                required
                placeholder="0.00"
              />
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="currency">Moneda *</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                required
              >
                <option value="USD">USD - Dólar Americano</option>
                <option value="EUR">EUR - Euro</option>
                <option value="PEN">PEN - Sol Peruano</option>
                <option value="GTQ">GTQ - Quetzal Guatemalteco</option> {/* Added GTQ as per movement schema */}
              </select>
            </div>
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="account">Cuenta Cliente *</label>
              <select
                id="account"
                name="account"
                value={formData.account}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar cuenta</option>
                {/* Dynamically render client accounts */}
                {clientAccounts.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="method">Método de Depósito *</label>
              <select
                id="method"
                name="method"
                value={formData.method}
                onChange={handleInputChange}
                required
              >
                <option value="cash">Efectivo</option>
                <option value="external_transfer">Transferencia Externa</option>
                <option value="check">Cheque</option>
              </select>
            </div>
          </div>

          <div className={styles["form-row"]}>
            <div className={styles["form-group"]}>
              <label htmlFor="referenceCode">Código de Referencia *</label>
              <div className={styles["reference-input-group"]}>
                <input
                  type="text"
                  id="referenceCode"
                  name="referenceCode"
                  value={formData.referenceCode}
                  onChange={handleInputChange}
                  required
                  placeholder="DEP-12345678"
                />
                <button
                  type="button"
                  className={styles["generate-btn"]}
                  onClick={generateReferenceCode}
                >
                  Generar
                </button>
              </div>
            </div>

            <div className={styles["form-group"]}>
              <label htmlFor="status">Estado</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="pending">Pendiente</option>
                <option value="completed">Completado</option>
                <option value="rejected">Rechazado</option>
              </select>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label htmlFor="description">Descripción (Opcional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              maxLength="200"
              placeholder="Notas adicionales sobre el depósito"
              className={styles.textarea}
            ></textarea>
          </div>

          <div className={styles["form-actions"]}>
            <button type="button" className={styles["btn-cancel"]}>
              Cancelar
            </button>
            <button
              type="submit"
              className={styles["btn-submit"]}
              disabled={loading}
            >
              {loading ? "Procesando..." : "Crear Depósito"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepositPage;