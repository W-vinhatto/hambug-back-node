import Sequelize from 'sequelize'
import confiDataBase from '../config/database'
import User from '../app/models/User'
import Products from '../app/models/products'
import Category from '../app/models/Category'

const models = [User, Products, Category]

class Database {
  constructor () {
    this.init()
  }

  init () {
    this.connection = new Sequelize(confiDataBase)
    models
      .map((model) => model.init(this.connection))
    // alem da conexaõ individual - caso haja um associate ele faz a conexão de models
      .map(
        (model) => model.associate && model.associate(this.connection.models))
  }
}

export default new Database()
