import Express from 'express';
import createHttpError from 'http-errors';
import CommentsModel from './model.js';
import UsersModel from '../users/model.js';


const commentsRouter = Express.Router()


commentsRouter.post('/:postId/comments', async (request, response, next) => {
    try {
        const { id } = await CommentsModel.create({ ...request.body, postId: request.params.postId })
        response.status(201).send({ id })
    } catch (error) {
        next(error);
    }
});


commentsRouter.get('/:postId/comments', async (request, response, next) => {
    try {

        const comments = await CommentsModel.findAll({
            where: { postId: request.params.postId },
            include:
                [{ model: UsersModel, attributes: ["name", "surname"] }]
        })
        response.send(comments)
    } catch (error) {
        next(error);
    }
});

commentsRouter.get('/:postId/comments/:commentId', async (request, response, next) => {
    try {

        const comment = await CommentsModel.findByPk(request.params.commentId)
        if (comment) {
            response.send(comment)
        } else {
            next(createHttpError(404, `Comment with id ${request.params.commentId} was not found!`))
        }

    } catch (error) {
        next(error);
    }
});


commentsRouter.put('/:postId/comments/:commentId', async (request, response, next) => {
    try {
        const [numberOfUpdatedComments, updatedComments] = await CommentsModel.update(request.body, { where: { id: request.params.commentId }, returning: true })
        if (numberOfUpdatedComments === 1) {
            response.send(updatedComments[0])
        } else {
            next(createHttpError(404, `Comment with id ${request.params.commentId} was not found!`))
        }
    } catch (error) {
        next(error);
    }
});


commentsRouter.delete('/:postId/comments/:commentId', async (request, response, next) => {
    try {
        const numberOfDeletedComments = await CommentsModel.destroy({ where: { id: request.params.commentId } })
        if (numberOfDeletedComments === 1) {
            response.status(204).send()
        } else {
            next(createHttpError(404, `Comment with id ${request.params.commentId} was not found!`))
        }
    } catch (error) {
        next(error);
    }
});


export default commentsRouter
