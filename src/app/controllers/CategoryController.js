import * as Yup from 'yup'
import Category from '../models/Category'
import User from '../models/User'

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

    // validação de usuario - caso não seja adm não pode segui com criação
    const { admin: isAdmin } = await User.findByPk(request.userId)
    if (!isAdmin) {
      return response.status(400).json()
    }

    const { name } = request.body

    const categoryExists = await Category.findOne({
      where: { name }
    })
    if (categoryExists) {
      return response.status(400).json({ error: 'category alreandy exists' })
    }

    const path = request.file.filename

    const { id } = await Category.create({ name, path })

    return response.json({ name, id })
  }

  async index (request, response) {
    const category = await Category.findAll()

    return response.status(200).json(category)
  }

  async update (request, response) {
    const schema = Yup.object().shape({
      name: Yup.string()
    })
    // validando dados recebidos se estão de acordos com solicitado pela schema
    try {
      await schema.validateSync(request.body)
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    // validação de usuario - caso não seja adm não pode segui com criação
    const { admin: isAdmin } = await User.findByPk(request.userId)
    if (!isAdmin) {
      return response.status(400).json()
    }

    const { name } = request.body
    const { id } = request.params

    const categoryExists = await Category.findByPk(id)
    if (!categoryExists) {
      return response
        .status(400)
        .json({ error: 'Make sure category id is corret' })
    }

    let path
    if (request.file) {
      path = request.file.filename
    }

    await Category.update({ name, path },
      { where: { id } }
    )

    return response.status(200).json()
  }
}

export default new CategoryController()
