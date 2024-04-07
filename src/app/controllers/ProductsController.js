import * as Yup from 'yup'
import Products from '../models/products'


class ProductsController {
    async store(request, response){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category: Yup.string().required()
        })

        try {
            await schema.validateSync(request.body, { abortEarly: false })
        } catch (err) {
            return response.status(400).json({error: err.errors})
        }

        
        const { filename : path } = request.file
        const { name, price, category } = request.body

        const products = await Products.create({
            name,
            price,
            category,
            path
        })
        return response.json({products})
    }

    async index(request, response){
        const products = await Products.findAll()

        return response.status(200).json(products)
    }
}

export default new ProductsController()