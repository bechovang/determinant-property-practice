interface MatrixProps {
  cells: (string | number)[][]
  highlightCells?: { row: number; col: number }[]
  inline?: boolean
  className?: string
  showDeterminant?: boolean
  determinantValue?: string
}

export function Matrix({
  cells,
  highlightCells = [],
  inline = false,
  className = "",
  showDeterminant = false,
  determinantValue = "δ",
}: MatrixProps) {
  const matrixClass = inline ? "inline-block align-middle mx-2" : "mx-auto"
  const cellSize = inline ? "w-8 h-8 text-sm" : "w-12 h-12 text-lg"

  return (
    <div className={`${matrixClass} ${className}`}>
      <div className="relative inline-block">
        {/* Left bracket */}
        <div className="absolute left-0 top-0 bottom-0 w-2">
          <div className="w-full h-full border-l-4 border-t-4 border-b-4 border-gray-800 rounded-l-md" />
        </div>

        {/* Right bracket */}
        <div className="absolute right-0 top-0 bottom-0 w-2">
          <div className="w-full h-full border-r-4 border-t-4 border-b-4 border-gray-800 rounded-r-md" />
        </div>

        {/* Matrix content */}
        <div className="px-4 py-3">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cells[0]?.length || 1}, 1fr)` }}>
            {cells.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isHighlighted = highlightCells.some((h) => h.row === rowIndex && h.col === colIndex)
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      ${cellSize} flex items-center justify-center font-mono font-semibold
                      transition-all duration-300 rounded
                      ${isHighlighted ? "bg-yellow-300 text-yellow-900 scale-110 shadow-md" : ""}
                      ${inline ? "text-base" : "text-xl"}
                    `}
                  >
                    {typeof cell === "number" ? (cell % 1 === 0 ? cell : cell.toFixed(2)) : cell}
                  </div>
                )
              }),
            )}
          </div>
        </div>

        {/* Determinant notation */}
        {showDeterminant && (
          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
            <span className="text-lg font-semibold">det</span>
          </div>
        )}
      </div>

      {/* Determinant value */}
      {showDeterminant && (
        <div className="text-center mt-2">
          <span className="text-lg font-semibold"> = {determinantValue}</span>
        </div>
      )}
    </div>
  )
}
