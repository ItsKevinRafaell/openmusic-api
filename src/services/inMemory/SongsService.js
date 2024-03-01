const { nanoid } = require ('nanoid');
const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistSongDB } = require('../../utils/PlaylistSongSDB');

class SongsService {
    constructor() {
        this._songs = [];
    }

    addSong({ title, year, genre, performer, duration, albumdId }) {
        const id = nanoid(16);
        const insertedAt = new Date().toISOString();
        const updatedAt = insertedAt;

        const newSongs = {
            id, title, year, genre, performer, duration, albumdId, insertedAt, updatedAt,
        };

        this._songs.push(newSongs);

        const isSuccess = this._songs.filter((songs) => songs.id === id).length > 0;

        if (!isSuccess) {
            throw new InvariantError    ('Songs gagal ditambahkan');
        }

        return id;
    }

    getSongs(){
        return this._songs.map(PlaylistSongDB)
    }

    getSongById(id) {
        const songs = this._songs.filter((n) => n.id === id)[0];
        if (!songs) {
            throw new NotFoundError('Songs tidak ditemukan');
        }
        return songs;
    }

    editSongById(id, { title, year, genre, performer, duration, albumdId }) {
        const index = this._songs.findIndex((songs) => songs.id === id)

        if(index === -1){
            throw new NotFoundError('Gagal memperbarui Songs. Id tidak ditemukan')
        }

        const updatedAt = new Date().toISOString()

        this._songs[index] = {
            ...this._songs[index],
            title,
            year,
            genre,
            performer,
            duration,
            albumdId,
            updatedAt
        }
    }

    deleteSongById(id) {
        const index = this._songs.findIndex((songs) => songs.id === id)
        if(index === -1){
            throw new NotFoundError('Gagal menghapus Songs. Id tidak ditemukan')
        }
        this._songs.splice(index, 1)
    }
}

module.exports = SongsService;