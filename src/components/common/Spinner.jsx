export default function Spinner({ className = 'h-7 w-7' }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600 ${className}`}
    />
  )
}
