import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GeocodeRequest, GeocodeResponse, DirectionsRequest, DirectionsResponse } from '@googlemaps/google-maps-services-js';
import { 
  GeocodeDto, 
  ReverseGeocodeDto, 
  CalculateRouteDto, 
  OptimizeWaypointsDto, 
  FindNearbyDto 
} from '../dto/maps.dto';

@Injectable()
export class MapsService {
  private readonly logger = new Logger(MapsService.name);
  private readonly googleMapsClient: Client;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY is not configured');
    }
    
    this.googleMapsClient = new Client({});
  }

  async geocode(geocodeDto: GeocodeDto): Promise<any> {
    try {
      const request: GeocodeRequest = {
        params: {
          address: geocodeDto.address,
          region: geocodeDto.region,
          key: this.configService.get('GOOGLE_MAPS_API_KEY')
        }
      };

      const response: GeocodeResponse = await this.googleMapsClient.geocode(request);
      
      if (response.data.status !== 'OK' || response.data.results.length === 0) {
        throw new BadRequestException('Geocoding failed');
      }

      const result = response.data.results[0];
      return {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        address: result.formatted_address,
        place_id: result.place_id,
        components: result.address_components
      };
    } catch (error) {
      this.logger.error('Geocoding failed:', error);
      throw new BadRequestException('Failed to geocode address');
    }
  }

  async reverseGeocode(reverseGeocodeDto: ReverseGeocodeDto): Promise<any> {
    try {
      const request: GeocodeRequest = {
        params: {
          latlng: `${reverseGeocodeDto.lat},${reverseGeocodeDto.lng}`,
          key: this.configService.get('GOOGLE_MAPS_API_KEY')
        }
      };

      const response: GeocodeResponse = await this.googleMapsClient.geocode(request);
      
      if (response.data.status !== 'OK' || response.data.results.length === 0) {
        throw new BadRequestException('Reverse geocoding failed');
      }

      const result = response.data.results[0];
      return {
        address: result.formatted_address,
        place_id: result.place_id,
        components: result.address_components
      };
    } catch (error) {
      this.logger.error('Reverse geocoding failed:', error);
      throw new BadRequestException('Failed to reverse geocode coordinates');
    }
  }

  async calculateRoute(calculateRouteDto: CalculateRouteDto): Promise<any> {
    try {
      const waypoints = calculateRouteDto.waypoints?.map(wp => 
        `${wp.lat},${wp.lng}`
      ) || [];

      const request: DirectionsRequest = {
        params: {
          origin: `${calculateRouteDto.origin.lat},${calculateRouteDto.origin.lng}`,
          destination: `${calculateRouteDto.destination.lat},${calculateRouteDto.destination.lng}`,
          waypoints: waypoints.length > 0 ? waypoints : undefined,
          mode: calculateRouteDto.mode || 'driving',
          departure_time: calculateRouteDto.departure_time,
          key: this.configService.get('GOOGLE_MAPS_API_KEY')
        }
      };

      const response: DirectionsResponse = await this.googleMapsClient.directions(request);
      
      if (response.data.status !== 'OK' || response.data.routes.length === 0) {
        throw new BadRequestException('Route calculation failed');
      }

      const route = response.data.routes[0];
      const leg = route.legs[0];

      return {
        distance: leg.distance,
        duration: leg.duration,
        duration_in_traffic: leg.duration_in_traffic,
        start_address: leg.start_address,
        end_address: leg.end_address,
        polyline: route.overview_polyline.points,
        steps: leg.steps.map(step => ({
          distance: step.distance,
          duration: step.duration,
          instruction: step.html_instructions,
          start_location: step.start_location,
          end_location: step.end_location
        }))
      };
    } catch (error) {
      this.logger.error('Route calculation failed:', error);
      throw new BadRequestException('Failed to calculate route');
    }
  }

  async optimizeWaypoints(optimizeWaypointsDto: OptimizeWaypointsDto): Promise<any> {
    try {
      // For waypoint optimization, we'll use the Directions API with waypoints
      // Google Maps automatically optimizes the route when multiple waypoints are provided
      const waypoints = optimizeWaypointsDto.locations.map(loc => 
        `${loc.lat},${loc.lng}`
      );

      const request: DirectionsRequest = {
        params: {
          origin: `${optimizeWaypointsDto.start_location.lat},${optimizeWaypointsDto.start_location.lng}`,
          destination: `${optimizeWaypointsDto.end_location.lat},${optimizeWaypointsDto.end_location.lng}`,
          waypoints: waypoints,
          optimize: true,
          mode: 'driving',
          key: this.configService.get('GOOGLE_MAPS_API_KEY')
        }
      };

      const response: DirectionsResponse = await this.googleMapsClient.directions(request);
      
      if (response.data.status !== 'OK' || response.data.routes.length === 0) {
        throw new BadRequestException('Waypoint optimization failed');
      }

      const route = response.data.routes[0];
      
      return {
        optimized_order: route.waypoint_order,
        total_distance: route.legs.reduce((sum, leg) => sum + leg.distance.value, 0),
        total_duration: route.legs.reduce((sum, leg) => sum + leg.duration.value, 0),
        polyline: route.overview_polyline.points,
        optimized_waypoints: route.waypoint_order.map(index => 
          optimizeWaypointsDto.locations[index]
        )
      };
    } catch (error) {
      this.logger.error('Waypoint optimization failed:', error);
      throw new BadRequestException('Failed to optimize waypoints');
    }
  }

  async findNearby(findNearbyDto: FindNearbyDto): Promise<any> {
    try {
      // Using Places API for nearby search
      // Note: This is a simplified implementation
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${findNearbyDto.location.lat},${findNearbyDto.location.lng}&` +
        `radius=${findNearbyDto.radius}&` +
        `type=${findNearbyDto.type || 'point_of_interest'}&` +
        `key=${this.configService.get('GOOGLE_MAPS_API_KEY')}`
      );

      const data = await response.json();
      
      if (data.status !== 'OK') {
        throw new BadRequestException('Nearby search failed');
      }

      return data.results.map(place => ({
        name: place.name,
        address: place.vicinity,
        location: place.geometry.location,
        place_id: place.place_id,
        rating: place.rating,
        types: place.types
      }));
    } catch (error) {
      this.logger.error('Nearby search failed:', error);
      throw new BadRequestException('Failed to find nearby places');
    }
  }

  async getStaticMap(center: { lat: number; lng: number }, zoom: number = 15): Promise<string> {
    const apiKey = this.configService.get('GOOGLE_MAPS_API_KEY');
    return `https://maps.googleapis.com/maps/api/staticmap?` +
           `center=${center.lat},${center.lng}&` +
           `zoom=${zoom}&` +
           `size=600x400&` +
           `maptype=roadmap&` +
           `key=${apiKey}`;
  }

  async validateCoordinates(lat: number, lng: number): Promise<boolean> {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }
}