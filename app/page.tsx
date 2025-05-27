import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, BookOpen, BarChart3, Award, Play, Zap, Target, Clock } from "lucide-react"
import propertiesData from "@/data/properties.json"

export default function HomePage() {
  const propertyGroups = [
    {
      title: "Phép biến đổi cơ bản",
      properties: propertiesData.slice(0, 5),
      color: "bg-blue-50 border-blue-200",
      icon: "🔄",
    },
    {
      title: "Tính chất đặc biệt",
      properties: propertiesData.slice(5, 10),
      color: "bg-green-50 border-green-200",
      icon: "⭐",
    },
    {
      title: "Tính chất nâng cao",
      properties: propertiesData.slice(10, 15),
      color: "bg-purple-50 border-purple-200",
      icon: "🚀",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 rounded-full mb-6">
            <Calculator className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Quiz Định Thức
            <br />
            <span className="text-yellow-600">Ma Trận</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Khám phá và thành thạo <strong>15 tính chất cơ bản</strong> của định thức ma trận thông qua quiz tương tác
            với animation trực quan
          </p>

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/quiz/1?shuffle=true">
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Play className="mr-3 h-6 w-6" />
                Bắt đầu làm bài
              </Button>
            </Link>
            <Link href="/properties">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-gray-50">
                <BookOpen className="mr-2 h-5 w-5" />
                Xem tài liệu
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-600">150</div>
              <div className="text-sm text-gray-600">Câu hỏi</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600">15</div>
              <div className="text-sm text-gray-600">Tính chất</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600">4×4</div>
              <div className="text-sm text-gray-600">Ma trận tối đa</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-xl">Quiz Tương Tác</CardTitle>
              <CardDescription className="text-base">
                150 câu hỏi với animation trực quan và giải thích chi tiết
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Thống Kê Thông Minh</CardTitle>
              <CardDescription className="text-base">
                Phân tích chi tiết điểm mạnh, điểm yếu và thời gian làm bài
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Chứng Chỉ Hoàn Thành</CardTitle>
              <CardDescription className="text-base">
                Nhận chứng chỉ cá nhân hóa sau khi hoàn thành quiz
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* 15 Properties Overview */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">15 Tính Chất Định Thức</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Từ cơ bản đến nâng cao, nắm vững toàn bộ kiến thức về định thức ma trận
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {propertyGroups.map((group, groupIndex) => (
              <Card key={groupIndex} className={`${group.color} border-2 hover:shadow-lg transition-all duration-300`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <span className="text-2xl">{group.icon}</span>
                    {group.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {group.properties.map((property) => (
                      <div key={property.id} className="flex items-center gap-3 p-2 bg-white/50 rounded-lg">
                        <Badge variant="outline" className="text-xs">
                          #{property.id}
                        </Badge>
                        <span className="text-sm font-medium flex-1">{property.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/properties">
              <Button variant="outline" size="lg" className="px-8 py-3">
                <BookOpen className="mr-2 h-5 w-5" />
                Xem chi tiết tất cả tính chất
              </Button>
            </Link>
          </div>
        </div>

        {/* Analytics & Certificate Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-blue-900">
                <BarChart3 className="h-8 w-8" />
                Thống Kê Học Tập
              </CardTitle>
              <CardDescription className="text-blue-700 text-base">
                Theo dõi tiến độ học tập và phân tích kết quả chi tiết
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">Độ chính xác theo từng tính chất</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">Thời gian làm bài trung bình</span>
                </div>
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800">Điểm mạnh và cần cải thiện</span>
                </div>
              </div>
              <Link href="/analytics">
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">Xem thống kê của bạn</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl text-green-900">
                <Award className="h-8 w-8" />
                Chứng Chỉ Hoàn Thành
              </CardTitle>
              <CardDescription className="text-green-700 text-base">
                Nhận chứng chỉ cá nhân hóa sau khi hoàn thành quiz
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Chứng chỉ với tên và MSSV</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Hiển thị điểm số và thời gian</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Tải xuống định dạng PNG</span>
                </div>
              </div>
              <Link href="/result">
                <Button className="w-full mt-6 bg-green-600 hover:bg-green-700">Nhận chứng chỉ của bạn</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng thử thách bản thân?</h2>
          <p className="text-xl mb-8 opacity-90">
            Bắt đầu hành trình khám phá 15 tính chất định thức ma trận ngay hôm nay!
          </p>
          <Link href="/quiz/1?shuffle=true">
            <Button
              size="lg"
              className="bg-white text-yellow-600 hover:bg-gray-100 px-12 py-6 text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Play className="mr-3 h-6 w-6" />
              Bắt đầu ngay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
