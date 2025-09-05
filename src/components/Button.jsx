import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className = '', 
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-accent text-bg hover:bg-accent/90',
    secondary: 'bg-surface text-text-primary hover:bg-surface/80 border border-text-secondary/20',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-accent text-accent hover:bg-accent hover:text-bg',
    ghost: 'text-text-primary hover:bg-surface/50',
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    default: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    icon: 'p-3',
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button