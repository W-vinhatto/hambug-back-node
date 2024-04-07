import  Sequelize  from "sequelize";
import confiDataBase from '../config/database'
import User from '../app/models/User'
import Products from "../app/models/products";


const models = [User, Products ]


class Database {
    constructor(){
        this.init()
    }

    init(){
        this.connection = new Sequelize(confiDataBase)
        models.map((model) => model.init(this.connection))
    }
}

export default new Database()