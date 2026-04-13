# TueDuc_Edu API Reference

Base URL: `http://localhost:3000`

Swagger: `http://localhost:3000/api/docs`

## Common Query Parameters (List Endpoints)
Hầu hết các API trả về danh sách đều hỗ trợ phân trang và tìm kiếm:
- `page` (number, default: 1): Trang hiện tại
- `limit` (number, default: 20): Số lượng bản ghi mỗi trang
- `search` (string, optional): Tìm kiếm theo tên/email/mã tùy module
- **Response Format**: Trả về dạng `{ data, total, page, limit, totalPages }`

## Auth

### POST `/auth/register`
- Quyền: Public
- Mô tả: Đăng ký tài khoản dành cho Phụ huynh.
- Body:
  - `email` (string)
  - `password` (string)
  - `name` (string)
  - `phoneNumber` (string)
- **Lưu ý**: Endpoint này chỉ cho phép đăng ký với Role mặc định là `PARENT`. Mọi giá trị `role` truyền lên sẽ bị hệ thống bỏ qua để đảm bảo an toàn.

### POST `/auth/login`
- Quyền: Public
- Mô tả: Đăng nhập lấy JWT
- Body:
  - `email` (string)
  - `password` (string)
- Response:
  - `access_token`
  - `user`

## Users

### GET `/users/me`
- Quyền: `admin|teacher|parent`
- Header: `Authorization: Bearer <token>`

### GET `/users/me/children`
- Quyền: `parent`
- Mô tả: Danh sách tất cả con của phụ huynh

### GET `/users/me/active-child`
- Quyền: `parent`
- Mô tả: Lấy `activeStudentId` + `activeChild` (nếu có) + danh sách con

### PUT `/users/me/active-child`
- Quyền: `parent`
- Body:
  - `studentId`
- Mô tả: Switch giữa các con bằng cách set active child

### POST `/users`
- Quyền: `admin`
- Body: `CreateUserDto` (email, password, name, phoneNumber, role)
- Mô tả: Admin tạo mới người dùng với Role bất kỳ (Giáo viên, Phụ huynh, hoặc Admin khác).

### GET `/users`
- Quyền: `admin`
- Query: `page`, `limit`, `search`

### GET `/users/teachers`
- Quyền: `admin`
- Query: `page`, `limit`, `search`

### GET `/users/parents`
- Quyền: `admin`
- Query: `page`, `limit`, `search`

### PUT `/users/:id/active`
- Quyền: `admin`
- Body: `isActive` (boolean)

### PUT `/users/:id/reset-password`
- Quyền: `admin`
- Body: `newPassword` (string)

### GET `/users/:id`
- Quyền: `admin`

## Classes

### GET `/classes`
- Quyền: `admin|teacher`
- Query: `page`, `limit`, `search`, `status`, `grade`, `academicYear`
- Mô tả:
  - `admin`: xem tất cả
  - `teacher`: chỉ xem lớp chủ nhiệm

### GET `/classes/:id`
- Quyền: `admin|teacher` (teacher chỉ xem lớp chủ nhiệm)

### POST `/classes`
- Quyền: `admin`
- Body:
  - `name`, `grade`, `academicYear`
  - `homeroomTeacherId` (optional)
  - `maxStudents` (optional)

### PATCH `/classes/:id`
- Quyền: `admin`

### PATCH `/classes/:id/status`
- Quyền: `admin`
- Body: `status` (`open|paused|closed`)

### POST `/classes/:id/clone`
- Quyền: `admin`

### POST `/classes/:id/archive`
- Quyền: `admin`

### DELETE `/classes/:id`
- Quyền: `admin`

## Students

### GET `/students`
- Quyền: `admin|teacher`
- Query: `page`, `limit`, `search`, `classId`, `status`, `gender`

### GET `/students/my`
- Quyền: `parent`
- Mô tả: Danh sách con của phụ huynh

### GET `/students/:id`
- Quyền: `admin|teacher|parent` (lọc theo quyền)

### POST `/students`
- Quyền: `admin|teacher`
- Rule:
  - `teacher` chỉ tạo/sửa học sinh thuộc lớp chủ nhiệm
- Body:
  - `name`, `dateOfBirth` (optional), `gender` (optional)
  - `parentId` (optional, phải là role parent)
  - `classId` (optional)

### PATCH `/students/:id`
- Quyền: `admin|teacher`

### PATCH `/students/:id/transfer`
- Quyền: `admin`
- Body: `classId`

### PATCH `/students/:id/link-parent`
- Quyền: `admin`
- Body:
  - `parentId` (uuid) — phải là tài khoản có role `parent`
- Mô tả: Liên kết phụ huynh (đã tự đăng ký) với học sinh. Hỗ trợ 1 phụ huynh liên kết nhiều học sinh (multi-child)

### PATCH `/students/:id/unlink-parent`
- Quyền: `admin`
- Mô tả: Hủy liên kết phụ huynh khỏi học sinh (set `parentId = null`)

