import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'ali' })
  username: string;

  @ApiProperty({ example: 'secret123', minLength: 6 })
  password: string;

  @ApiProperty({
    example: 'student',
    enum: ['student', 'teacher', 'admin'],
    description: 'نقش کاربر: دانشجو، استاد، یا مدیر گروه',
  })
  role: 'student' | 'teacher' | 'admin';
}