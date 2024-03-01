require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumValidator = require('./validator/albums');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');
const songs = require('./api/songs');
const ClientError = require('./exceptions/ClientError');
 
const init = async () => {
    const albumsService = new AlbumsService();
    const songsService = new SongsService();
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        debug: {
            request: ['error'],
        },
        routes: {
            cors: {
            origin: ['*'],
            },
        },
        });

    await server.register([
       {
        plugin: albums,
        options: {
            service: albumsService,
            validator: AlbumValidator,
        },
       },
       {
        plugin: songs,
        options: {
            service: songsService,
            validator: SongsValidator,
        },
       }
    ]);

    server.ext('onPreResponse', (request, h) => {
      // response dari request
      const { response } = request;
      if (response instanceof Error) {
        // client error internal
        if (response instanceof ClientError) {
          const newResponse = h.response({
            status: 'fail',
            message: response.message,
          });
          newResponse.code(response.statusCode);
          return newResponse;
        }
        // client error oleh hapi
        if (!response.isServer) {
          return h.continue;
        }
        // server error
        const newResponse = h.response({
          status: 'error',
          message: 'terjadi kegagalan pada server kami',
        });
        newResponse.code(500);
        return newResponse;
      }
      // tidak error
      return h.continue;
    });
  

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();