const { nanoid } = require ('nanoid');

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
            throw new Error('Album gagal ditambahkan');
        }

        return id;
    }

    getAlbumById(id) {
        const album = this._albums.filter((n) => n.id === id)[0];
        if (!album) {
            throw new Error('Album tidak ditemukan');
        }
        return album;
    }

    editAlbumById(id, { name, year }) {
        const index = this.albums.findIndex((note) => note.id === id)

        if(index === -1){
            throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan')
        }

        const updatedAt = new Date().toISOString()

        this.albums[index] = {
            ...this.albums[index],
            name,
            year,
            updatedAt
        }
    }

    deleteAlbumById(id) {
        const index = this.albums.findIndex((note) => note.id === id)
        if(index === -1){
            throw new NotFoundError('Gagal menghapus catatan. Id tidak ditemukan')
        }
        this.albums.splice(index, 1)
    }
}

module.exports = AlbumsService;