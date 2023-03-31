import sequelize from "../db.js";
import { DataTypes } from "sequelize";


const ExperiencesModel = sequelize.define("experience",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        role: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        company: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        area: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        image: {
            type: DataTypes.STRING(1000),
            allowNull: false
        }
    })

export default ExperiencesModel