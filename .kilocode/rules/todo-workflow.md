## Brief overview

กฏนี้กำหนด workflow สำหรับการจัดการ TODO.md ในโปรเจ็ค - ต้องสร้าง TODO.md ก่อนเริ่มงานทุกครั้ง และอัพเดตเช็คลิสเมื่อเสร็จงาน

## TODO.md Workflow

### Before Starting Any Task

- ถ้า `TODO.md` ยังไม่มี → สร้างใหม่ทันที
- ถ้า `TODO.md` มีอยู่แล้ว → ตรวจสอบว่างานที่จะทำอยู่ในเช็คลิสหรือยัง
  - ถ้ายังไม่มี → เพิ่มงานลงไปใน TODO.md ก่อนเริ่มทำ

### After Completing Any Task

- อัพเดต checkbox `[ ]` → `[x]` ใน TODO.md ทันที
- อัพเดตวันที่ในส่วนของวันนั้นๆ ใน TODO.md เสมอ
- ไม่ว่างานจะเล็กน้อยแค่ไหนก็ตาม → ต้องอัพเดต TODO.md

### TODO.md Format

```markdown
# TODO.md - [Project Name]

## [Date]

- [ ] Task 1
- [ ] Task 2
- [x] Completed Task

## [Date]

- [ ] Task 3
```

### Trigger

ใช้กฏนี้เมื่อ:

- ผู้ใช้สั่งให้ทำงานใหม่
- เริ่มทำงานใหม่ทุกครั้ง
- ทำงานเสร็จทุกครั้ง
