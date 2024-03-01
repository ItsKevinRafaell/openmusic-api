const AlbumsDB = ({
    id,
    name,
    year,
    createdAt: created_at,
    updatedAt: updated_at,
}) => {
    return {
        id,
        name,
        year,
        createdAt: created_at,
        updatedAt: updated_at,
    };
}

module.exports = { AlbumsDB };