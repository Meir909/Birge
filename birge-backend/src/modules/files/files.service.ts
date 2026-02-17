import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { UploadFileDto, ResizeImageDto, GenerateThumbnailDto } from '../dto/file.dto';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly uploadDir: string;
  private readonly maxFileSize: number;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
    this.maxFileSize = this.configService.get('MAX_FILE_SIZE') || 10 * 1024 * 1024; // 10MB
    
    // Ensure upload directory exists
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, uploadFileDto: UploadFileDto): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File too large. Maximum size is ${this.maxFileSize / 1024 / 1024}MB`);
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
    
    // Create folder structure
    const folder = uploadFileDto.folder || 'general';
    const folderPath = join(this.uploadDir, folder);
    
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
    }

    const filePath = join(folderPath, fileName);
    
    // Save file
    const writeStream = createWriteStream(filePath);
    writeStream.write(file.buffer);
    writeStream.end();

    // Return file info
    const fileUrl = `${this.configService.get('BASE_URL') || 'http://localhost:3000'}/files/${folder}/${fileName}`;
    
    return {
      id: fileName,
      url: fileUrl,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      folder: folder,
      type: uploadFileDto.type,
      uploaded_at: new Date()
    };
  }

  async getFileStream(folder: string, filename: string): Promise<any> {
    const filePath = join(this.uploadDir, folder, filename);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    return createReadStream(filePath);
  }

  async deleteFile(folder: string, filename: string): Promise<void> {
    const filePath = join(this.uploadDir, folder, filename);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    // In a real implementation, you would use fs.unlink to delete the file
    // For now, we'll just log the action
    this.logger.log(`File marked for deletion: ${filePath}`);
  }

  async getFileInfo(folder: string, filename: string): Promise<any> {
    const filePath = join(this.uploadDir, folder, filename);
    
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    // In a real implementation, you would get actual file stats
    // For now, return basic info
    return {
      filename: filename,
      folder: folder,
      path: filePath,
      url: `${this.configService.get('BASE_URL') || 'http://localhost:3000'}/files/${folder}/${filename}`
    };
  }

  async resizeImage(resizeImageDto: ResizeImageDto): Promise<any> {
    // In a real implementation, you would use sharp or similar library
    // to resize the image
    this.logger.log(`Resizing image: ${resizeImageDto.file_key}`);
    
    return {
      message: 'Image resize functionality not implemented in demo version',
      original_file: resizeImageDto.file_key,
      width: resizeImageDto.width,
      height: resizeImageDto.height,
      fit: resizeImageDto.fit
    };
  }

  async generateThumbnail(generateThumbnailDto: GenerateThumbnailDto): Promise<any> {
    // In a real implementation, you would use sharp or similar library
    // to generate a thumbnail
    this.logger.log(`Generating thumbnail for: ${generateThumbnailDto.file_key}`);
    
    return {
      message: 'Thumbnail generation functionality not implemented in demo version',
      original_file: generateThumbnailDto.file_key,
      thumbnail_url: null,
      width: generateThumbnailDto.width,
      height: generateThumbnailDto.height
    };
  }

  async getFolderContents(folder: string): Promise<any[]> {
    const folderPath = join(this.uploadDir, folder);
    
    if (!existsSync(folderPath)) {
      return [];
    }

    // In a real implementation, you would read directory contents
    // and return file information
    return [
      {
        folder: folder,
        files: [],
        message: 'Folder listing functionality not implemented in demo version'
      }
    ];
  }

  async uploadMultipleFiles(files: Express.Multer.File[], metadata: any[]): Promise<any[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const meta = metadata[i] || {};
      
      const fileDto: UploadFileDto = {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        folder: meta.folder,
        type: meta.type
      };

      const result = await this.uploadFile(file, fileDto);
      results.push(result);
    }

    return results;
  }
}