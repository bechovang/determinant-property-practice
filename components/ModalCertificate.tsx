"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Download, Copy } from "lucide-react"
import { toPng } from "html-to-image"
import { useToast } from "@/hooks/use-toast"
import { useQuizStore } from "@/lib/store"
import propertiesData from "@/data/properties.json"
import questionsData from "@/data/questions.json"

interface ModalCertificateProps {
  score: number
  timeElapsed: number
  onClose: () => void
}

export function ModalCertificate({ score, timeElapsed, onClose }: ModalCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { userInfo, setUserInfo, stats } = useQuizStore()

  const [localUserInfo, setLocalUserInfo] = useState({
    name: userInfo.name || "Nguyễn Văn A",
    studentId: userInfo.studentId || "20240001",
  })
  const [hasUserInfo, setHasUserInfo] = useState<boolean>(true)
  const [isEditing, setIsEditing] = useState(false)

  // Tính toán các tính chất đã thành thạo (độ chính xác >= 80%)
  const masteredProperties = propertiesData
    .map((property) => {
      const stat = stats[property.id] || { attempts: 0, correct: 0 }
      const accuracy = stat.attempts > 0 ? Math.round((stat.correct / stat.attempts) * 100) : 0
      return { ...property, accuracy }
    })
    .filter((p) => p.accuracy >= 80)

  // Tính phần trăm hoàn thành
  const totalQuestions = questionsData.length
  const answeredQuestions = Object.keys(stats).reduce((sum, propertyId: string) => {
    const propertyStats = stats[Number(propertyId)]
    return sum + (propertyStats?.attempts || 0)
  }, 0)
  const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} phút ${secs} giây`
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSubmitUserInfo = (e: React.FormEvent) => {
    e.preventDefault()
    if (localUserInfo.name && localUserInfo.studentId) {
      setUserInfo(localUserInfo)
      setHasUserInfo(true)
    }
  }

  const copyAsPng = async () => {
    if (!certificateRef.current) return

    try {
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      })

      const response = await fetch(dataUrl)
      const blob = await response.blob()

      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])

      toast({
        title: "Thành công!",
        description: "Chứng chỉ đã được copy dưới dạng PNG vào clipboard",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể copy chứng chỉ. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

  const downloadAsPng = async () => {
    if (!certificateRef.current) return

    try {
      const dataUrl = await toPng(certificateRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      })

      const link = document.createElement("a")
      link.download = `chung-chi-${localUserInfo.studentId || "quiz"}.png`
      link.href = dataUrl
      link.click()

      toast({
        title: "Thành công!",
        description: "Chứng chỉ đã được tải xuống",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải xuống chứng chỉ. Vui lòng thử lại.",
        variant: "destructive",
      })
    }
  }

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
          className="w-full max-w-3xl"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Chứng chỉ hoàn thành</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Lưu" : "Sửa thông tin"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isEditing ? (
                /* User Info Form */
                <div className="max-w-md mx-auto">
                  <form onSubmit={handleSubmitUserInfo} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Họ và tên</Label>
                      <Input
                        id="name"
                        value={localUserInfo.name}
                        onChange={(e) => setLocalUserInfo((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="studentId">Mã số sinh viên</Label>
                      <Input
                        id="studentId"
                        value={localUserInfo.studentId}
                        onChange={(e) => setLocalUserInfo((prev) => ({ ...prev, studentId: e.target.value }))}
                        placeholder="Nhập MSSV"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600">
                      Cập nhật thông tin
                    </Button>
                  </form>
                </div>
              ) : (
                /* Certificate Display */
                <>
                  <div
                    ref={certificateRef}
                    className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-lg border-4 border-yellow-400 relative overflow-hidden"
                  >
                    {/* Decorative elements */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-4 border-yellow-300 rounded-full opacity-20" />
                    <div className="absolute top-6 right-6 w-8 h-8 border-4 border-yellow-300 rounded-full opacity-20" />
                    <div className="absolute bottom-4 left-6 w-16 h-16 border-4 border-yellow-300 rounded-full opacity-20" />
                    <div className="absolute bottom-6 right-4 w-10 h-10 border-4 border-yellow-300 rounded-full opacity-20" />

                    <div className="text-center relative z-10">
                      {/* Header */}
                      <div className="mb-6">
                        <h1 className="text-3xl font-bold text-yellow-800 mb-2">CHỨNG CHỈ HOÀN THÀNH</h1>
                        <div className="w-24 h-1 bg-yellow-500 mx-auto rounded" />
                      </div>

                      {/* Content */}
                      <div className="space-y-4 text-gray-800">
                        <p className="text-base">Chứng nhận rằng</p>

                        <div className="py-3">
                          <h2 className="text-2xl font-bold text-yellow-800 mb-1">{localUserInfo.name}</h2>
                          <p className="text-base text-gray-600">MSSV: {localUserInfo.studentId}</p>
                        </div>

                        <p className="text-base leading-relaxed max-w-2xl mx-auto">
                          đã hoàn thành bài quiz
                          <br />
                          <strong className="text-yellow-800">"15 Tính Chất Định Thức Ma Trận"</strong>
                        </p>

                        {/* Results */}
                        <div className="grid md:grid-cols-3 gap-6 my-6">
                          <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                            <h3 className="text-base font-semibold text-yellow-800">Điểm số</h3>
                            <p className="text-2xl font-bold text-gray-800">{score}/100</p>
                          </div>
                          <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                            <h3 className="text-base font-semibold text-yellow-800">Thời gian</h3>
                            <p className="text-2xl font-bold text-gray-800">{formatTime(timeElapsed)}</p>
                          </div>
                          <div className="bg-white bg-opacity-50 p-3 rounded-lg">
                            <h3 className="text-base font-semibold text-yellow-800">Hoàn thành</h3>
                            <p className="text-2xl font-bold text-gray-800">{completionPercentage}%</p>
                          </div>
                        </div>

                        {/* Mastered Properties */}
                        {masteredProperties.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-base font-semibold text-yellow-800 mb-3">Các tính chất đã thành thạo</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {masteredProperties.map((property) => (
                                <div
                                  key={property.id}
                                  className="bg-white bg-opacity-50 p-2 rounded-lg text-xs"
                                >
                                  <span className="font-medium">Tính chất {property.id}:</span>{" "}
                                  <span className="text-gray-600">{property.name}</span>
                                  <div className="text-xs text-green-600 mt-1">
                                    Độ chính xác: {property.accuracy}%
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="pt-6 border-t border-yellow-300">
                          <p className="text-xs text-gray-600">Ngày cấp: {getCurrentDate()}</p>
                          <div className="mt-3">
                            <div className="w-36 h-0.5 bg-yellow-500 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-yellow-800">Hệ thống Quiz Toán học</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4 mt-4">
                    <Button onClick={copyAsPng} className="bg-yellow-500 hover:bg-yellow-600">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy PNG
                    </Button>

                    <Button onClick={downloadAsPng} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Tải xuống
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
