const { response } = require('@hapi/hapi');
class AlbumsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postAlbumsHandler = this.postAlbumsHandler.bind(this);
        this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
        this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
        this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }
    
    async postAlbumsHandler(request, h) {
        try {
            // return this._validator;
            this._validator.validateAlbumPayload(request.payload);
            const { name, year } = request.payload;
            const albumId = await this._service.addAlbum({ name, year });

            const response = h.response({
                status: 'success',
                message: 'Album berhasil ditambahkan',
                data: {
                    "albumId": albumId
                },
            }).code(201);

            return response;

        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
              });
              response.code(400);
              return response;
        }
    }

    async getAlbumByIdHandler(request, h) {
        try {
            const id = request.params;
            const album = await this._service.getAlbumById(id);
            const response = h.response({
                status: 'success',
                data: {
                    "album": album,
                },
            });
            response.code(200);
            return response;
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
              });
              response.code(404);
              return response;
        }
    }

    async putAlbumByIdHandler(request, h) {
        try {
            this._validator.validateAlbumPayload(request.payload);
            const { id } = request.params;
            const { name, year } = request.payload;
            await this._service.editAlbumById(id, { name, year });
            const response = h.response({
                status: 'success',
                message: 'Album berhasil diperbarui',
            });
            response.code(200);
            return response;
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
              });
              response.code(404);
              return response;
        }
    }

    async deleteAlbumByIdHandler(request, h) {
        try {
            const { id } = request.params;
            await this._service.deleteAlbumById(id);
            const response = h.response({
                status: 'success',
                message: 'Album berhasil dihapus',
            });
            response.code(200);
            return response;
        } catch (error) {
            const response = h.response({
                status: 'fail',
                message: error.message,
              });
              response.code(404);
              return response;
        }
    }
}

module.exports = AlbumsHandler;