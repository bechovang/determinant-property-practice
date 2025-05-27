"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Play, RotateCcw } from "lucide-react"
import { Matrix } from "./Matrix"

interface Property {
  id: number
  name: string
  description: string
  example: {
    before: number[][]
    after: number[][]
  }
  type: string
  factor?: number
  sourceRow?: number
  targetRow?: number
}

interface PropertyAnimationProps {
  property: Property
  onClose: () => void
}

interface AnimationStep {
  title: string
  description: string
  matrix: number[][]
  highlightCells: { row: number; col: number }[]
  determinantValue: string
  explanation: string
}

export function PropertyAnimation({ property, onClose }: PropertyAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([])

  useEffect(() => {
    setAnimationSteps(generateAnimationSteps(property))
  }, [property])

  const generateAnimationSteps = (prop: Property): AnimationStep[] => {
    const steps: AnimationStep[] = []

    switch (prop.type) {
      case "swap":
        steps.push(
          {
            title: "Bước 1: Ma trận ban đầu",
            description: "Quan sát ma trận A với định thức δ",
            matrix: prop.example.before,
            highlightCells: [],
            determinantValue: "δ",
            explanation: "Ma trận ban đầu có định thức δ. Chúng ta sẽ hoán vị hai hàng.",
          },
          {
            title: "Bước 2: Chọn hai hàng để hoán vị",
            description: "Đánh dấu hàng 1 và hàng 2 sẽ được hoán vị",
            matrix: prop.example.before,
            highlightCells: [
              { row: 0, col: 0 },
              { row: 0, col: 1 },
              { row: 1, col: 0 },
              { row: 1, col: 1 },
            ],
            determinantValue: "δ",
            explanation: "Hai hàng được đánh dấu sẽ đổi chỗ cho nhau.",
          },
          {
            title: "Bước 3: Thực hiện hoán vị",
            description: "Hàng 1 ↔ Hàng 2",
            matrix: prop.example.after,
            highlightCells: [
              { row: 0, col: 0 },
              { row: 0, col: 1 },
              { row: 1, col: 0 },
              { row: 1, col: 1 },
            ],
            determinantValue: "-δ",
            explanation: "Sau khi hoán vị hai hàng, định thức đổi dấu từ δ thành -δ.",
          },
          {
            title: "Kết luận",
            description: "Tính chất hoán vị hàng",
            matrix: prop.example.after,
            highlightCells: [],
            determinantValue: "-δ",
            explanation: "Khi hoán vị hai hàng bất kỳ của ma trận, định thức sẽ đổi dấu.",
          },
        )
        break

      case "scale":
        const targetRow = prop.targetRow || 0
        const factor = prop.factor || 2
        steps.push(
          {
            title: "Bước 1: Ma trận ban đầu",
            description: "Ma trận A có định thức δ",
            matrix: prop.example.before,
            highlightCells: [],
            determinantValue: "δ",
            explanation: "Ma trận ban đầu có định thức δ.",
          },
          {
            title: "Bước 2: Chọn hàng cần nhân",
            description: `Đánh dấu hàng ${targetRow + 1} sẽ được nhân với ${factor}`,
            matrix: prop.example.before,
            highlightCells: prop.example.before[targetRow].map((_, col) => ({ row: targetRow, col })),
            determinantValue: "δ",
            explanation: `Hàng ${targetRow + 1} sẽ được nhân với hằng số ${factor}.`,
          },
          {
            title: "Bước 3: Thực hiện phép nhân",
            description: `Nhân từng phần tử của hàng ${targetRow + 1} với ${factor}`,
            matrix: prop.example.after,
            highlightCells: prop.example.after[targetRow].map((_, col) => ({ row: targetRow, col })),
            determinantValue: `${factor}δ`,
            explanation: `Mỗi phần tử trong hàng ${targetRow + 1} được nhân với ${factor}.`,
          },
          {
            title: "Kết luận",
            description: "Tính chất nhân hàng với hằng số",
            matrix: prop.example.after,
            highlightCells: [],
            determinantValue: `${factor}δ`,
            explanation: `Khi nhân một hàng với hằng số k, định thức cũng được nhân với k.`,
          },
        )
        break

      case "add":
        const sourceRow = prop.sourceRow || 0
        const targetRowAdd = prop.targetRow || 1
        const factorAdd = prop.factor || 2
        steps.push(
          {
            title: "Bước 1: Ma trận ban đầu",
            description: "Ma trận A có định thức δ",
            matrix: prop.example.before,
            highlightCells: [],
            determinantValue: "δ",
            explanation: "Ma trận ban đầu có định thức δ.",
          },
          {
            title: "Bước 2: Chọn hàng nguồn",
            description: `Đánh dấu hàng ${sourceRow + 1} (hàng nguồn)`,
            matrix: prop.example.before,
            highlightCells: prop.example.before[sourceRow].map((_, col) => ({ row: sourceRow, col })),
            determinantValue: "δ",
            explanation: `Hàng ${sourceRow + 1} sẽ được nhân với ${factorAdd} rồi cộng vào hàng khác.`,
          },
          {
            title: "Bước 3: Chọn hàng đích",
            description: `Đánh dấu hàng ${targetRowAdd + 1} (hàng đích)`,
            matrix: prop.example.before,
            highlightCells: prop.example.before[targetRowAdd].map((_, col) => ({ row: targetRowAdd, col })),
            determinantValue: "δ",
            explanation: `Hàng ${targetRowAdd + 1} sẽ nhận thêm ${factorAdd} lần hàng ${sourceRow + 1}.`,
          },
          {
            title: "Bước 4: Thực hiện phép cộng",
            description: `H${targetRowAdd + 1} = H${targetRowAdd + 1} + ${factorAdd}×H${sourceRow + 1}`,
            matrix: prop.example.after,
            highlightCells: prop.example.after[targetRowAdd].map((_, col) => ({ row: targetRowAdd, col })),
            determinantValue: "δ",
            explanation: `Mỗi phần tử của hàng ${targetRowAdd + 1} được cộng với ${factorAdd} lần phần tử tương ứng của hàng ${sourceRow + 1}.`,
          },
          {
            title: "Kết luận",
            description: "Tính chất cộng bội hàng",
            matrix: prop.example.after,
            highlightCells: [],
            determinantValue: "δ",
            explanation: "Cộng bội của một hàng vào hàng khác không làm thay đổi định thức.",
          },
        )
        break

      case "identical":
        steps.push(
          {
            title: "Bước 1: Ma trận có hai hàng giống nhau",
            description: "Quan sát ma trận có hàng 1 và hàng 2 giống hệt nhau",
            matrix: prop.example.before,
            highlightCells: [
              { row: 0, col: 0 },
              { row: 0, col: 1 },
              { row: 1, col: 0 },
              { row: 1, col: 1 },
            ],
            determinantValue: "0",
            explanation: "Khi ma trận có hai hàng giống hệt nhau, định thức luôn bằng 0.",
          },
          {
            title: "Kết luận",
            description: "Tính chất ma trận có hàng giống nhau",
            matrix: prop.example.after,
            highlightCells: [],
            determinantValue: "0",
            explanation: "Ma trận có hai hàng (hoặc hai cột) giống nhau có định thức bằng 0.",
          },
        )
        break

      case "triangular":
        steps.push(
          {
            title: "Bước 1: Ma trận tam giác trên",
            description: "Quan sát ma trận tam giác trên",
            matrix: prop.example.before,
            highlightCells: [],
            determinantValue: "?",
            explanation: "Ma trận tam giác trên có tất cả phần tử dưới đường chéo chính bằng 0.",
          },
          {
            title: "Bước 2: Đánh dấu đường chéo chính",
            description: "Các phần tử trên đường chéo chính",
            matrix: prop.example.before,
            highlightCells: prop.example.before.map((_, i) => ({ row: i, col: i })),
            determinantValue: "a₁₁ × a₂₂ × ...",
            explanation: "Định thức ma trận tam giác bằng tích các phần tử trên đường chéo chính.",
          },
          {
            title: "Bước 3: Tính toán",
            description: `Tính tích: ${prop.example.before[0][0]} × ${prop.example.before[1][1]} = ${prop.factor}`,
            matrix: prop.example.after,
            highlightCells: prop.example.before.map((_, i) => ({ row: i, col: i })),
            determinantValue: `${prop.factor}`,
            explanation: `Định thức = ${prop.example.before[0][0]} × ${prop.example.before[1][1]} = ${prop.factor}`,
          },
        )
        break

      default:
        steps.push(
          {
            title: "Ma trận ban đầu",
            description: prop.description,
            matrix: prop.example.before,
            highlightCells: [],
            determinantValue: "δ",
            explanation: prop.description,
          },
          {
            title: "Ma trận sau biến đổi",
            description: "Kết quả sau khi áp dụng tính chất",
            matrix: prop.example.after,
            highlightCells: [],
            determinantValue: `${prop.factor}δ`,
            explanation: `Định thức thay đổi theo hệ số ${prop.factor}.`,
          },
        )

      case "inverse":
        steps.push(
          {
            title: "Bước 1: Ma trận A và A⁻¹",
            description: "Cho ma trận A và ma trận nghịch đảo A⁻¹",
            matrix: prop.example.before,
            highlightCells: [],
            determinantValue: "δ",
            explanation: "Ma trận A có định thức δ. Ta cần tìm det(A⁻¹).",
          },
          {
            title: "Bước 2: Sử dụng tính chất AA⁻¹ = I",
            description: "Áp dụng det(AA⁻¹) = det(I) = 1",
            matrix: prop.example.before,
            highlightCells: [],
            determinantValue: "δ",
            explanation: "Từ AA⁻¹ = I, lấy định thức hai vế: det(A) × det(A⁻¹) = det(I) = 1",
          },
          {
            title: "Bước 3: Suy ra công thức",
            description: "det(A⁻¹) = 1/det(A)",
            matrix: prop.example.after,
            highlightCells: [],
            determinantValue: "1/δ",
            explanation: "Do đó det(A⁻¹) = 1/det(A) = 1/δ",
          },
        )
        break

      case "vandermonde":
        steps.push(
          {
            title: "Bước 1: Nhận dạng ma trận Vandermonde",
            description: "Ma trận có dạng Vᵢⱼ = xᵢʲ⁻¹",
            matrix: prop.example.before,
            highlightCells: [],
            determinantValue: "?",
            explanation: "Ma trận Vandermonde với x₁=1, x₂=2, x₃=3. Hàng i có dạng [1, xᵢ, xᵢ², ...]",
          },
          {
            title: "Bước 2: Áp dụng công thức",
            description: "det(V) = ∏ᵢ<ⱼ (xⱼ - xᵢ)",
            matrix: prop.example.before,
            highlightCells: [
              { row: 0, col: 0 },
              { row: 1, col: 1 },
              { row: 2, col: 2 },
            ],
            determinantValue: "(x₂-x₁)(x₃-x₁)(x₃-x₂)",
            explanation: "Công thức Vandermonde: tích tất cả hiệu (xⱼ - xᵢ) với i < j",
          },
          {
            title: "Bước 3: Tính toán cụ thể",
            description: "Thay x₁=1, x₂=2, x₃=3",
            matrix: prop.example.after,
            highlightCells: [],
            determinantValue: "2",
            explanation: "det = (2-1)(3-1)(3-2) = 1×2×1 = 2",
          },
        )
        break

      case "block":
        steps.push(
          {
            title: "Bước 1: Nhận dạng ma trận khối",
            description: "Ma trận có dạng khối tam giác",
            matrix: prop.example.before,
            highlightCells: [],
            determinantValue: "?",
            explanation: "Ma trận được chia thành các khối: A₁₁ (2×2), A₁₂ (2×2), 0 (2×2), A₂₂ (2×2)",
          },
          {
            title: "Bước 2: Xác định các khối",
            description: "Khối A₁₁ và A₂₂ trên đường chéo",
            matrix: prop.example.before,
            highlightCells: [
              { row: 0, col: 0 },
              { row: 0, col: 1 },
              { row: 1, col: 0 },
              { row: 1, col: 1 },
            ],
            determinantValue: "det(A₁₁) × det(A₂₂)",
            explanation: "A₁₁ = [[1,2],[3,4]], A₂₂ = [[5,6],[7,8]]",
          },
          {
            title: "Bước 3: Tính định thức các khối",
            description: "det(A₁₁) = -2, det(A₂₂) = -2",
            matrix: prop.example.after,
            highlightCells: [
              { row: 2, col: 2 },
              { row: 2, col: 3 },
              { row: 3, col: 2 },
              { row: 3, col: 3 },
            ],
            determinantValue: "(-2) × 6 = -12",
            explanation: "det(A₁₁) = 1×4 - 2×3 = -2, det(A₂₂) = 5×8 - 6×7 = -2",
          },
        )
        break
    }

    return steps
  }

  const playAnimation = () => {
    setIsPlaying(true)
    setCurrentStep(0)

    const playStep = (stepIndex: number) => {
      if (stepIndex < animationSteps.length) {
        setTimeout(() => {
          setCurrentStep(stepIndex)
          playStep(stepIndex + 1)
        }, 2000)
      } else {
        setIsPlaying(false)
      }
    }

    playStep(0)
  }

  const resetAnimation = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  const nextStep = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = animationSteps[currentStep]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{property.name}</CardTitle>
                  <p className="text-gray-600 mt-1">{property.description}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex items-center justify-center space-x-2">
                {animationSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentStep ? "bg-yellow-500" : index < currentStep ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Current Step */}
              {currentStepData && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Step Header */}
                  <div className="text-center">
                    <Badge variant="outline" className="mb-2">
                      {currentStep + 1}/{animationSteps.length}
                    </Badge>
                    <h3 className="text-xl font-bold text-yellow-800">{currentStepData.title}</h3>
                    <p className="text-gray-600">{currentStepData.description}</p>
                  </div>

                  {/* Matrix Display */}
                  <div className="flex justify-center">
                    <div className="text-center">
                      <Matrix
                        cells={currentStepData.matrix}
                        highlightCells={currentStepData.highlightCells}
                        showDeterminant={true}
                        determinantValue={currentStepData.determinantValue}
                      />
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Giải thích:</h4>
                    <p className="text-blue-800">{currentStepData.explanation}</p>
                  </div>

                  {/* Formula Display */}
                  {property.type === "add" && currentStep === 3 && (
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <h4 className="font-semibold text-yellow-900 mb-2">Công thức:</h4>
                      <div className="text-lg font-mono">
                        H{(property.targetRow || 1) + 1} = H{(property.targetRow || 1) + 1} + {property.factor}×H
                        {(property.sourceRow || 0) + 1}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Navigation Controls */}
              <div className="flex justify-center space-x-4">
                <Button onClick={prevStep} disabled={currentStep === 0 || isPlaying} variant="outline">
                  ← Bước trước
                </Button>

                <Button onClick={playAnimation} disabled={isPlaying} className="bg-yellow-500 hover:bg-yellow-600">
                  <Play className="mr-2 h-4 w-4" />
                  {isPlaying ? "Đang chạy..." : "Tự động chạy"}
                </Button>

                <Button onClick={resetAnimation} disabled={isPlaying} variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Đặt lại
                </Button>

                <Button
                  onClick={nextStep}
                  disabled={currentStep === animationSteps.length - 1 || isPlaying}
                  variant="outline"
                >
                  Bước tiếp →
                </Button>
              </div>

              {/* Mathematical Insight */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">💡 Hiểu sâu hơn:</h4>
                <div className="text-green-800 space-y-2">
                  {property.type === "swap" && (
                    <p>Hoán vị hai hàng tương đương với nhân ma trận với ma trận hoán vị, có định thức = -1.</p>
                  )}
                  {property.type === "scale" && (
                    <p>Nhân hàng với k tương đương với nhân ma trận với ma trận có một phần tử đường chéo = k.</p>
                  )}
                  {property.type === "add" && (
                    <p>Phép cộng bội hàng không thay đổi định thức vì đây là phép biến đổi sơ cấp thuận nghịch.</p>
                  )}
                  {property.type === "triangular" && (
                    <p>Ma trận tam giác có định thức dễ tính vì khai triển theo hàng/cột chỉ có một số hạng khác 0.</p>
                  )}
                  {property.type === "inverse" && (
                    <p>Ma trận nghịch đảo có định thức là nghịch đảo của định thức ma trận ban đầu.</p>
                  )}
                  {property.type === "vandermonde" && (
                    <p>
                      Ma trận Vandermonde xuất hiện trong nhiều bài toán nội suy và có công thức định thức đặc biệt.
                    </p>
                  )}
                  {property.type === "block" && (
                    <p>Ma trận khối giúp đơn giản hóa việc tính toán định thức cho các ma trận lớn.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
