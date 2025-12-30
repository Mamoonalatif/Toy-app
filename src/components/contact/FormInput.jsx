export default function FormInput({ label, error, type = 'text', required = false, ...props }) {
  return (
    <div className={`form-group ${error ? 'has-error' : ''}`}>
      {label && <label>{label}{required && <span style={{color:'#ef4444',marginLeft:4}}>*</span>}</label>}
      {type === 'textarea' ? <textarea required={required} {...props} /> : <input type={type} required={required} {...props} />}
      {error && <span className="error-text">{error}</span>}
    </div>
  )
}
