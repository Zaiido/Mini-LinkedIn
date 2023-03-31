import Express from "express";
import PostsModel from "./model.js";

const postsRouter = Express.Router()


postsRouter.post("/", async (request, response, next) => {
    try {

    } catch (error) {
        next(error)
    }
})


postsRouter.get("/", async (request, response, next) => {
    try {

    } catch (error) {
        next(error)
    }
})


postsRouter.get("/", async (request, response, next) => {
    try {

    } catch (error) {
        next(error)
    }
})


postsRouter.put("/", async (request, response, next) => {
    try {

    } catch (error) {
        next(error)
    }
})


postsRouter.delete("/", async (request, response, next) => {
    try {

    } catch (error) {
        next(error)
    }
})



export default postsRouter