//Button
//import './Button.css'

export const Button = ({ text = 'Enviar', type = 'button' }) => {
  return (
    <button className="Btn" type={type}>
      {text}
    </button>
  )
}

