import Express from "express";
import ExperiencesModel from "./model.js";
import createHttpError from "http-errors";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import UsersModel from "../users/model.js";



const experiencesRouter = Express.Router()



experiencesRouter.post("/:userId/experiences", async (request, response, next) => {
    try {
        const { id } = await ExperiencesModel.create({ ...request.body, userId: request.params.userId })
        response.status(201).send({ id })
    } catch (error) {
        next(error)
    }
})


experiencesRouter.get("/:userId/experiences", async (request, response, next) => {
    try {
        const experiences = await ExperiencesModel.findAll({ where: { userId: request.params.userId }, include: [{ model: UsersModel, attributes: ["name", "surname"] }] })
        response.send(experiences)
    } catch (error) {
        next(error)
    }
})


experiencesRouter.get("/:userId/experiences/:expId", async (request, response, next) => {
    try {
        const experience = await ExperiencesModel.findByPk(request.params.expId)
        if (experience) {
            response.send(experience)
        } else {
            next(createHttpError(404, `Experience with id ${request.params.expId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


experiencesRouter.put("/:userId/experiences/:expId", async (request, response, next) => {
    try {
        const [numberOfUpdatedExperiences, updatedExperiences] = await ExperiencesModel.update(request.body, { where: { id: request.params.expId }, returning: true })
        if (numberOfUpdatedExperiences === 1) {
            response.send(updatedExperiences[0])
        } else {
            next(createHttpError(404, `Experience with id ${request.params.expId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


experiencesRouter.delete("/:userId/experiences/:expId", async (request, response, next) => {
    try {
        const numberOfDeletedExperiences = await ExperiencesModel.destroy({ where: { id: request.params.expId } })
        if (numberOfDeletedExperiences === 1) {
            response.status(204).send()
        } else {
            next(createHttpError(404, `Experience with id ${request.params.expId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "fs0522/linkedin-be/experiences"
        }
    })
}).single('experience')


experiencesRouter.post("/:userId/experiences/:expId/image", cloudinaryUploader, async (request, response, next) => {
    try {
        if (request.file) {
            const [numberOfUpdatedExperiences, updatedExperiences] = await ExperiencesModel.update({ image: request.file.path }, { where: { id: request.params.expId }, returning: true })
            if (numberOfUpdatedExperiences === 1) {
                response.send(updatedExperiences[0])
            } else {
                next(createHttpError(404, `Experience with id ${request.params.expId} was not found!`))
            }
        } else {
            next(createHttpError(400, `Please make sure to upload a file.`))
        }

    } catch (error) {
        next(error)
    }
})


export default experiencesRouter

