import express, { Router, Request, Response } from 'express';
import { downloadAudio } from '../controllers/downloadController';

const mainRouter = Router();

mainRouter.get('/', (req: Request, res: Response) => {
    res.status(200).end();
});

mainRouter.post('/historico', express.json());

mainRouter.post('/transcricao', express.json(), downloadAudio);

mainRouter.post('/resumo', express.json(), downloadAudio);

mainRouter.post('/revisao', express.json(), downloadAudio);

mainRouter.use((req: Request, res: Response) => {
    res.status(404).end();
});

export default mainRouter;
