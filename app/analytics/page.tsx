"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingDown, TrendingUp, Target, Clock, Award, Trophy } from "lucide-react"
import Link from "next/link"
import { useQuizStore } from "@/lib/store"
import { ModalCertificate } from "@/components/ModalCertificate"
import propertiesData from "@/data/properties.json"
import questionsData from "@/data/questions.json"

export default function AnalyticsPage() {
  const [showCertificate, setShowCertificate] = useState(false)
  const { stats, questionTimes, answers, startTime } = useQuizStore()

  const propertyStats = propertiesData
    .map((property) => {
      const stat = stats[property.id] || { attempts: 0, correct: 0 }
      const accuracy = stat.attempts > 0 ? Math.round((stat.correct / stat.attempts) * 100) : 0

      // Calculate average time for questions using this property
      const relatedQuestions = questionsData.filter((q) => q.propertyUsedId === property.id)
      const questionTimesForProperty = relatedQuestions
        .map((q) => questionTimes[q.id])
        .filter((time) => time !== undefined)

      const avgTime =
        questionTimesForProperty.length > 0
          ? Math.round(questionTimesForProperty.reduce((sum, time) => sum + time, 0) / questionTimesForProperty.length)
          : 0

      return {
        ...property,
        attempts: stat.attempts,
        correct: stat.correct,
        accuracy,
        avgTime,
        questionCount: relatedQuestions.length,
      }
    })
    .filter((p) => p.attempts > 0)

  const sortedByAccuracy = [...propertyStats].sort((a, b) => a.accuracy - b.accuracy)
  const weakestProperties = sortedByAccuracy.slice(0, 3)
  const strongestProperties = sortedByAccuracy.slice(-3).reverse()

  const totalAttempts = propertyStats.reduce((sum, p) => sum + p.attempts, 0)
  const totalCorrect = propertyStats.reduce((sum, p) => sum + p.correct, 0)
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

  // Calculate quiz completion stats
  const totalQuestions = questionsData.length
  const answeredQuestions = Object.keys(answers).length
  const correctAnswers = questionsData.filter((q) => answers[q.id] === q.correct).length
  const quizScore = answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0
  const timeElapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0

  // Calculate timing statistics
  const allQuestionTimes = Object.values(questionTimes)
  const avgTimePerQuestion =
    allQuestionTimes.length > 0
      ? Math.round(allQuestionTimes.reduce((sum, time) => sum + time, 0) / allQuestionTimes.length)
      : 0

  const fastestTime = allQuestionTimes.length > 0 ? Math.min(...allQuestionTimes) : 0
  const slowestTime = allQuestionTimes.length > 0 ? Math.max(...allQuestionTimes) : 0

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Xuất sắc! 🎉"
    if (score >= 80) return "Tốt lắm! 👏"
    if (score >= 70) return "Khá tốt! 👍"
    if (score >= 60) return "Đạt yêu cầu 📚"
    return "Cần cố gắng thêm 💪"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Thống kê học tập</h1>
          <p className="text-gray-600">Phân tích chi tiết kết quả học tập của bạn</p>
        </div>

        {/* Quiz Results Summary */}
        {answeredQuestions > 0 && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-yellow-800">
                  <Trophy className="h-8 w-8" />
                  Kết quả Quiz gần nhất
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(quizScore)}`}>{quizScore}%</div>
                    <p className="text-sm text-gray-600">Điểm số</p>
                    <p className="text-xs text-gray-500">
                      {correctAnswers}/{answeredQuestions} câu đúng
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{formatTime(timeElapsed)}</div>
                    <p className="text-sm text-gray-600">Thời gian</p>
                    <p className="text-xs text-gray-500">Tổng thời gian</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{answeredQuestions}</div>
                    <p className="text-sm text-gray-600">Câu đã làm</p>
                    <p className="text-xs text-gray-500">Trên {totalQuestions} câu</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{getScoreMessage(quizScore)}</div>
                    <p className="text-sm text-gray-600">Đánh giá</p>
                  </div>
                </div>

                {/* Certificate Button */}
                <div className="mt-6 text-center">
                  <Button
                    onClick={() => setShowCertificate(true)}
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3"
                  >
                    <Award className="mr-2 h-5 w-5" />
                    Nhận chứng chỉ hoàn thành
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Overall Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Độ chính xác tổng thể</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallAccuracy}%</div>
              <p className="text-xs text-muted-foreground">
                {totalCorrect}/{totalAttempts} câu đúng
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tính chất đã học</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{propertyStats.length}</div>
              <p className="text-xs text-muted-foreground">Trên tổng số 15 tính chất</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cần cải thiện</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weakestProperties.length}</div>
              <p className="text-xs text-muted-foreground">Tính chất có độ chính xác thấp</p>
            </CardContent>
          </Card>
        </div>

        {/* Timing Analysis */}
        {allQuestionTimes.length > 0 && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Thời gian trung bình/câu</CardTitle>
                <Clock className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatTime(avgTimePerQuestion)}</div>
                <p className="text-xs text-muted-foreground">Trên {allQuestionTimes.length} câu đã làm</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Câu nhanh nhất</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{formatTime(fastestTime)}</div>
                <p className="text-xs text-muted-foreground">Thời gian tốt nhất</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Câu chậm nhất</CardTitle>
                <TrendingDown className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{formatTime(slowestTime)}</div>
                <p className="text-xs text-muted-foreground">Cần cải thiện</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng thời gian</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatTime(allQuestionTimes.reduce((sum, time) => sum + time, 0))}
                </div>
                <p className="text-xs text-muted-foreground">Tổng cộng</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Stats */}
        {propertyStats.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Weakest Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingDown className="mr-2 h-5 w-5 text-red-500" />
                  Cần cải thiện nhất
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weakestProperties.length > 0 ? (
                  <div className="space-y-4">
                    {weakestProperties.map((property) => (
                      <div key={property.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{property.name}</span>
                          <span className="text-sm text-red-600">{property.accuracy}%</span>
                        </div>
                        <Progress value={property.accuracy} className="h-2" />
                        <p className="text-xs text-gray-600">
                          {property.correct}/{property.attempts} câu đúng
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Chưa có dữ liệu thống kê</p>
                )}
              </CardContent>
            </Card>

            {/* Strongest Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
                  Điểm mạnh
                </CardTitle>
              </CardHeader>
              <CardContent>
                {strongestProperties.length > 0 ? (
                  <div className="space-y-4">
                    {strongestProperties.map((property) => (
                      <div key={property.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{property.name}</span>
                          <span className="text-sm text-green-600">{property.accuracy}%</span>
                        </div>
                        <Progress value={property.accuracy} className="h-2" />
                        <p className="text-xs text-gray-600">
                          {property.correct}/{property.attempts} câu đúng
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Chưa có dữ liệu thống kê</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* All Properties Stats */}
        {propertyStats.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết theo từng tính chất</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {propertyStats.map((property) => (
                  <div key={property.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">
                          {property.id}. {property.name}
                        </h4>
                        <p className="text-sm text-gray-600">{property.description}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <div
                          className={`text-lg font-bold ${
                            property.accuracy >= 80
                              ? "text-green-600"
                              : property.accuracy >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {property.accuracy}%
                        </div>
                        <div className="text-sm text-gray-600">
                          {property.correct}/{property.attempts}
                        </div>
                        {property.avgTime > 0 && (
                          <div className="text-xs text-purple-600">⏱️ {formatTime(property.avgTime)}</div>
                        )}
                      </div>
                    </div>
                    <Progress value={property.accuracy} className="h-2" />
                    {property.avgTime > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        Thời gian trung bình: {formatTime(property.avgTime)} ({property.questionCount} câu)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500 mb-4">Chưa có dữ liệu thống kê</p>
              <p className="text-gray-400 mb-6">Hãy bắt đầu làm quiz để xem thống kê chi tiết</p>
              <Link href="/quiz/1">
                <Button className="bg-yellow-500 hover:bg-yellow-600">Bắt đầu làm bài quiz</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Individual Question Analysis */}
        {Object.keys(questionTimes).length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Phân tích từng câu hỏi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {questionsData
                  .filter((q) => questionTimes[q.id] !== undefined)
                  .sort((a, b) => questionTimes[b.id] - questionTimes[a.id])
                  .map((question) => {
                    const property = propertiesData.find((p) => p.id === question.propertyUsedId)
                    const time = questionTimes[question.id]
                    const isSlowQuestion = time > avgTimePerQuestion * 1.5

                    return (
                      <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="font-medium">Câu {question.id}</span>
                          <span className="text-sm text-gray-600">{property?.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-sm font-medium ${isSlowQuestion ? "text-orange-600" : "text-green-600"}`}
                          >
                            {formatTime(time)}
                          </span>
                          {isSlowQuestion && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Chậm</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certificate Modal */}
        {showCertificate && (
          <ModalCertificate score={quizScore} timeElapsed={timeElapsed} onClose={() => setShowCertificate(false)} />
        )}
      </div>
    </div>
  )
}
