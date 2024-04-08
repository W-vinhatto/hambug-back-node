import Sequelize, { Model } from 'sequelize'
import Bcrypt from 'bcrypt'

class User extends Model {
  static init (sequelize) {
    super.init({
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL,
      password_hash: Sequelize.STRING,
      admin: Sequelize.BOOLEAN
    },
    {
      sequelize
    })
    // adicionando hassh de senha para segurança da criptografia
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await Bcrypt.hash(user.password, 10)
      }
    })

    return this
  }

  // fazendo verificação se senha enviada pelo body confere com hash de senha
  checkPassword (password) {
    return Bcrypt.compare(password, this.password_hash)
  }
}

export default User
