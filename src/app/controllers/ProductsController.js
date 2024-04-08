import * as Yup from 'yup'
import Products from '../models/products'
import Category from '../models/Category'

class ProductsController {
  async store (request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required()
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { filename: path } = request.file
    const { name, price, category_id } = request.body

    const products = await Products.create({
      name,
      price,
      category_id,
      path
    })
    return response.json({ products })
  }

  async index (request, response) {
    const products = await Products.findAll({
      // quando feito busca das categorias
      // está pedindo para incluir informações vindas do model listado
      include: {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }
    })

    return response.status(200).json(products)
  }
}

export default new ProductsController()
