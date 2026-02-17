import { IsString, IsNotEmpty, IsOptional, IsEnum, IsObject } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  trip_id: string;

  @IsEnum(['text', 'image', 'location', 'system'])
  type: 'text' | 'image' | 'location' | 'system';

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsObject()
  metadata?: {
    location?: { lat: number; lng: number; address?: string };
    image_url?: string;
    image_thumbnail?: string;
    system_type?: 'trip_started' | 'trip_ended' | 'user_joined' | 'user_left';
  };

  @IsOptional()
  @IsString()
  reply_to_id?: string;
}

export class MarkAsReadDto {
  @IsString()
  @IsNotEmpty()
  message_id: string;
}

export class GetMessagesDto {
  @IsString()
  @IsNotEmpty()
  trip_id: string;

  @IsOptional()
  @IsString()
  before?: string;

  @IsOptional()
  @IsString()
  after?: string;

  @IsOptional()
  limit?: number = 50;
}