import Express from "express";
import PostsModel from "./model.js";
import createHttpError from "http-errors";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";


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


const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "fs0522/linkedin-be/posts"
        }
    })
}).single('post')


postsRouter.post("/:postId/image", cloudinaryUploader, async (request, response, next) => {
    try {
        if (request.file) {
            const [numberOfUpdatedPosts, updatedPosts] = await PostsModel.update({ image: request.file.path }, { where: { id: request.params.postId }, returning: true })
            if (numberOfUpdatedPosts === 1) {
                response.send(updatedPosts[0])
            } else {
                next(createHttpError(404, `Post with id ${request.params.postId} was not found!`))
            }
        } else {
            next(createHttpError(400, `Please make sure to upload a file.`))
        }

    } catch (error) {
        next(error)
    }
})


export default postsRouter