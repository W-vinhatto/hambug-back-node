import  Sequelize  from "sequelize";
import confiDataBase from '../config/database'
import User from '../app/models/User'
import Products from "../app/models/products"
import Category from '../app/models/Category'


const models = [User, Products, Category ]


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