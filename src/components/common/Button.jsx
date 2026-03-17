const VARIANTS = {
  primary:   'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  danger:    'bg-red-600 text-white hover:bg-red-700',
  ghost:     'text-gray-600 hover:bg-gray-100',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  return (
    <button className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
