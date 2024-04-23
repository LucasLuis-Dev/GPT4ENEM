import { Request, Response } from 'express';
import { downloadAudioAndProcess } from '../services/downloadService';
import { sendAudioToWhisper } from '../services/whisperService';
import { sendTranscriptionToGPT } from '../services/gpt3Service';

// Mock das funções externas
jest.mock('../services/whisperService');
jest.mock('../services/gpt3Service');
jest.mock('ytdl-core');
jest.mock('fs');

describe('downloadAudioAndProcess', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {
            body: {
                uid: 'user123',
                videoId: 'video123'
            },
            originalUrl: '/revisao'
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should return 400 if UID or videoId is not provided', async () => {
        req.body = {};
        await downloadAudioAndProcess(req as Request, res as Response);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should call sendAudioToWhisper and sendTranscriptionToGPT for /revisao route', async () => {
        await downloadAudioAndProcess(req as Request, res as Response);
        expect(sendAudioToWhisper).toHaveBeenCalled();
        expect(sendTranscriptionToGPT).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
