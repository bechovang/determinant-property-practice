# Quiz Định Thức Ma Trận

Ứng dụng web tương tác giúp học và luyện tập các tính chất của định thức ma trận thông qua quiz trực quan.

## 🌟 Tính năng chính

- **150 câu hỏi tương tác**: Các câu hỏi được thiết kế để kiểm tra hiểu biết về 15 tính chất định thức
- **Xáo trộn câu hỏi**: Mỗi lần làm quiz, câu hỏi sẽ được xáo trộn ngẫu nhiên
- **Hiển thị ma trận trực quan**: Sử dụng component Matrix để hiển thị ma trận với animation
- **Thống kê chi tiết**: Theo dõi tiến độ học tập, thời gian làm bài và độ chính xác
- **Chứng chỉ hoàn thành**: Tạo chứng chỉ cá nhân hóa với thông tin người dùng và kết quả

## 🚀 Công nghệ sử dụng

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Math Rendering**: KaTeX
- **Animation**: Framer Motion

## 📦 Cài đặt

1. Clone repository:
```bash
git clone https://github.com/your-username/determinant-property-practice.git
cd determinant-property-practice
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy development server:
```bash
npm run dev
```

4. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt

## 🎯 Cấu trúc dự án

```
determinant-property-practice/
├── app/                    # Next.js app directory
│   ├── analytics/         # Trang thống kê
│   ├── properties/        # Trang tính chất
│   ├── quiz/             # Trang quiz
│   └── result/           # Trang kết quả
├── components/            # React components
├── data/                 # Dữ liệu JSON
├── lib/                  # Utilities và store
└── public/              # Static files
```

## 📚 Tài liệu API

### Components

- `Matrix`: Hiển thị ma trận với animation
- `PropertyBadge`: Hiển thị badge cho tính chất
- `ModalCertificate`: Tạo và hiển thị chứng chỉ
- `InlineMath`: Render công thức toán học inline

### Store

- `useQuizStore`: Quản lý state của quiz
  - `answers`: Lưu câu trả lời
  - `stats`: Thống kê theo tính chất
  - `userInfo`: Thông tin người dùng
  - `questionTimes`: Thời gian làm từng câu

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng đọc [CONTRIBUTING.md](CONTRIBUTING.md) để biết thêm chi tiết.

## 📄 Giấy phép

Dự án này được cấp phép theo [MIT License](LICENSE).