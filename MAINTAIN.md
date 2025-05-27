# Hướng dẫn bảo trì và phát triển

## 🛠️ Công cụ phát triển

### Yêu cầu hệ thống
- Node.js 18.0.0 trở lên
- npm 9.0.0 trở lên
- Git

### IDE và Extensions
- VS Code với các extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

## 📝 Quy trình phát triển

### 1. Cài đặt môi trường
```bash
# Cài đặt dependencies
npm install

# Chạy linter
npm run lint

# Chạy type check
npm run type-check
```

### 2. Cấu trúc dữ liệu

#### Questions (data/questions.json)
```typescript
interface Question {
  id: number
  propertyUsedId: number
  matrixA: (string | number)[][]
  matrixB: (string | number)[][]
  options: string[]
  correct: string
  explanation: string
}
```

#### Properties (data/properties.json)
```typescript
interface Property {
  id: number
  name: string
  description: string
  type: 'swap' | 'scale' | 'add' | 'identical' | 'triangular'
  formula: string
}
```

### 3. Quy tắc code

#### TypeScript
- Sử dụng strict mode
- Định nghĩa interface cho tất cả props
- Tránh sử dụng `any`
- Sử dụng type inference khi có thể

#### React
- Sử dụng functional components
- Tách logic phức tạp vào custom hooks
- Sử dụng React.memo cho components tĩnh
- Tránh prop drilling, sử dụng context hoặc store khi cần

#### Styling
- Sử dụng Tailwind CSS classes
- Tạo custom components cho UI elements tái sử dụng
- Tuân thủ design system của shadcn/ui

### 4. Testing

```bash
# Chạy tests
npm test

# Chạy tests với coverage
npm run test:coverage
```

### 5. Build và Deploy

```bash
# Build production
npm run build

# Preview production build
npm run start
```

## 🔄 Quy trình cập nhật

### 1. Thêm câu hỏi mới
1. Thêm câu hỏi vào `data/questions.json`
2. Đảm bảo format đúng với interface Question
3. Kiểm tra ma trận và công thức toán học
4. Test câu hỏi trong development

### 2. Thêm tính chất mới
1. Thêm tính chất vào `data/properties.json`
2. Cập nhật interface Property nếu cần
3. Thêm câu hỏi liên quan
4. Cập nhật documentation

### 3. Cập nhật UI
1. Tạo branch mới
2. Cập nhật components
3. Test trên các kích thước màn hình
4. Tạo pull request

## 🐛 Debugging

### Common Issues

1. **Matrix Rendering**
   - Kiểm tra format của ma trận
   - Đảm bảo tất cả cells là number hoặc string
   - Kiểm tra kích thước ma trận

2. **Math Formulas**
   - Kiểm tra cú pháp KaTeX
   - Đảm bảo escape các ký tự đặc biệt
   - Test trên các trình duyệt khác nhau

3. **State Management**
   - Kiểm tra Zustand store
   - Đảm bảo persistence hoạt động
   - Xử lý edge cases

### Performance Optimization

1. **Code Splitting**
   - Sử dụng dynamic imports
   - Tách components lớn
   - Lazy load routes

2. **Asset Optimization**
   - Tối ưu images
   - Sử dụng next/image
   - Minify CSS/JS

3. **Caching**
   - Implement SWR cho data fetching
   - Sử dụng localStorage cho user preferences
   - Cache API responses

## 📈 Monitoring

### Analytics
- Theo dõi user engagement
- Phân tích performance
- Error tracking

### Logging
- Implement error boundaries
- Log critical errors
- Track user actions

## 🔒 Security

### Best Practices
- Sanitize user input
- Validate data
- Implement rate limiting
- Use HTTPS

### Data Protection
- Encrypt sensitive data
- Implement proper CORS
- Follow GDPR guidelines 