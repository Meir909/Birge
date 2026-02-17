import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsObject, IsInt, IsEnum, IsTime } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  school_id: string;

  @IsString()
  @IsNotEmpty()
  class: string;

  @IsEnum(['to_school', 'from_school', 'both'])
  trip_type: 'to_school' | 'from_school' | 'both';

  @IsArray()
  @IsString({ each: true })
  days_of_week: string[];

  @IsTime()
  departure_time: string;

  @IsOptional()
  @IsTime()
  return_time?: string;

  @IsInt()
  available_seats: number;

  @IsObject()
  @ValidateNested()
  @Type(() => RouteDto)
  route: RouteDto;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  preferences?: {
    auto_accept: boolean;
    same_class_only: boolean;
    price_per_trip?: number;
  };
}

export class RouteDto {
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  start_location: LocationDto;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  end_location: LocationDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WaypointDto)
  waypoints: WaypointDto[];

  @IsInt()
  total_distance: number;

  @IsInt()
  total_duration: number;

  @IsString()
  polyline: string;
}

export class LocationDto {
  @IsObject()
  location: {
    lat: number;
    lng: number;
  };

  @IsString()
  address: string;
}

export class WaypointDto {
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsInt()
  order: number;

  @IsOptional()
  @IsString()
  participant_id?: string;

  @IsOptional()
  @IsString()
  estimated_arrival?: string;
}

export class UpdateTripDto {
  @IsOptional()
  @IsEnum(['active', 'full', 'completed', 'cancelled'])
  status?: 'active' | 'full' | 'completed' | 'cancelled';

  @IsOptional()
  @IsInt()
  occupied_seats?: number;

  @IsOptional()
  @IsObject()
  ai_metrics?: {
    route_optimality: number;
    time_efficiency: number;
    participant_compatibility: number;
    last_calculated: Date;
  };

  @IsOptional()
  @IsBoolean()
  is_ai_optimized?: boolean;
}