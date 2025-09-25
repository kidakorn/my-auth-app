# my-auth-app

## 1. Database Configuration
1. Create a `config/database.js` file  
   → เขียนโค้ดสำหรับเชื่อมต่อฐานข้อมูล MySQL

## 2. Models
2. Create a `models/userModel.js` file  
   → เขียนโค้ดจัดการฐานข้อมูล เช่น  
   - `createUser` (สร้างผู้ใช้ใหม่)  
   - `findUserByEmail` (ค้นหาผู้ใช้จากอีเมล)

## 3. Utilities & Services
3. Create a `utils/passwordHash.js` file  
   → ฟังก์ชันเข้ารหัสและตรวจสอบรหัสผ่านด้วย **bcryptjs**

4. Create a `services/jwtService.js` file  
   → ฟังก์ชันสำหรับสร้างและตรวจสอบ **JWT** ด้วย **jsonwebtoken**

5. Create a `middleware/authMiddleware.js` file  
   → ตรวจสอบ JWT จาก **Authorization header** ของ request

## 4. Controllers & Routes
6. Create a `controllers/authController.js` file  
   → เขียน logic สำหรับ **register** และ **login**  
   (เรียกใช้ functions จาก models, utils, services)

7. Create a `routes/authRoutes.js` file  
   → กำหนด route สำหรับ `/register` และ `/login`  
   (เรียกใช้ controller ที่เกี่ยวข้อง)

## 5. Server Setup
8. Create a `server.js` file  
   - เชื่อมต่อ middleware เช่น **body-parser**  
   - เชื่อมต่อ `authRoutes` ให้ server รู้จัก API  
   - กำหนดพอร์ต และ start server  

## 6. Run Project
9. Run the server:  
   ```bash
   node server.js
