const { nanoid } = require ('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumsService {
    constructor() {
        this._albums = [];
    }

    addAlbum({ name, year }) {
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const newAlbum = {
            id, name, year, insertedAt, updatedAt,
        };

        this._albums.push(newAlbum);

        const isSuccess = this._albums.filter((album) => album.id === id).length > 0;

        if (!isSuccess) {
            throw new InvariantError('Album gagal ditambahkan');
        }

        return id;
    }

    getAlbumById(id) {
        // return id
        const album = this._albums.find((album) => album.id === id);
        if (!album) {
            throw new NotFoundError('Album tidak ditemukan');
        }
        return album;
    }

    editAlbumById(id, { name, year }) {
        // return id
        const index = this._albums.findIndex((album) => album.id === id)

        if(index === -1){
            throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan')
        }

        const updatedAt = new Date().toISOString()

        this._albums[index] = {
            ...this._albums[index],
            name,
            year,
            updatedAt
        }
    }

    deleteAlbumById(id) {
        const index = this._albums.findIndex((note) => note.id === id)
        if(index === -1){
            throw new NotFoundError('Gagal menghapus catatan. Id tidak ditemukan')
        }
        this._albums.splice(index, 1)
    }
}

module.exports = AlbumsService;