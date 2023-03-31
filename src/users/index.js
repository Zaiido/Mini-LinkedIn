import Express from "express";
import UsersModel from "./model.js";
import createHttpError from "http-errors";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import q2s from 'query-to-sequelize'
import ExperiencesModel from "../experiences/model.js";

const usersRouter = Express.Router()

usersRouter.post("/", async (request, response, next) => {
    try {
        const { id } = await UsersModel.create(request.body)
        response.status(201).send({ id })
    } catch (error) {
        next(error)
    }
})


usersRouter.get("/", async (request, response, next) => {
    try {
        const seqQuery = q2s(request.query)
        const { count, rows } = await UsersModel.findAndCountAll({
            where: seqQuery.criteria,
            order: seqQuery.options.sort,
            offset: seqQuery.options.skip,
            limit: seqQuery.options.limit,
            include: [{ model: ExperiencesModel }]
        })

        response.send({
            total: count,
            numberOfPages: Math.ceil(count / seqQuery.options.limit),
            links: seqQuery.links(`${process.env.BE_URL}/users`, count),
            users: rows
        })
    } catch (error) {
        next(error)
    }
})


usersRouter.get("/:userId", async (request, response, next) => {
    try {
        const user = await UsersModel.findByPk(request.params.userId)
        if (user) {
            response.send(user)
        } else {
            next(createHttpError(404, `User with id ${request.params.userId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


usersRouter.put("/:userId", async (request, response, next) => {
    try {
        const [numberOfUpdatedUsers, updatedUsers] = await UsersModel.update(request.body, { where: { id: request.params.userId }, returning: true })
        if (numberOfUpdatedUsers === 1) {
            response.send(updatedUsers[0])
        } else {
            next(createHttpError(404, `User with id ${request.params.userId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


usersRouter.delete("/:userId", async (request, response, next) => {
    try {
        const numberOfDeletedUsers = await UsersModel.destroy({ where: { id: request.params.userId } })
        if (numberOfDeletedUsers === 1) {
            response.status(204).send()
        } else {
            next(createHttpError(404, `User with id ${request.params.userId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "fs0522/linkedin-be/users"
        }
    })
}).single('profile')


usersRouter.post("/:userId/image", cloudinaryUploader, async (request, response, next) => {
    try {
        if (request.file) {
            const [numberOfUpdatedUsers, updatedUsers] = await UsersModel.update({ image: request.file.path }, { where: { id: request.params.userId }, returning: true })
            if (numberOfUpdatedUsers === 1) {
                response.send(updatedUsers[0])
            } else {
                next(createHttpError(404, `User with id ${request.params.userId} was not found!`))
            }
        } else {
            next(createHttpError(400, `Please make sure to upload a file.`))
        }

    } catch (error) {
        next(error)
    }
})



export default usersRouter