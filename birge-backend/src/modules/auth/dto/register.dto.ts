import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(['driver', 'parent', 'student', 'admin'])
  role?: 'driver' | 'parent' | 'student' | 'admin';

  @IsOptional()
  @IsString()
  school_id?: string;

  @IsOptional()
  @IsString()
  license_number?: string;

  @IsOptional()
  @IsString()
  vehicle_type?: string;

  @IsOptional()
  @IsString()
  vehicle_plate?: string;
}