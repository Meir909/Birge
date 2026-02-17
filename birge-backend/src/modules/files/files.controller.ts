import { Controller, Get, Post, Delete, Param, Query, UseGuards, UseInterceptors, UploadedFile, UploadedFiles, Body } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadFileDto, ResizeImageDto, GenerateThumbnailDto } from './dto/file.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
    @CurrentUser('id') userId: string
  ) {
    return this.filesService.uploadFile(file, uploadFileDto);
  }

  @Post('upload-multiple')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() metadata: any[],
    @CurrentUser('id') userId: string
  ) {
    return this.filesService.uploadMultipleFiles(files, metadata);
  }

  @Get(':folder/:filename')
  @UseGuards(JwtAuthGuard)
  async getFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @CurrentUser('id') userId: string
  ) {
    return this.filesService.getFileStream(folder, filename);
  }

  @Get('info/:folder/:filename')
  @UseGuards(JwtAuthGuard)
  async getFileInfo(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @CurrentUser('id') userId: string
  ) {
    return this.filesService.getFileInfo(folder, filename);
  }

  @Delete(':folder/:filename')
  @UseGuards(JwtAuthGuard)
  async deleteFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @CurrentUser('id') userId: string
  ) {
    return this.filesService.deleteFile(folder, filename);
  }

  @Post('resize')
  @UseGuards(JwtAuthGuard)
  async resizeImage(
    @Body() resizeImageDto: ResizeImageDto,
    @CurrentUser('id') userId: string
  ) {
    return this.filesService.resizeImage(resizeImageDto);
  }

  @Post('thumbnail')
  @UseGuards(JwtAuthGuard)
  async generateThumbnail(
    @Body() generateThumbnailDto: GenerateThumbnailDto,
    @CurrentUser('id') userId: string
  ) {
    return this.filesService.generateThumbnail(generateThumbnailDto);
  }

  @Get('folder/:folder')
  @UseGuards(JwtAuthGuard)
  async getFolderContents(
    @Param('folder') folder: string,
    @CurrentUser('id') userId: string
  ) {
    return this.filesService.getFolderContents(folder);
  }
}