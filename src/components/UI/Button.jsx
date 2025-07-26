import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  className = '',
  disabled = false
}) => {
  const baseClasses = "btn";
  
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    danger: "btn-danger"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;