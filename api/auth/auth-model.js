const db = require('../../data/dbConfig')

async function findById(id) {
    const user = await db('users').where({ id })
    return user
}

async function findBy(filter) {
    console.log(filter)
    const filteredUser = await db('users').where(filter)
    return filteredUser
}

async function add(user) {
    const { username, password } = user
    const [id] = await db('users').insert({ username, password })
    return findById(id)
}

module.exports = {
    findById,
    findBy,
    add
}
