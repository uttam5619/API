import express from 'express'
import applicationRouter from './routes/application.routes.js'

export const app= express()

app.use('/movix',applicationRouter)