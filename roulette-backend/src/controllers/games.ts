import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateWinner = async (req: Request, res: Response) => {
    try {
        const { userId, betNumber, money } = req.body; // Apostador, número y dinero
        if (!userId || !betNumber || !money) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        if (betNumber < 1 || betNumber > 37) {
            return res.status(400).json({ error: 'Bet number must be between 1 and 37' });
        }

        // Obtener el usuario de la base de datos
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verificar si el usuario tiene suficiente dinero para jugar
        if (user.money < money) {
            return res.status(400).json({ error: 'Insufficient funds to place the bet' });
        }

        const winningNumber = Math.floor(Math.random() * 37); // Genera un número entre 0 y 36
        let updatedMoney;

        if (betNumber === winningNumber) {
            // Si gana, se le duplica la apuesta y se suma al dinero actual
            updatedMoney = user.money + money * 2;
        } else {
            // Si pierde, se le resta el dinero apostado
            updatedMoney = user.money - money;
        }

        // Actualizar el campo money del usuario en la base de datos
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { money: updatedMoney },
        });

        res.json({ winningNumber, updatedMoney: updatedUser.money });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing the bet' });
    }
};


export const simulateRace = async (req: Request, res: Response) => {
    try {
        const { userId, betHorse, money } = req.body; // Apostador, número de caballo y dinero
        if (!userId || !betHorse || !money) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        if (betHorse < 1 || betHorse > 4) {
            return res.status(400).json({ error: 'Bet horse number must be between 1 and 4' });
        }

        // Obtener el usuario de la base de datos
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verificar si el usuario tiene suficiente dinero para apostar
        if (user.money < money) {
            return res.status(400).json({ error: 'Insufficient funds to place the bet' });
        }

        // Simular la carrera seleccionando un caballo ganador al azar
        const winningHorse = Math.floor(Math.random() * 4) + 1; // Caballos de 1 a 4
        let updatedMoney;

        if (betHorse === winningHorse) {
            // Si gana, se le duplica la apuesta y se suma al dinero actual
            updatedMoney = user.money + money * 2;
        } else {
            // Si pierde, se le resta el dinero apostado
            updatedMoney = user.money - money;
        }

        // Actualizar el campo money del usuario en la base de datos
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { money: updatedMoney },
        });

        // Responder con el caballo ganador y el nuevo saldo del usuario
        res.json({ winningHorse, updatedMoney: updatedUser.money });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing the bet' });
    }
};