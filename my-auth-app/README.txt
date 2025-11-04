สร้างไฟล์ config/database.js เพื่อเขียนโค้ดสำหรับเชื่อมต่อฐานข้อมูลโดยใช้ mysql

สร้างไฟล์ models/userModel.js เพื่อเขียนโค้ดสำหรับจัดการกับฐานข้อมูล เช่น การสร้างผู้ใช้ใหม่ (createUser) และการค้นหาผู้ใช้จากอีเมล (findUserByEmail)

สร้าง Utility และ Service:

สร้างไฟล์ utils/passwordHash.js สำหรับฟังก์ชันการเข้ารหัสและตรวจสอบรหัสผ่านด้วย bcryptjs

สร้างไฟล์ services/jwtService.js สำหรับฟังก์ชันการสร้างและตรวจสอบ JWT ด้วย jsonwebtoken

สร้างไฟล์ middleware/authMiddleware.js สำหรับตรวจสอบ JWT จาก Authorization header ใน request   <---

สร้าง Controller และ Route:

สร้างไฟล์ controllers/authController.js เพื่อเขียน Logic สำหรับการสมัครสมาชิก (register) และการล็อกอิน (login) โดยเรียกใช้ฟังก์ชันจาก model, utils และ services ที่สร้างไว้

สร้างไฟล์ routes/authRoutes.js เพื่อกำหนดเส้นทาง (routes) สำหรับ /register และ /login โดยเรียกใช้ Controller ที่เกี่ยวข้อง

สร้างไฟล์ server.js เพื่อเริ่มต้น Express server

ทำการเชื่อมต่อ Middleware ที่จำเป็น เช่น body-parser

เชื่อมต่อไฟล์ authRoutes เพื่อให้เซิร์ฟเวอร์รู้จักเส้นทาง API

กำหนดพอร์ตและสั่งให้เซิร์ฟเวอร์เริ่มทำงาน

รันเซิร์ฟเวอร์: node server.js