# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.



<!-- เวลาจำทำโปรเจค three.js ลง 3 ตัวนี้ -->
<!-- npm install three @react-three/fiber @react-three/drei -->

รูปทรง	     Geometry	            พารามิเตอร์หลัก
วงกลมแบน    CircleGeometry	        รัศมี, จำนวนชิ้น (segments)
สี่เหลี่ยมแบน	PlaneGeometry	        กว้าง, สูง
กล่องสี่เหลี่ยม	    BoxGeometry	        กว้าง, สูง, ลึก
ลูกบอล	        SphereGeometry	    รัศมี, จำนวนชิ้น
ทรงกระบอก	    CylinderGeometry	รัศมีบน, รัศมีล่าง, สูง
โดนัท	        TorusGeometry	    รัศมีใหญ่, รัศมีท่อ


position ไม่มีหน่วยตายตัว มันคือ “world units” ซึ่งเป็นหน่วยที่เรากำหนดเองในฉาก จะคิดว่าเป็นเมตรก็ได้ ค่า 1 คือระยะหนึ่งช่อง

args คือพารามิเตอร์ที่ส่งเข้า constructor ของคลาสนั้นตามลำดับในเอกสาร three.js ใช้เฉพาะกับ geometry เช่น 
boxGeometry args={[กว้าง, สูง, ลึก]}  ขนาดที่ใส่จะใช้หน่วยเดียวกับ position

กฎ
1. <Canvas> และกฎข้อแรก
    <Canvas> คือจุดเริ่มต้นทุกอย่าง มันสร้าง renderer, scene, กล้อง (ค่าเริ่มต้นอยู่ที่ z = 5) และ render loop ให้อัตโนมัติ

2. กฎการเขียน prop
    ทุกคลาสใน three.js ใช้เป็นแท็กได้ โดยตัวแรกเป็นตัวเล็ก เช่น BoxGeometry เป็น <boxGeometry>

    position={[x, y, z]} ใช้ array เสมอ
    rotation={[x, y, z]} หน่วยเป็น เรเดียน ไม่ใช่องศา หมุน 90 องศาเขียนว่า Math.PI / 2
    scale={2} ขยายทุกแกน หรือ scale={[2, 1, 1]} ขยายเฉพาะบางแกน
    args={[...]} คือพารามิเตอร์ของ constructor ตามลำดับในเอกสาร three.js เช่น BoxGeometry(width, height, depth)

3. แสงและวัสดุ
    วัสดุแบบ meshStandardMaterial ต้องมีแสงถึงจะเห็นสี ถ้าไม่มีแสงจะเป็นสีดำ
    ambientLight ให้แสงทั่วทุกทิศ ส่วน directionalLight เหมือนแสงแดดที่มีทิศทาง
    วัสดุที่ไม่ต้องใช้แสงคือ meshBasicMaterial

4. Animation ด้วย useFrame

6. group และการซ้อนกัน
    <group> ทำหน้าที่เหมือน parent ทั่วไป เมื่อขยับ group ลูกทุกชิ้นจะขยับตาม และตำแหน่งของลูกเป็นค่าเทียบกับ group