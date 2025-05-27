"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Clock, Target, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useQuizStore } from "@/lib/store"
import { ModalCertificate } from "@/components/ModalCertificate"
import questionsData from "@/data/questions.json"

export default function ResultPage() {
  const [showCertificate, setShowCertificate] = useState(false)
  const [userInfo, setUserInfo] = useState({ name: "", studentId: "" })
  const [hasUserInfo, setHasUserInfo] = useState(false)

  const { answers, startTime, setUserInfo: saveUserInfo, userInfo: savedUserInfo } = useQuizStore()

  useEffect(() => {
    if (savedUserInfo.name && savedUserInfo.studentId) {
      setUserInfo(savedUserInfo)
      setHasUserInfo(true)
    }
  }, [savedUserInfo])

  const totalQuestions = questionsData.length
  const correctAnswers = questionsData.filter((q) => answers[q.id] === q.correct).length
  const score = Math.round((correctAnswers / totalQuestions) * 100)
  const timeElapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} phút ${secs} giây`
  }

  const handleSubmitUserInfo = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInfo.name && userInfo.studentId) {
      saveUserInfo(userInfo)
      setHasUserInfo(true)
    }
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

  if (!hasUserInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
        <div className="container mx-auto max-w-md">
          <Card className="mt-16">
            <CardHeader>
              <CardTitle className="text-center">Thông tin sinh viên</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitUserInfo} className="space-y-4">
                <div>
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="studentId">Mã số sinh viên</Label>
                  <Input
                    id="studentId"
                    value={userInfo.studentId}
                    onChange={(e) => setUserInfo((prev) => ({ ...prev, studentId: e.target.value }))}
                    placeholder="Nhập MSSV"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600">
                  Xác nhận
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kết quả bài làm</h1>
          <p className="text-gray-600">Chúc mừng bạn đã hoàn thành bài quiz!</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button onClick={() => setShowCertificate(true)} className="bg-yellow-500 hover:bg-yellow-600">
            <Trophy className="mr-2 h-4 w-4" />
            Xem chứng chỉ
          </Button>

          <Link href="/analytics">
            <Button variant="outline">
              <Target className="mr-2 h-4 w-4" />
              Xem thống kê chi tiết
            </Button>
          </Link>

          <Link href="/quiz/1">
            <Button variant="outline">Làm lại bài quiz</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Điểm số</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}/100</div>
              <p className="text-xs text-muted-foreground">
                {correctAnswers}/{totalQuestions} câu đúng
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Thời gian</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(timeElapsed)}</div>
              <p className="text-xs text-muted-foreground">Tổng thời gian làm bài</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đánh giá</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getScoreMessage(score)}</div>
              <p className="text-xs text-muted-foreground">Kết quả tổng thể</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Chi tiết kết quả</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {questionsData.map((question) => {
                const userAnswer = answers[question.id]
                const isCorrect = userAnswer === question.correct
                return (
                  <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Câu {question.id}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Đáp án: {question.correct}</span>
                      <span className="text-sm text-gray-600">Bạn chọn: {userAnswer || "Chưa trả lời"}</span>
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isCorrect ? "Đúng" : "Sai"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {showCertificate && (
          <ModalCertificate
            score={score}
            timeElapsed={timeElapsed}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </div>
    </div>
  )
}
