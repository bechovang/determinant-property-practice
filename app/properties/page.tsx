"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Matrix } from "@/components/Matrix"
import { PropertyAnimation } from "@/components/PropertyAnimation"
import { Play, ArrowLeft, BookOpen, Calculator } from "lucide-react"
import Link from "next/link"
import propertiesData from "@/data/properties.json"

export default function PropertiesPage() {
  const [animatingProperty, setAnimatingProperty] = useState<number | null>(null)

  const getPropertyTypeInfo = (type: string) => {
    switch (type) {
      case "swap":
        return { color: "bg-blue-100 text-blue-800", icon: "🔄", difficulty: "Dễ" }
      case "scale":
        return { color: "bg-green-100 text-green-800", icon: "✖️", difficulty: "Dễ" }
      case "add":
        return { color: "bg-purple-100 text-purple-800", icon: "➕", difficulty: "Trung bình" }
      case "identical":
        return { color: "bg-red-100 text-red-800", icon: "👥", difficulty: "Dễ" }
      case "triangular":
        return { color: "bg-orange-100 text-orange-800", icon: "📐", difficulty: "Trung bình" }
      case "transpose":
        return { color: "bg-cyan-100 text-cyan-800", icon: "🔀", difficulty: "Dễ" }
      case "product":
        return { color: "bg-pink-100 text-pink-800", icon: "✖️", difficulty: "Khó" }
      case "zero_row":
        return { color: "bg-gray-100 text-gray-800", icon: "0️⃣", difficulty: "Dễ" }
      case "linear":
        return { color: "bg-indigo-100 text-indigo-800", icon: "📏", difficulty: "Trung bình" }
      case "identity":
        return { color: "bg-emerald-100 text-emerald-800", icon: "🆔", difficulty: "Dễ" }
      case "inverse":
        return { color: "bg-violet-100 text-violet-800", icon: "🔄", difficulty: "Khó" }
      case "expansion":
        return { color: "bg-amber-100 text-amber-800", icon: "📊", difficulty: "Khó" }
      case "expansion_col":
        return { color: "bg-lime-100 text-lime-800", icon: "📊", difficulty: "Khó" }
      case "block":
        return { color: "bg-rose-100 text-rose-800", icon: "🧱", difficulty: "Khó" }
      case "vandermonde":
        return { color: "bg-teal-100 text-teal-800", icon: "🔢", difficulty: "Rất khó" }
      default:
        return { color: "bg-gray-100 text-gray-800", icon: "❓", difficulty: "Không xác định" }
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Dễ":
        return "bg-green-100 text-green-800"
      case "Trung bình":
        return "bg-yellow-100 text-yellow-800"
      case "Khó":
        return "bg-orange-100 text-orange-800"
      case "Rất khó":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getFactorDescription = (factor: number | undefined) => {
    if (factor === undefined) return "Không thay đổi"
    if (factor === 1) return "Không thay đổi (×1)"
    if (factor === -1) return "Đổi dấu (×-1)"
    if (factor === 0) return "Bằng 0"
    return `Nhân với ${factor}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Về trang chủ
            </Button>
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              <BookOpen className="inline mr-3 h-10 w-10 text-yellow-500" />
              15 Tính Chất Định Thức Ma Trận
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá các tính chất cơ bản của định thức ma trận thông qua ví dụ minh họa và animation tương tác
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-green-600">5</div>
                <p className="text-sm text-gray-600">Tính chất dễ</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-yellow-600">4</div>
                <p className="text-sm text-gray-600">Tính chất trung bình</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-orange-600">5</div>
                <p className="text-sm text-gray-600">Tính chất khó</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold text-red-600">1</div>
                <p className="text-sm text-gray-600">Tính chất rất khó</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6">
          {propertiesData.map((property) => {
            const typeInfo = getPropertyTypeInfo(property.type)
            return (
              <Card
                key={property.id}
                className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-yellow-400"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <span className="text-2xl">{typeInfo.icon}</span>
                        <span className="text-yellow-700">#{property.id}</span>
                        {property.name}
                      </CardTitle>
                      <CardDescription className="text-base mt-2 leading-relaxed">
                        {property.description}
                      </CardDescription>

                      <div className="flex gap-2 mt-3">
                        <Badge className={typeInfo.color}>{property.type}</Badge>
                        <Badge className={getDifficultyColor(typeInfo.difficulty)}>{typeInfo.difficulty}</Badge>
                        <Badge variant="outline">{getFactorDescription(property.factor)}</Badge>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      onClick={() => setAnimatingProperty(property.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 ml-4"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Xem Animation
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="text-center space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">Ma trận ban đầu</h4>
                      <div className="bg-blue-50 p-6 rounded-xl">
                        <Matrix cells={property.example.before} showDeterminant={true} determinantValue="δ" />
                      </div>
                      <p className="text-blue-700 font-medium">det(A) = δ</p>
                    </div>

                    <div className="text-center space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">Ma trận sau biến đổi</h4>
                      <div className="bg-green-50 p-6 rounded-xl">
                        <Matrix
                          cells={property.example.after}
                          showDeterminant={true}
                          determinantValue={
                            property.factor === 1
                              ? "δ"
                              : property.factor === -1
                                ? "-δ"
                                : property.factor === 0
                                  ? "0"
                                  : `${property.factor}δ`
                          }
                        />
                      </div>
                      <p className="text-green-700 font-medium">
                        det(B) ={" "}
                        {property.factor === 1
                          ? "δ"
                          : property.factor === -1
                            ? "-δ"
                            : property.factor === 0
                              ? "0"
                              : `${property.factor}δ`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <h5 className="font-semibold text-yellow-800 mb-2">
                      <Calculator className="inline mr-2 h-4 w-4" />
                      Tác động lên định thức:
                    </h5>
                    <p className="text-yellow-700">
                      {property.factor === 1
                        ? "Định thức không thay đổi (det(B) = δ)"
                        : property.factor === -1
                          ? "Định thức đổi dấu (det(B) = -δ)"
                          : property.factor === 0
                            ? "Định thức bằng 0 (det(B) = 0)"
                            : `Định thức nhân với ${property.factor} (det(B) = ${property.factor}δ)`}
                    </p>
                  </div>

                  {/* Detailed Information */}
                  <div className="mt-6 space-y-4">
                    {/* Formula */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-900 mb-2">📐 Công thức:</h5>
                      <div className="text-blue-800 font-mono text-sm bg-white p-2 rounded border">
                        {property.formula || "Xem animation để biết chi tiết"}
                      </div>
                    </div>

                    {/* Detailed Explanation */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-green-900 mb-2">🔍 Giải thích chi tiết:</h5>
                      <p className="text-green-800 text-sm leading-relaxed">
                        {property.detailedExplanation || property.description}
                      </p>
                    </div>

                    {/* Applications */}
                    {property.applications && (
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-purple-900 mb-2">🎯 Ứng dụng:</h5>
                        <ul className="text-purple-800 text-sm space-y-1">
                          {property.applications.map((app, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Animation Modal */}
        {animatingProperty && (
          <PropertyAnimation
            property={propertiesData.find((p) => p.id === animatingProperty)!}
            onClose={() => setAnimatingProperty(null)}
          />
        )}
      </div>
    </div>
  )
}
