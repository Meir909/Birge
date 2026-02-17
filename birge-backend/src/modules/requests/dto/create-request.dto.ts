import { IsString, IsNotEmpty, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  trip_id: string;

  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  pickup_location: LocationDto;

  @IsOptional()
  @IsString()
  message?: string;
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

export class UpdateRequestDto {
  @IsOptional()
  @IsString()
  status?: 'pending' | 'accepted' | 'rejected';

  @IsOptional()
  @IsString()
  rejection_reason?: string;

  @IsOptional()
  @IsObject()
  ai_analysis?: {
    compatibility_score: number;
    route_impact: {
      additional_distance: number;
      additional_time: number;
      deviation_percentage: number;
    };
    recommendation: 'accept' | 'consider' | 'reject';
    reasons: string[];
  };
}