### POST `/students/claim`
- Quyền: `parent`
- Body:
  - `studentCode` (string) — format `HS-XXXXXX`, ví dụ `HS-A1B2C3`
- Mô tả: Phụ huynh tự liên kết vào học sinh bằng mã. Idempotent (gọi lại không lỗi nếu đã claim). Trả về `409` nếu mã đã thuộc phụ huynh khác
- Error codes:
  - `404` — mã không tồn tại
  - `409` — mã đã được claim bởi phụ huynh khác

### POST `/students/:id/regenerate-code`
- Quyền: `admin`
- Mô tả: Sinh lại mã học sinh mới (dùng khi mã cũ bị lộ)

### DELETE `/students/:id`
- Quyền: `admin`

## Courses

### GET `/courses`
- Quyền: `admin|teacher`
- Query: `page`, `limit`, `search`, `classId`, `teacherId`
- Mô tả:
  - `admin`: xem tất cả
  - `teacher`: chỉ xem course được gán

### GET `/courses/:id`
- Quyền: `admin|teacher` (teacher chỉ xem course của mình)

### POST `/courses`
- Quyền: `admin`
- Body:
  - `name`, `code`, `description` (optional)
  - `classId`
  - `teacherId` (optional)

### PATCH `/courses/:id`
- Quyền: `admin`

## Assessments (3 Cội Nguồn)

### POST `/assessments`
- Quyền: `teacher|admin`

### GET `/assessments/student/:studentId`
- Quyền: `admin|teacher|parent` (lọc theo quyền)

### GET `/assessments/student/:studentId/three-roots`
- Quyền: `admin|teacher|parent`
- Mô tả: Tổng hợp điểm trung bình Đức/Trí/Nghị lực

### GET `/assessments/:id`
- Quyền: `admin|teacher|parent` (lọc theo quyền)

### PATCH `/assessments/:id`
- Quyền: `teacher|admin`

## Attendance (Điểm danh)

### POST `/attendance/mark`
- Quyền: `teacher|admin`
- Rule:
  - `teacher` chỉ điểm danh lớp chủ nhiệm
- Body:
  - `classId`
  - `date` (YYYY-MM-DD)
  - `shiftId` (uuid)
  - `records`: `[{ studentId, status, note? }]`
  - `status`: `present|absent|late|excused`

### GET `/attendance/class/:classId?date=YYYY-MM-DD&shiftId=<uuid>`
- Quyền: `teacher|admin`

### GET `/attendance/student/:studentId`
- Quyền: `parent|teacher|admin` (lọc theo quyền)

### GET `/attendance/admin/sessions?date=YYYY-MM-DD&shiftId=<uuid>`
- Quyền: `admin`
- Mô tả: Xem điểm danh theo ngày/buổi cho toàn trung tâm

### PATCH `/attendance/sessions/:sessionId`
- Quyền: `admin`
- Body:
  - `reason?`
  - `records`: `[{ studentId, status, note? }]`
- Mô tả: Sửa điểm danh và lưu lịch sử chỉnh sửa

### GET `/attendance/sessions/:sessionId/edits`
- Quyền: `admin`

## Homeworks (Bài tập về nhà)

### GET `/homeworks`
- Quyền: `admin|teacher|parent`
- Query: `page`, `limit`, `search`, `classId`, `teacherId` (admin), `studentId` (parent)
- Mô tả:
  - `admin`: Xem toàn bộ.
  - `teacher`: Xem bài tập tự tạo HOẶC bài tập của lớp mình làm chủ nhiệm. Hỗ trợ lọc theo `classId`.
  - `parent`: Xem bài tập của con (lọc theo `studentId`).
- **Response Format**: Trả về thêm field `stats: { totalStudents, submittedCount }` cho mỗi bài tập để hiển thị tiến độ làm bài trên UI.

### POST `/homeworks`
- Quyền: `teacher|admin`
- Body:
  - `title`, `description?`
  - `type`: `quiz|essay`
  - `dueAt?` (ISO string)
  - `classId`
  - `targetScope`: `class|students`
  - `studentIds?` (required nếu `targetScope=students`)
  - `quizQuestions?` (required nếu `type=quiz`): `[{ prompt, options, correctIndex }]`
  - `teacherId?` (admin only)

### GET `/homeworks/:id`
- Quyền: `admin|teacher|parent` (lọc theo quyền)

### PATCH `/homeworks/:id`
- Quyền: `teacher|admin` (teacher chỉ sửa homework của mình)

### GET `/homeworks/:id/status`
- Quyền: `teacher|admin`
- Mô tả: Trạng thái nộp/chấm của từng học sinh (not_submitted/submitted/graded)

### POST `/homeworks/:id/submissions/quiz`
- Quyền: `parent`
- Body:
  - `studentId`
  - `answers`: mảng index đáp án theo câu

### POST `/homeworks/:id/submissions/essay`
- Quyền: `parent`
- Content-Type: `multipart/form-data`
- Fields:
  - `studentId` (text)
  - `files` (file[], tối đa 10)
