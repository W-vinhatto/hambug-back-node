import  Sequelize  from "sequelize";
import confiDataBase from '../config/database'
import User from '../app/models/User'


const models = [User ]


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