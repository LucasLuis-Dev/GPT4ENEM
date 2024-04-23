import { Request, Response } from 'express';
import { downloadAudioAndProcess } from '../services/downloadService';

export const downloadAudio = async (req: Request, res: Response) => {
    try {
        await downloadAudioAndProcess(req, res);
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};