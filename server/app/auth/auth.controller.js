import asyncHandler from 'express-async-handler'
import { faker } from '@faker-js/faker'
import { prisma } from '../prisma.js'
import { hash, verify } from 'argon2'
import { generateToken } from './generate-token.js'

export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await prisma.user.findUnique({
		where: {
			email
		}
	})

	const isValidPassword = await verify(user.password, password)

	if (user && isValidPassword) {
		const token = generateToken(user.id)
		res.json({ user, token })
	} else {
		res.status(401)
		throw new Error('Email and password are not correct')
	}
})

export const registerUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	//Проверяем юзера в базе данных
	const isHaveUSer = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (isHaveUSer) {
		res.status(400)
		throw new Error('User already exists')
	}

	const user = await prisma.user.create({
		data: {
			email,
			password: await hash(password),
			name: faker.person.fullName()
		},
		select: {
			id: true,
			createdAt: true,
			email: true,
			images: true,
			updatedAt: true,
			name: true
		}
	})

	const token = generateToken(user.id)

	res.json({ user, token })
})
