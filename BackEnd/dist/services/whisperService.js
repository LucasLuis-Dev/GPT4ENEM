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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAudioToWhisper = void 0;
const fs_1 = __importDefault(require("fs"));
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPEN_AI_KEY
});
const sendAudioToWhisper = (audioPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const audioData = fs_1.default.readFileSync(audioPath);
        const transcription = yield openai.audio.transcriptions.create({
            file: fs_1.default.createReadStream(audioPath),
            model: 'whisper-1'
        });
        console.log('Resposta da API do Whisper:', transcription);
        fs_1.default.unlinkSync(audioPath);
        return transcription;
    }
    catch (error) {
        console.error('[ERROR_WHISPER_API]', error);
        throw new Error('Erro ao enviar o áudio para o Whisper');
    }
});
exports.sendAudioToWhisper = sendAudioToWhisper;
