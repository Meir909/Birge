import { IsString, IsOptional, IsEmail, IsEnum, IsBoolean, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  first_name: string;

  @IsString()
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

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

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

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;
}

export class UserFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['driver', 'parent', 'student', 'admin'])
  role?: 'driver' | 'parent' | 'student' | 'admin';

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;

  @IsOptional()
  @IsString()
  school_id?: string;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}