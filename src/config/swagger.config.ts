import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function getSwaggerConfig(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Echoes of Darkness API')
    .setDescription('Backend API for collectible card game Echoes of Darkness')
    .setVersion('1.0')
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error'
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    customSiteTitle: 'Echoes of Darkness Docs'
  });
}
