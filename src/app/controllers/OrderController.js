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
        (requestProduct) => requestProduct.id == product.id)

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
        id: request.id,
        name: request.name
      },
      products: editedProducts
    }

    return response.status(201).json(order)
  }
}

export default new OrderController()
