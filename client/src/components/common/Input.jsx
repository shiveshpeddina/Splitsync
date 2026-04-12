const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label className="input-label" htmlFor={id}>
          {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {icon && (
          <span
            style={{
              position: 'absolute',
              left: 'var(--space-3)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              fontSize: 'var(--text-lg)',
              pointerEvents: 'none',
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          className="input-field"
          style={icon ? { paddingLeft: 'var(--space-10)' } : {}}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        />
      </div>
      {error && (
        <span style={{ color: 'var(--error)', fontSize: 'var(--text-xs)', marginTop: '2px' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
