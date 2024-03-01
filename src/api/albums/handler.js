const { response } = require('@hapi/hapi');
const ClientError = require('../../exceptions/ClientError');
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
    }

    async getAlbumByIdHandler(request, h) {
        const id = request.params.id;
        const album = await this._service.getAlbumById(id);
        const songs = await this._service.getSongsInAlbum(id);
        const albumWithSongs = { ...album, songs };
        const response = h.response({
            status: 'success',
            data: {
                "album": albumWithSongs,
            },
        });
        response.code(200);
        return response;
    }

    async putAlbumByIdHandler(request, h) {
        this._validator.validateAlbumPayload(request.payload);
        const { id } = request.params.id;
        const { name, year } = request.payload;
        const data = await this._service.editAlbumById(request.params.id, { name, year });
        return {
            status: 'success',
            message: 'Catatan berhasil diperbarui',
            data: {
                albumId: data,
            },
        };
    }

    async deleteAlbumByIdHandler(request, h) {
        const { id } = request.params;
        await this._service.deleteAlbumById(request.params.id);
        const response = h.response({
            status: 'success',
            message: 'Album berhasil dihapus',
        });
        response.code(200);
        return response;
    }
}

module.exports = AlbumsHandler;