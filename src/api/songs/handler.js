const { response } = require('@hapi/hapi');
const ClientError = require('../../exceptions/ClientError');
class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongsHandler = this.getSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }
    
    async postSongHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const {title, year, genre, performer, duration = null, albumId = null  } = request.payload;
        const songsId = await this._service.addSong({ title, year, genre, performer, duration, albumId  });

        const response = h.response({
            message: 'Songs berhasil ditambahkan',
            status: 'success',
            data: {
                "songId": songsId
            },
        }).code(201);
        return response;
      }

    async getSongsHandler(request) {
        const { title, performer } = request.query;
        const songs = await this._service.getSongs({ title, performer });
        return {
          status: 'success',
          data: {
            songs,
          },
        };
      }

    async getSongByIdHandler(request, h) {
        const id = request.params;
        const song = await this._service.getSongById(request.params.id);
        const response = h.response({
            status: 'success',
            data: {
                "song": song,
            },
        });
        response.code(200);
        return response;
     }

    async putSongByIdHandler(request, h) {
        this._validator.validateSongPayload(request.payload);
        const { id } = request.params;
        const { title, year, genre, performer, duration, albumId } = request.payload;
        await this._service.editSongById(request.params.id, {title, year, genre, performer, duration, albumId });
        const response = h.response({
            status: 'success',
            message: 'Song berhasil diperbarui',
        });
        response.code(200);
        return response;
      }

    async deleteSongByIdHandler(request, h) {
        const { id } = request.params;
        await this._service.deleteSongById(request.params.id);
        const response = h.response({
            status: 'success',
            message: 'Song berhasil dihapus',
        });
        response.code(200);
        return response;
     }
}

module.exports = SongsHandler;