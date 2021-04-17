const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (req, res) => {
    if (!req.payload.name) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(500);
        return response;
    }
    if (req.payload.readPage > req.payload.pageCount) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(500);
        return response;
    }
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (req.payload.readPage == req.payload.pageCount);
    const newBook = {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        id,
        finished,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = res.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }
    const response = res.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBookHandler = (req, res) => {
    const { name, reading, finished } = req.query;

    if (name) {
        // const bookClone = [...books];
        const bookSearch = books.filter(
            (n) => n.name.toLowerCase().indexOf(name.toLowerCase()) > -1,
        );
        return {
            status: 'success',
            data: {
                books: bookSearch.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        };
    }

    if (reading) {
        if (reading == 0) {
            const bookReadingFalse = books.filter((n) => n.reading === false);
            return {
                status: 'success',
                data: {
                    books: bookReadingFalse.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            };
        } if (reading == 1) {
            const bookReadingTrue = books.filter((n) => n.reading === true);
            return {
                status: 'success',
                data: {
                    books: bookReadingTrue.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            };
        }
        return {
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        };
    }

    if (finished) {
        if (finished == 0) {
            const bookFinishFalse = books.filter((n) => n.finished === false);
            return {
                status: 'success',
                data: {
                    books: bookFinishFalse.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            };
        } if (finished == 1) {
            const bookFinishTrue = books.filter((n) => n.finished === true);
            return {
                status: 'success',
                data: {
                    books: bookFinishTrue.map((book) => ({
                        id: book.id,
                        name: book.name,
                        publisher: book.publisher,
                    })),
                },
            };
        }
        return {
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        };
    }

    if (!name || !reading || !finished) {
        return {
            status: 'success',
            data: {
                books: books.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        };
    }

    const response = res.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const getBookByIdHandler = (req, res) => {
    const { id } = req.params;

    const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book,
            },
        };
    }

    const response = res.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (req, res) => {
    const { id } = req.params;
    if (!req.payload.name) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(500);
        return response;
    }
    if (req.payload.readPage > req.payload.pageCount) {
        const response = res.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(500);
        return response;
    }
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = req.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            publisher,
            summary,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };
        const response = res.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response = res.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBookByIdHandler = (req, res) => {
    const { id } = req.params;
    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        books.splice(index, 1);
        const response = res.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = res.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBookHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler,
};
