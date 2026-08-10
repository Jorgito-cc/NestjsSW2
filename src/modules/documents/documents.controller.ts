import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { StorageService } from '../storage/storage.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from './entities/documento.entity';

@Controller('files')
export class DocumentsController {
  constructor(
    private readonly storageService: StorageService,
    @InjectRepository(Documento)
    private readonly documentoRepository: Repository<Documento>
  ) {}

  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    try {
      const doc = await this.documentoRepository.findOne({ where: { id } });
      if (!doc) {
        throw new NotFoundException('Documento no encontrado');
      }
      
      const url = await this.storageService.getPresignedUrl(doc.s3_key);
      return res.redirect(url);
    } catch (error) {
      throw new NotFoundException('Archivo no encontrado');
    }
  }
}