- Mô tả: Nộp bài tự luận bằng cách chụp ảnh và đính kèm

### GET `/homeworks/:id/submissions`
- Quyền: `teacher|admin`

### PATCH `/homeworks/submissions/:submissionId/grade`
- Quyền: `teacher|admin`
- Body:
  - `score?` (0..10)
  - `feedback?`

## Uploads

### GET `/uploads/<filename>`
- Quyền: Public
- Mô tả: Serve file đã upload khi phụ huynh nộp bài tự luận

## Tuition (Học phí)

### POST `/tuition/students/:studentId/plan`
- Quyền: `admin`
- Body:
  - `monthlyFee` (number)
- Mô tả: Thiết lập học phí theo tháng cho 1 học sinh

### POST `/tuition/students/:studentId/payments`
- Quyền: `admin`
- Body:
  - `month` (YYYY-MM)
  - `amount` (number)
  - `method?` (string)
  - `note?` (string)
- Mô tả: Ghi nhận 1 lần đóng học phí

### GET `/tuition/students/:studentId?month=YYYY-MM`
- Quyền: `admin|parent` (parent chỉ xem con mình)
- Response:
  - `due` (học phí tháng)
  - `paid` (tổng đã đóng)
  - `debt` (còn nợ)
  - `status`: `paid|debt`
  - `payments` (danh sách lần đóng)

### GET `/tuition/parent/me?month=YYYY-MM`
- Quyền: `parent`
- Mô tả: Tổng hợp học phí theo tháng cho tất cả con (multi-child)

### GET `/tuition/unpaid?month=YYYY-MM&classId=<uuid?>`
- Quyền: `admin`
- Mô tả: Danh sách học sinh còn nợ theo tháng (lọc theo lớp nếu cần)

### POST `/tuition/unpaid/remind?month=YYYY-MM&classId=<uuid?>`
- Quyền: `admin`
- Mô tả: Trả danh sách nhắc đóng học phí (hiện trả về cùng dữ liệu unpaid)

## Salary (Lương giáo viên)

### POST `/salary/teachers/:teacherId/rates`
- Quyền: `admin`
- Body:
  - `shiftId`
  - `amountPerSession` (number)
- Mô tả: Thiết lập đơn giá 1 buổi dạy theo ca cho giáo viên

### GET `/salary/teachers/:teacherId/rates`
- Quyền: `admin|teacher` (teacher chỉ xem của mình)

### GET `/salary/teachers/:teacherId?month=YYYY-MM`
- Quyền: `admin|teacher` (teacher chỉ xem của mình)
- Mô tả: Báo cáo lương theo tháng dựa trên lịch dạy (class_schedules) và đơn giá theo ca

### GET `/salary/teachers/me?month=YYYY-MM`
- Quyền: `teacher`

## Shifts (Ca học)

### GET `/shifts`
- Quyền: `admin|teacher|parent`
- Mô tả: Danh sách ca học

### POST `/shifts`
- Quyền: `admin`
- Body: `name`, `startTime` (HH:mm:ss), `endTime` (HH:mm:ss)

### PATCH `/shifts/:id`
- Quyền: `admin`

## Schedules (Lịch theo ca)

### POST `/schedules/classes`
- Quyền: `admin`
- Mô tả: Tạo lịch học cho lớp theo `weekday` + `shift`
- Body: `classId`, `weekday` (0..6), `shiftId`, `teacherId`

### GET `/schedules/class/:classId`
- Quyền: `admin|teacher` (teacher chỉ xem lớp chủ nhiệm)

### GET `/schedules/student/:studentId?date=YYYY-MM-DD`
- Quyền: `parent|teacher|admin` (lọc theo quyền)
- Mô tả: Lịch học của học sinh trong ngày (theo ca)

### GET `/schedules/teacher/me`
- Quyền: `teacher|admin`
- Query: `date` (YYYY-MM-DD, optional - mặc định là hôm nay)
- Mô tả: Lịch dạy của giáo viên trong ngày (theo ca)

### GET `/schedules/teacher/today`
- Quyền: `teacher`
- Mô tả: Shortcut lấy lịch dạy hôm nay

### GET `/schedules/teacher/me/week`
- Quyền: `teacher`
- Query: `startDate` (YYYY-MM-DD)
- Mô tả: Xem lịch dạy theo tuần (dùng cho tính năng Next/Prev week)

### GET `/schedules/teacher/:teacherId`
- Quyền: `admin`
- Query: `date` (optional)

### GET `/schedules/center/week?start=YYYY-MM-DD`
- Quyền: `admin`
- Mô tả: Lịch toàn trung tâm theo tuần (trả về danh sách schedule)

## Admin

### GET `/admin/dashboard?month=YYYY-MM&date=YYYY-MM-DD`
- Quyền: `admin`
- Mô tả: Tổng quan lớp/học sinh/giáo viên, attendance hôm nay, tổng học phí tháng
