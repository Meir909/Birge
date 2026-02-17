import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto, MarkAsReadDto, GetMessagesDto } from './dto/message.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  @UseGuards(JwtAuthGuard)
  async createMessage(
    @CurrentUser('id') userId: string,
    @Body() createMessageDto: CreateMessageDto
  ) {
    return this.chatService.createMessage(userId, createMessageDto);
  }

  @Get('messages')
  @UseGuards(JwtAuthGuard)
  async getMessages(@Query() getMessagesDto: GetMessagesDto) {
    return this.chatService.getMessages(getMessagesDto);
  }

  @Get('messages/unread')
  @UseGuards(JwtAuthGuard)
  async getUnreadMessages(
    @CurrentUser('id') userId: string,
    @Query('trip_id') tripId?: string
  ) {
    return this.chatService.getUnreadMessages(userId, tripId);
  }

  @Post('messages/:messageId/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(
    @CurrentUser('id') userId: string,
    @Param('messageId') messageId: string,
    @Body() markAsReadDto: MarkAsReadDto
  ) {
    return this.chatService.markAsRead(userId, { message_id: messageId });
  }

  @Post('messages/read-all')
  @UseGuards(JwtAuthGuard)
  async markAllAsRead(
    @CurrentUser('id') userId: string,
    @Body('trip_id') tripId: string
  ) {
    return this.chatService.markAllAsRead(userId, tripId);
  }

  @Delete('messages/:messageId')
  @UseGuards(JwtAuthGuard)
  async deleteMessage(
    @CurrentUser('id') userId: string,
    @Param('messageId') messageId: string
  ) {
    return this.chatService.deleteMessage(userId, messageId);
  }

  @Get('history/:tripId')
  @UseGuards(JwtAuthGuard)
  async getChatHistory(
    @Param('tripId') tripId: string,
    @Query('days') days?: number
  ) {
    return this.chatService.getChatHistory(tripId, days);
  }

  @Get('my-messages')
  @UseGuards(JwtAuthGuard)
  async getUserLastMessages(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: number
  ) {
    return this.chatService.getUserLastMessages(userId, limit);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchMessages(
    @CurrentUser('id') userId: string,
    @Query('q') query: string,
    @Query('trip_id') tripId?: string
  ) {
    return this.chatService.searchMessages(userId, query, tripId);
  }
}