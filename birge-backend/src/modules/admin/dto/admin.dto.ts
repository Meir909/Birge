import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsEnum } from 'class-validator';

export class AdminStatsDto {
  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsEnum(['daily', 'weekly', 'monthly'])
  period?: 'daily' | 'weekly' | 'monthly';
}

export class UserManagementDto {
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}

export class TripManagementDto {
  @IsOptional()
  @IsEnum(['active', 'completed', 'cancelled'])
  status?: 'active' | 'completed' | 'cancelled';

  @IsOptional()
  @IsString()
  driver_id?: string;

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

export class SystemSettingsDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  description?: string;
}