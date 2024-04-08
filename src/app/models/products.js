import Sequelize, { Model } from 'sequelize'

class Products extends Model {
  static init (sequelize) {
    super.init({
      name: Sequelize.STRING,
      price: Sequelize.INTEGER,
      path: Sequelize.STRING,
      url: {
        type: Sequelize.VIRTUAL,
        get () {
          return `http://localhost:3001/products-file/${this.path}`
        }
      }
    },
    {
      sequelize
    }
    )

    return this
  }

  // informando que campo category pertence ao models (category- tem chave estrangeira e dando novo nome)
  static associate (models) {
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    })
  }
}

export default Products
