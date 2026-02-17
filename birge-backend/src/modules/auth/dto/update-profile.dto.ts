import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(['driver', 'parent', 'student'])
  role?: 'driver' | 'parent' | 'student';

  @IsOptional()
  @IsString()
  license_number?: string;

  @IsOptional()
  @IsString()
  vehicle_type?: string;

  @IsOptional()
  @IsString()
  vehicle_plate?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}