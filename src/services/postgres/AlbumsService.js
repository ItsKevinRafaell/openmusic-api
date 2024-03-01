const { nanoid } = require ('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');
const { AlbumsDB } = require('../../utils/AlbumsDB');
const { SongsDB } = require('../../utils/SongSDB');
const { Pool } = require('pg');

class AlbumsService {
    constructor() {
        this._pool = new Pool();
    }

    async addAlbum({ name, year }) {
        const id = nanoid(16);

        const query = {
            text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
            values: [id, name, year],
          };

        // return query
      
        const result = await this._pool.query(query);
    
        if (!result.rows[0].id) {
        throw new InvariantError('Album gagal ditambahkan');
        }
    
        return result.rows[0].id;
    }

    async getAlbumById(id) {
        const query = {
            text: 'SELECT * FROM albums WHERE id = $1',
            values: [id],
          };
          const result = await this._pool.query(query);
      
          if (!result.rows.length) {
            throw new NotFoundError('Album tidak ditemukan');
          }
      
          return result.rows.map(AlbumsDB)[0];
    }

    async editAlbumById(id, { name, year }) {
        const query = {
            text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
            values: [name, year, id],
          };
      
          const result = await this._pool.query(query);
      
          if (!result.rowCount) {
            throw new NotFoundError('Album memperbarui catatan. Id tidak ditemukan');
          }
    }

    async deleteAlbumById(id) {
        const query = {
            text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
            values: [id],
          };
      
          const result = await this._pool.query(query);
      
          if (!result.rowCount) {
            throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
          }
    }

    async getSongsInAlbum(id) {
        const query = {
          text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
          values: [id],
        };
        const result = await this._pool.query(query);
        return result.rows.map(SongsDB);
      }
}

module.exports = AlbumsService;