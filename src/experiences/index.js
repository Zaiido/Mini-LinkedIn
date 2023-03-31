import Express from "express";
import ExperiencesModel from "./model.js";
import createHttpError from "http-errors";

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
        const experiences = await ExperiencesModel.findAll({ where: { userId: request.params.userId } })
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



export default experiencesRouter

