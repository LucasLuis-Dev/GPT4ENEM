"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadAudio = void 0;
const whisperService_1 = require("../services/whisperService");
const gpt3Service_1 = require("../services/gpt3Service");
const ytdl = require('ytdl-core');
const fs = require('fs');
const downloadAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
            .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('[FINISHED_DOWNLOAD]');
            try {
                const transcription = yield (0, whisperService_1.sendAudioToWhisper)(audioPath);
                if (req.originalUrl === `/revisao`) {
                    const revisao = yield (0, gpt3Service_1.sendTranscriptionToGPT)(uid, transcription.text, 'A seguinte video-aula aborda conteúdos relevantes para o ENEM? Por favor, explique estruturando sua resposta em tags html porque sim e que tipo de conteudo é esse ou por que não cai e coloque um h1 inicial com o texto verificação de Cobertura ENEM.');
                    res.status(200).send(revisao);
                }
                else if (req.originalUrl === `/resumo`) {
                    const resumo = yield (0, gpt3Service_1.sendTranscriptionToGPT)(uid, transcription.text, 'Faça uma resumo academico construido em tags html desse video que foi transcrito separando os conteudos em subtopicos e dando um explicação detalhada do que foi abordado');
                    res.status(200).send(resumo);
                }
                else if (req.originalUrl === `/transcricao`) {
                    const transcricao = yield (0, gpt3Service_1.sendTranscriptionToGPT)(uid, transcription.text, 'Faça esse texto ser estruturado tags html respeitando os paragrafos e quebras de linha, coloque como tag h1 no inicio com o texto Sua Transcrição');
                    res.status(200).send(transcricao);
                }
            }
            catch (error) {
                console.error('[ERROR_WHISPER_API]', error);
                res.status(500).json({ error: 'Erro ao enviar o áudio para o Whisper' });
            }
        }))
            .on('error', (err) => {
            console.error('[ERROR_DOWNLOAD]', err);
            res.status(500).json({ error: 'Erro ao baixar o áudio' });
        })
            .pipe(fs.createWriteStream(audioPath));
    }
    catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
exports.downloadAudio = downloadAudio;
