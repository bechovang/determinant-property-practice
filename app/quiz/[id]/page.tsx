"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Clock, Lightbulb, Home, CheckCircle } from "lucide-react"
import { Matrix } from "@/components/Matrix"
import { PropertyBadge } from "@/components/PropertyBadge"
import { InlineMath } from "@/components/InlineMath"
import { useQuizStore } from "@/lib/store"
import questionsData from "@/data/questions.json"
import propertiesData from "@/data/properties.json"
import Link from "next/link"

export default function QuizPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const questionId = Number.parseInt(params.id as string)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof questionsData>([])
  const [questionOrder, setQuestionOrder] = useState<number[]>([])

  const { answers, setAnswer, startTime, setStartTime, updateStats, storeQuestionTime } = useQuizStore()

  // Xáo trộn câu hỏi khi component mount
  useEffect(() => {
    const shouldShuffle = searchParams.get('shuffle') === 'true'
    if (shouldShuffle) {
      // Tạo mảng index từ 1 đến length của questionsData
      const indices = Array.from({ length: questionsData.length }, (_, i) => i + 1)
      // Xáo trộn mảng index
      const shuffledIndices = [...indices].sort(() => Math.random() - 0.5)
      setQuestionOrder(shuffledIndices)
      // Xáo trộn câu hỏi theo thứ tự index đã xáo
      const shuffled = shuffledIndices.map(index => questionsData[index - 1])
      setShuffledQuestions(shuffled)
    } else {
      // Nếu không xáo trộn, giữ nguyên thứ tự
      setQuestionOrder(Array.from({ length: questionsData.length }, (_, i) => i + 1))
      setShuffledQuestions(questionsData)
    }
  }, [searchParams])

  // Lấy câu hỏi hiện tại từ mảng đã xáo trộn
  const currentQuestion = shuffledQuestions[questionId - 1]
  const property = propertiesData.find((p) => p.id === currentQuestion?.propertyUsedId)
  const totalQuestions = questionsData.length
  
  // Tính số câu đã làm
  const answeredQuestions = Object.keys(answers).length
  // Tính tiến độ dựa trên số câu đã làm
  const progress = (answeredQuestions / totalQuestions) * 100

  useEffect(() => {
    if (!startTime) {
      setStartTime(Date.now())
    }
  }, [startTime, setStartTime])

  useEffect(() => {
    setQuestionStartTime(Date.now())
    setTimeElapsed(0)
  }, [questionId])

  useEffect(() => {
    const timer = setInterval(() => {
      if (questionStartTime) {
        setTimeElapsed(Math.floor((Date.now() - questionStartTime) / 1000))
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [questionStartTime])

  if (!currentQuestion) {
    return <div>Câu hỏi không tồn tại</div>
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
    setShowResult(true)
    setAnswer(currentQuestion.id, answer)

    // Update statistics
    const isCorrect = answer === currentQuestion.correct
    updateStats(currentQuestion.propertyUsedId, isCorrect)

    // Store time for this question
    const questionTime = timeElapsed
    storeQuestionTime(currentQuestion.id, questionTime)
  }

  const handleNext = () => {
    if (questionId < totalQuestions) {
      setSelectedAnswer("")
      setShowResult(false)
      // Lấy ID tiếp theo từ mảng đã xáo trộn
      const nextId = questionOrder[questionId]
      router.push(`/quiz/${nextId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)
    } else {
      // Chuyển thẳng đến trang analytics thay vì result
      router.push("/analytics")
    }
  }

  const handlePrevious = () => {
    if (questionId > 1) {
      setSelectedAnswer("")
      setShowResult(false)
      // Lấy ID trước đó từ mảng đã xáo trộn
      const prevId = questionOrder[questionId - 2]
      router.push(`/quiz/${prevId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getHint = () => {
    switch (property?.type) {
      case "swap":
        return "💡 Gợi ý: Khi hoán vị hai hàng, định thức sẽ đổi dấu"
      case "scale":
        return "💡 Gợi ý: Khi nhân một hàng với k, định thức cũng nhân với k"
      case "add":
        return "💡 Gợi ý: Cộng bội hàng không làm thay đổi định thức"
      case "identical":
        return "💡 Gợi ý: Ma trận có hai hàng giống nhau có định thức = 0"
      case "triangular":
        return "💡 Gợi ý: Định thức ma trận tam giác = tích các phần tử đường chéo"
      default:
        return "💡 Gợi ý: Quan sát sự thay đổi giữa ma trận A và B"
    }
  }

  const handleSubmit = () => {
    router.push("/analytics")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  Trang chủ
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Câu hỏi {questionId}/{totalQuestions}
              </h1>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {Math.round(progress)}% hoàn thành ({answeredQuestions}/{totalQuestions} câu)
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-lg text-gray-700 bg-white px-4 py-2 rounded-lg shadow">
                <Clock className="h-5 w-5" />
                {formatTime(timeElapsed)}
              </div>
              {property && <PropertyBadge property={property} />}
              <Button 
                variant="default" 
                size="sm" 
                className="bg-green-500 hover:bg-green-600 gap-2"
                onClick={handleSubmit}
              >
                <CheckCircle className="h-4 w-4" />
                Nộp bài
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-3 bg-gray-200" />
        </div>

        {/* Question Content */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100">
            <CardTitle className="text-xl text-center">
              Cho ma trận A có định thức δ. Tính định thức của ma trận B:
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">Ma trận A</h3>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <Matrix cells={currentQuestion.matrixA} showDeterminant={true} determinantValue="δ" />
                </div>
                <p className="text-lg text-blue-700 font-semibold">det(A) = δ</p>
              </div>

              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">Ma trận B</h3>
                <div className="bg-green-50 p-6 rounded-xl">
                  <Matrix cells={currentQuestion.matrixB} showDeterminant={true} determinantValue="?" />
                </div>
                <p className="text-lg text-green-700 font-semibold">det(B) = ?</p>
              </div>
            </div>

            {/* Transformation Arrow */}
            <div className="flex justify-center my-6">
              <div className="flex items-center gap-4 bg-yellow-100 px-6 py-3 rounded-full">
                <span className="text-lg font-semibold text-yellow-800">A</span>
                <ArrowRight className="h-6 w-6 text-yellow-600" />
                <span className="text-lg font-semibold text-yellow-800">B</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answer Options */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Chọn đáp án đúng:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`h-20 text-2xl font-bold transition-all duration-300 ${
                    showResult
                      ? option === currentQuestion.correct
                        ? "bg-green-500 hover:bg-green-600 text-white scale-105 shadow-lg"
                        : selectedAnswer === option
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : ""
                      : selectedAnswer === option
                        ? "bg-yellow-500 hover:bg-yellow-600 text-white scale-105"
                        : "hover:scale-105 hover:shadow-md"
                  }`}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  <InlineMath expression={option} />
                </Button>
              ))}
            </div>

            {/* Hint Button */}
            {!showResult && (
              <div className="text-center mb-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowHint(!showHint)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  {showHint ? "Ẩn gợi ý" : "Xem gợi ý"}
                </Button>
              </div>
            )}

            {/* Hint Display */}
            {showHint && !showResult && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-blue-800 text-center">{getHint()}</p>
              </div>
            )}

            {/* Result Explanation */}
            {showResult && (
              <div className={`p-6 rounded-lg ${selectedAnswer === currentQuestion.correct ? "bg-green-50" : "bg-red-50"}`}>
                <div className="text-center mb-4">
                  <Badge
                    variant={selectedAnswer === currentQuestion.correct ? "default" : "destructive"}
                    className="text-lg px-4 py-2"
                  >
                    {selectedAnswer === currentQuestion.correct ? "✅ Chính xác!" : "❌ Chưa đúng"}
                  </Badge>
                </div>
                <div className={selectedAnswer === currentQuestion.correct ? "text-green-800" : "text-red-800"}>
                  <h4 className="font-bold text-lg mb-2">Giải thích chi tiết:</h4>
                  <p className="text-base leading-relaxed">{currentQuestion.explanation}</p>
                  <div className="mt-4 p-3 bg-white bg-opacity-50 rounded">
                    <p className="font-semibold">
                      Đáp án đúng: <InlineMath expression={currentQuestion.correct} />
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={handlePrevious} disabled={questionId === 1} className="text-lg px-6 py-3">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Câu trước
          </Button>

          <div className="text-center">
            <p className="text-gray-600 mb-2">Tiến độ</p>
            <p className="text-2xl font-bold text-yellow-600">
              {answeredQuestions}/{totalQuestions}
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className={`text-lg px-6 py-3 ${!selectedAnswer ? "bg-gray-400" : "bg-yellow-500 hover:bg-yellow-600"}`}
          >
            {questionId === totalQuestions ? "Xem kết quả" : "Câu tiếp"}
            {questionId < totalQuestions && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
