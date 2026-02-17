import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GeocodeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  region?: string;
}

export class ReverseGeocodeDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CalculateRouteDto {
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  origin: LocationDto;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  destination: LocationDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  waypoints?: LocationDto[];

  @IsOptional()
  @IsString()
  mode?: 'driving' | 'walking' | 'bicycling' | 'transit';

  @IsOptional()
  @IsString()
  departure_time?: string;
}

export class OptimizeWaypointsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  locations: LocationDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  start_location: LocationDto;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  end_location: LocationDto;

  @IsOptional()
  @IsString()
  optimization_type?: 'time' | 'distance' | 'balanced';
}

export class LocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsOptional()
  @IsString()
  address?: string;
}

export class FindNearbyDto {
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNumber()
  radius: number; // in meters

  @IsOptional()
  @IsString()
  type?: string; // poi type
}