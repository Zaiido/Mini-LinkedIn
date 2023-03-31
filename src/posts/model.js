import sequelize from "../db.js";
import { DataTypes } from "sequelize";


const PostsModel = sequelize.define("posts",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        text: {
            type: DataTypes.STRING(5000),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    })

export default PostsModel