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
exports.sendTranscriptionToGPT = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPEN_AI_KEY
});
const sendTranscriptionToGPT = (uid, transcription, promptTemplate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prompt = `${promptTemplate} \n ${transcription}`;
        const response = yield openai.chat.completions.create({
            messages: [{ "role": "user", "content": prompt }],
            model: "gpt-3.5-turbo",
        });
        console.log(response.choices[0]);
        return response.choices[0];
    }
    catch (error) {
        console.error('[ERROR_GPT_API]', error);
        throw new Error('Erro ao enviar a transcrição para o GPT-3.5 Turbo');
    }
});
exports.sendTranscriptionToGPT = sendTranscriptionToGPT;
