import asyncHandler from 'express-async-handler'
import { prisma } from '../prisma.js'

export const createNewExercise = asyncHandler(async (req, res) => {
	const { name, times, iconPath } = req.body

	const exercise = await prisma.exercise.create({
		data: {
			name,
			times,
			iconPath
		}
	})

	res.json(exercise)
})

export const getExercises = asyncHandler(async (req, res) => {
	const exercises = await prisma.exercise.findMany()

	res.json(exercises)
})
