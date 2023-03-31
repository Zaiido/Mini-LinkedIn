import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import ExperiencesModel from "../experiences/model.js";
import PostsModel from "../posts/model.js";

const UsersModel = sequelize.define("user",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        bio: {
            type: DataTypes.STRING(5000),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        area: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    })


UsersModel.hasMany(ExperiencesModel)
ExperiencesModel.belongsTo(UsersModel, { foreignKey: { name: "userId", allowNull: false } })

UsersModel.hasMany(PostsModel)
PostsModel.belongsTo(UsersModel, { foreignKey: { name: "userId", allowNull: false } })



export default UsersModel