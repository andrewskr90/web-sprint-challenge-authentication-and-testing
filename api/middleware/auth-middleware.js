const User = require('../auth/auth-model')

const checkBody = (req, res, next) => {
    const { username, password } = req.body
    if (!username || !password ) {
        const err = {
            status: 400,
            message: 'username and password required'
        }
        next(err)
    }
    next()
}

const checkUser = async (req, res, next) => {
    const error = { status: 404 }
    const userToFilter = req.body.username
    const username = { username: userToFilter }
    try {
        const possibleUser = await User.findBy(username)
        if (possibleUser) {
            error.message = 'username taken'
            next(error)
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    checkBody, 
    checkUser
}