import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../schemas/user.schema';

export class UserResponseDto {
  @ApiProperty({ example: '64f8f1aab3e...' })
  id: string;

  @ApiProperty({ example: 'ali' })
  username: string;

  @ApiProperty({
    example: 'student',
    enum: ['student', 'teacher', 'admin'],
    description: 'نقش کاربر: دانشجو، استاد، یا مدیر گروه',
  })
  role: UserRole;
}