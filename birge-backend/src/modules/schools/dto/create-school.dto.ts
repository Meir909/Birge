import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsObject()
  location: {
    lat: number;
    lng: number;
  };

  @IsOptional()
  @IsString()
  contact_person?: string;

  @IsOptional()
  @IsString()
  contact_phone?: string;

  @IsOptional()
  @IsString()
  contact_email?: string;

  @IsArray()
  @IsString({ each: true })
  available_classes: string[];

  @IsObject()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule: ScheduleDto;
}

export class ScheduleDto {
  @IsString()
  start_time: string;

  @IsString()
  end_time: string;

  @IsArray()
  @IsString({ each: true })
  days: string[];
}

export class UpdateSchoolDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsObject()
  location?: {
    lat: number;
    lng: number;
  };

  @IsOptional()
  @IsString()
  contact_person?: string;

  @IsOptional()
  @IsString()
  contact_phone?: string;

  @IsOptional()
  @IsString()
  contact_email?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  available_classes?: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule?: ScheduleDto;
}