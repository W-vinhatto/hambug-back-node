import * as Yup from 'yup'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

class SessionController {
  async store (request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().required().email(),
      password: Yup.string().required(),
      admin: Yup.boolean()
    })

    if (!await schema.isValid(request.body)) {
      return response
        .status(400)
        .json({ error: 'Make sure your password or email are correct' })
    }

    const { email, password } = request.body

    const user = await User.findOne({
      where: { email }
    })

    if (!user) {
      return response
        .status(400)
        .json({ error: 'Make sure your password or email are correct' })
    }

    if (!await user.checkPassword(password)) {
      return response
        .status(401)
        .json({ error: 'Make sure your password or email are correct' })
    }

    return response.status(200).json({
      id: user.id,
      name: user.name,
      email,
      admin: user.admin,
      tokem: jwt.sign(
        { id: user.id },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      )
    })
  }
}

export default new SessionController()
