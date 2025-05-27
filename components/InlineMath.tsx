interface InlineMathProps {
  expression: string
  className?: string
}

export function InlineMath({ expression, className = "" }: InlineMathProps) {
  // Handle special mathematical expressions
  const renderExpression = (expr: string) => {
    // Handle delta symbol
    if (expr === "δ") {
      return <span className="font-serif text-lg">δ</span>
    }

    // Handle expressions like "2δ", "-δ", etc.
    if (expr.includes("δ")) {
      const parts = expr.split("δ")
      return (
        <span>
          {parts[0] && <span>{parts[0]}</span>}
          <span className="font-serif text-lg">δ</span>
          {parts[1] && <span>{parts[1]}</span>}
        </span>
      )
    }

    // Handle superscripts (e.g., "A⁻¹")
    if (expr.includes("⁻¹")) {
      const parts = expr.split("⁻¹")
      return (
        <span>
          {parts[0]}
          <sup>-1</sup>
          {parts[1]}
        </span>
      )
    }

    // Handle fractions (e.g., "1/2")
    if (expr.includes("/")) {
      const parts = expr.split("/")
      if (parts.length === 2) {
        return (
          <span className="inline-flex flex-col items-center text-sm">
            <span className="border-b border-gray-800 px-1">{parts[0]}</span>
            <span className="px-1">{parts[1]}</span>
          </span>
        )
      }
    }

    // Default: return as is
    return <span>{expr}</span>
  }

  return <span className={`inline-block font-medium ${className}`}>{renderExpression(expression)}</span>
}
