import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { MapsService } from './maps.service';
import { 
  GeocodeDto, 
  ReverseGeocodeDto, 
  CalculateRouteDto, 
  OptimizeWaypointsDto, 
  FindNearbyDto 
} from './dto/maps.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Post('geocode')
  @UseGuards(JwtAuthGuard)
  async geocode(@Body() geocodeDto: GeocodeDto) {
    return this.mapsService.geocode(geocodeDto);
  }

  @Post('reverse-geocode')
  @UseGuards(JwtAuthGuard)
  async reverseGeocode(@Body() reverseGeocodeDto: ReverseGeocodeDto) {
    return this.mapsService.reverseGeocode(reverseGeocodeDto);
  }

  @Post('route')
  @UseGuards(JwtAuthGuard)
  async calculateRoute(@Body() calculateRouteDto: CalculateRouteDto) {
    return this.mapsService.calculateRoute(calculateRouteDto);
  }

  @Post('optimize-waypoints')
  @UseGuards(JwtAuthGuard)
  async optimizeWaypoints(@Body() optimizeWaypointsDto: OptimizeWaypointsDto) {
    return this.mapsService.optimizeWaypoints(optimizeWaypointsDto);
  }

  @Get('nearby')
  @UseGuards(JwtAuthGuard)
  async findNearby(@Query() findNearbyDto: FindNearbyDto) {
    return this.mapsService.findNearby(findNearbyDto);
  }

  @Get('static-map')
  @UseGuards(JwtAuthGuard)
  async getStaticMap(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('zoom') zoom?: number
  ) {
    const center = { lat: parseFloat(lat.toString()), lng: parseFloat(lng.toString()) };
    return this.mapsService.getStaticMap(center, zoom);
  }

  @Get('validate-coordinates')
  @UseGuards(JwtAuthGuard)
  async validateCoordinates(
    @Query('lat') lat: number,
    @Query('lng') lng: number
  ) {
    const isValid = await this.mapsService.validateCoordinates(
      parseFloat(lat.toString()), 
      parseFloat(lng.toString())
    );
    return { valid: isValid };
  }
}