import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsMimeType } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsNotEmpty()
  @IsMimeType()
  mimetype: string;

  @IsNumber()
  size: number;

  @IsOptional()
  @IsString()
  folder?: string;

  @IsOptional()
  @IsEnum(['avatar', 'document', 'trip_photo', 'chat_attachment'])
  type?: 'avatar' | 'document' | 'trip_photo' | 'chat_attachment';
}

export class ResizeImageDto {
  @IsString()
  @IsNotEmpty()
  file_key: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsOptional()
  @IsEnum(['cover', 'contain', 'fill'])
  fit?: 'cover' | 'contain' | 'fill';
}

export class GenerateThumbnailDto {
  @IsString()
  @IsNotEmpty()
  file_key: string;

  @IsOptional()
  @IsNumber()
  width?: number = 200;

  @IsOptional()
  @IsNumber()
  height?: number = 200;
}