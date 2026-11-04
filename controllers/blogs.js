const router = require('express').Router()
const { Blog } = require('../models')

const blogFinder = async (request, response, next) => {
  request.blog = await Blog.findByPk(request.params.id)
  if (!request.blog) {
    return response.status(404).end()
  }
  next()
}

router.get('/', async (request, response) => {
  const blogs = await Blog.findAll()
  response.json(blogs)
})

router.post('/', async (request, response) => {
  try {
    const blog = await Blog.create(request.body)
    response.json(blog)
  } catch (error) {
    return response.status(400).json({ error })
  }
})

router.get('/:id', blogFinder, (request, response) => {
  response.json(request.blog)
})

router.delete('/:id', blogFinder, async (request, response) => {
  await request.blog.destroy()
  response.status(204).end()
})

router.put('/:id', blogFinder, async (request, response) => {
  request.blog.likes = request.body.likes
  await request.blog.save()
  response.json(request.blog)
})

module.exports = router