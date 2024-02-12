import asyncHandler from 'express-async-handler'
import { prisma } from '../prisma.js'

export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: req.user.id
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

	res.json(user)
})
