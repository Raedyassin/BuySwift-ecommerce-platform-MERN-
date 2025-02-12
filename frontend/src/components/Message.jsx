
export default function Message({ variant, children }) {
  const getVariant = () => {
    switch (variant) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }
  return (
    <div className={`px-4 py-3 rounded  ${getVariant()}`}>{children}</div>
  )
}
