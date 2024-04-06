/*
    store  => cadastrar-adicionar
    index  => listar varios
    show   => listar apenas um 
    update => atualizar
    delete => deletar
*/
import { v4 } from "uuid"
import * as Yup from 'yup'


import User from "../models/User"

class UserController {
    async store(request, response) {

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().required().email(),
            password_hash: Yup.string().required().min(6),
            admin: Yup.boolean(),
        })
// validação de erros que esta sendo feito acima com yup ( dados recebidos tem que está igual acima e chegar corretos)      
        try {
            await schema.validateSync(request.body, {abortEarly: false})
        } catch (err) {
            return response
            .status(400)
            .json({ error: err.errors })
        }

        const { name, email, password_hash, admin } = request.body

        const user = await User.create({
            id: v4(),
            name,
            email,
            password_hash,
            admin
        }
        )

        return response.status(201).json({ id: user.id, name, email, admin })
    }
}

export default new UserController()