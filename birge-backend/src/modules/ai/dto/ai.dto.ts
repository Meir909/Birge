import { IsString, IsNotEmpty, IsOptional, IsArray, IsObject, IsNumber, IsEnum } from 'class-validator';

export class OptimizeRouteDto {
  @IsString()
  @IsNotEmpty()
  trip_id: string;

  @IsArray()
  @IsObject({ each: true })
  waypoints: Array<{
    location: { lat: number; lng: number; address: string };
    participant_id: string;
    order?: number;
  }>;

  @IsOptional()
  @IsString()
  optimization_type?: 'time' | 'distance' | 'safety' | 'balanced';
}

export class AnalyzeCompatibilityDto {
  @IsString()
  @IsNotEmpty()
  trip_id: string;

  @IsString()
  @IsNotEmpty()
  requester_id: string;

  @IsObject()
  pickup_location: {
    lat: number;
    lng: number;
    address: string;
  };

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferences?: string[];
}

export class GenerateRecommendationsDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  school_id: string;

  @IsOptional()
  @IsEnum(['driver', 'passenger'])
  role?: 'driver' | 'passenger';

  @IsOptional()
  @IsObject()
  filters?: {
    max_distance?: number;
    preferred_time?: string;
    same_class_only?: boolean;
  };
}

export class SafetyAnalysisDto {
  @IsString()
  @IsNotEmpty()
  trip_id: string;

  @IsArray()
  @IsObject({ each: true })
  route_points: Array<{
    lat: number;
    lng: number;
    timestamp?: string;
  }>;

  @IsOptional()
  @IsObject()
  weather_conditions?: {
    temperature: number;
    precipitation: string;
    visibility: string;
  };
}