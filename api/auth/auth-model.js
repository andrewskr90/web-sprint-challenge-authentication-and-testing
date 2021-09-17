const db = require('../../data/dbConfig')

async function findById(id) {
    const user = await db('users').where({ id })
    return user
}

async function add(user) {
    const { username, password } = user
    const [id] = await db('users').insert({ username, password })
    return findById(id)
}

module.exports = {
    findById,
    add
}
