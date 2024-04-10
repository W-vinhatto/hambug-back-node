/*
    store  => cadastrar-adicionar
    index  => listar varios
    show   => listar apenas um
    update => atualizar
    delete => deletar
*/
import * as Yup from 'yup'
import Product from '../models/Products'
import Category from '../models/Category'
import Order from '../schemas/Order'
import User from '../models/User'

class OrderController {
  async store (request, response) {
    const schema = Yup.object().shape({
      products: Yup.array().required().of(
        Yup.object().shape({
          id: Yup.number().required(),
          quantity: Yup.number().required()
        }
        )
      )
    })
    // validação de erros que esta sendo feito acima com yup ( dados recebidos tem que está igual acima e chegar corretos)
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response
        .status(400)
        .json({ error: err.errors })
    }

    const productId = request.body.products.map((products) => products.id)

    const updatedProducts = await Product.findAll({
      where: {
        id: productId
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name']
        }
      ]
    })

    const editedProducts = updatedProducts.map(product => {
      const productsIndex = request.body.products.findIndex(
        (requestProduct) => requestProduct.id === product.id)

      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: request.body.products[productsIndex].quantity
      }

      return newProduct
    })

    const order = {
      user: {
        id: request.userId,
        name: request.userName
      },
      products: editedProducts,
      status: 'pedido realizado'
    }

    const orderResponse = await Order.create(order)

    return response.status(201).json(orderResponse)
  }

  async index (request, response) {
    const orders = await Order.find()

    return response.json(orders)
  }

  async update (request, response) {
    const schema = Yup.object().shape({
      status: Yup.string().required()
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { admin: isAdmin } = await User.findByPk(request.userId)
    if (!isAdmin) {
      return response.status(400).json()
    }

    const { id } = request.params
    const { status } = request.body

    try {
      await Order.updateOne({ _id: id }, { status })
    } catch (err) {
      return response.status(400).json({ error: err.message })
    }
    return response.json({ message: 'status atualizado com sucesso' })
  }
}

export default new OrderController()
