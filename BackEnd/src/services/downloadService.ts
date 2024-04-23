import { Request, Response } from 'express';
import { sendAudioToWhisper } from './whisperService';
import { sendTranscriptionToGPT } from './gpt3Service';
const ytdl = require('ytdl-core');
const fs = require('fs');

export const downloadAudioAndProcess = async (req: Request, res: Response) => {
    const { uid, videoId } = req.body; 

    if (!uid || !videoId) {
        return res.status(400).json({ error: 'UID do usuário ou URL do vídeo não fornecidos' });
    }

    const videoURL = `https://youtube.com/watch?v=${videoId}`;
    console.log('[START_DOWNLOAD] ', videoURL);

    const audioFileName = 'audio.mp3';
    const audioPath = `./${audioFileName}`;

    ytdl(videoURL, {
        quality: 'lowestaudio',
        filter: 'audioonly',
        format: 'mp3'
    })
    .on('end', async () => {
        console.log('[FINISHED_DOWNLOAD]');
        try {
            const transcription = await sendAudioToWhisper(audioPath);
            let response;
            if (req.originalUrl === `/revisao`) {
                response = await sendTranscriptionToGPT(uid, transcription.text, 'A seguinte video-aula aborda conteúdos relevantes para o ENEM? Por favor, explique estruturando sua resposta em tags html porque sim e que tipo de conteudo é esse ou por que não cai e coloque um h1 inicial com o texto verificação de Cobertura ENEM.');
            } else if (req.originalUrl === `/resumo`) {
                response = await sendTranscriptionToGPT(uid, transcription.text, 'Faça uma resumo academico construido em tags html desse video que foi transcrito separando os conteudos em subtopicos e dando um explicação detalhada do que foi abordado');
            } else if(req.originalUrl === `/transcricao`) {
                response = await sendTranscriptionToGPT(uid, transcription.text, 'Faça esse texto ser estruturado tags html respeitando os paragrafos e quebras de linha, coloque como tag h1 no inicio com o texto Sua Transcrição');
            }
            res.status(200).send(response);
        } catch (error) {
            console.error('[ERROR_WHISPER_API]', error);
            res.status(500).json({ error: 'Erro ao enviar o áudio para o Whisper' });
        }
    })
    .on('error', (err: Error) => {
        console.error('[ERROR_DOWNLOAD]', err);
        res.status(500).json({ error: 'Erro ao baixar o áudio' });
    })
    .pipe(fs.createWriteStream(audioPath));
};
