import Express from "express";
import PostsModel from "./model.js";
import createHttpError from "http-errors";

const postsRouter = Express.Router()


postsRouter.post("/", async (request, response, next) => {
    try {
        const { id } = await PostsModel.create(request.body)
        response.status(201).send({ id })
    } catch (error) {
        next(error)
    }
})


postsRouter.get("/", async (request, response, next) => {
    try {
        const posts = await PostsModel.findAll()
        response.send(posts)
    } catch (error) {
        next(error)
    }
})


postsRouter.get("/:postId", async (request, response, next) => {
    try {
        const post = await PostsModel.findByPk(request.params.postId)
        if (post) {
            response.send(post)
        } else {
            next(createHttpError(404, `Post with id ${request.params.postId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


postsRouter.put("/:postId", async (request, response, next) => {
    try {
        const [numberOfUpdatedPosts, updatedPosts] = await PostsModel.update(request.body, { where: { id: request.params.postId }, returning: true })
        if (numberOfUpdatedPosts === 1) {
            response.send(updatedPosts[0])
        } else {
            next(createHttpError(404, `Post with id ${request.params.postId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})


postsRouter.delete("/:postId", async (request, response, next) => {
    try {
        const numberOfDeletedPosts = await PostsModel.destroy({ where: { id: request.params.postId } })
        if (numberOfDeletedPosts === 1) {
            response.status(204).send()
        } else {
            next(createHttpError(404, `Post with id ${request.params.postId} was not found!`))
        }
    } catch (error) {
        next(error)
    }
})



export default postsRouter