import * as Yup from 'yup'
import Category from '../models/Category'

class CategoryController {
  async store (request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required()
    })
    // validando dados recebidos se estão de acordos com solicitado pela schema
    try {
      await schema.validateSync(request.body)
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { name } = request.body

    const categoryExists = await Category.findOne({
      where: { name }
    })
    if (categoryExists) {
      return response.status(400).json({ error: 'category existe' })
    }

    const category = await Category.create({ name })

    return response.json({ category })
  }

  async index (request, response) {
    const category = await Category.findAll()

    return response.status(200).json(category)
  }
}

export default new CategoryController()
