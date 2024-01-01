import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { UploadLocalEntiy } from 'src/modules/upload_local/upload_local.entity';

export class UpdateUserDto {
  @ApiHideProperty()
  id: string;

  @ApiHideProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  avatar?: UploadLocalEntiy;

  @ApiHideProperty()
  avatarId?: string;

  @ApiHideProperty()
  updatedAt?: Date;
}
