import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import path from 'path'

import authRoutes from './app/auth/auth.routes.js'
import usersRoutes from './app/user/user.routes.js'
import exerciseRoutes from './app/exercise/exercise.routes.js'
import { prisma } from './app/prisma.js'
import { errorHandler, notFound } from './app/middleware/error.middleware.js'

dotenv.config()

const app = express()

async function main() {
	/**morgan для логирования запросов с помощью middleware */
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'))
	}

	app.use(express.json())

	const __dirname = path.resolve()

	app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

	app.use('/api/auth', authRoutes)
	app.use('/api/users', usersRoutes)
	app.use('/api/exercises', exerciseRoutes)

	app.use(notFound)
	app.use(errorHandler)

	const PORT = process.env.PORT || 5000

	app.listen(
		PORT,
		console.log(
			`Server is running is ${process.env.NODE_ENV} mode on port ${PORT}`.green
				.bold
		)
	)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
