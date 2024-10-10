import dotenv from "dotenv";
import { AppError } from "../../core/AppError";
import { HTTP_STATUS_CODE } from "../../constants/constants";
dotenv.config();

const path = "http://localhost:3000/api/v1/word";

export async function getWord() {
    try {
        const wordResponse = await fetch(`${path}/randomWord`);
        if (!wordResponse.ok) {
            throw new AppError(`HTTP error! Status: ${wordResponse.status}`, wordResponse.status);
        }
        const data = await wordResponse.json();
        return data.data.value;
    } catch (err: Error | unknown) {
        throw new AppError(`Error fetching random word: ${err}`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR_500);
    }
}

export async function isCheating(word: string, explanation: string) {
    const sentence = explanation;
    try {
        const cheatingResponse = await fetch(`${path}/sentenceCheat`, {
            /* eslint-disable-next-line */
            body: JSON.stringify({ word: {value: word}, sentence }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
        });

        if (!cheatingResponse.ok) {
            const errorData = await cheatingResponse.json();
            throw new AppError(`HTTP error! Status: ${cheatingResponse.status}. Details: ${JSON.stringify(errorData)}`, cheatingResponse.status);
        }

        const data = await cheatingResponse.json();
        return data.data;
    } catch (err: Error | unknown) {
        throw new AppError(`Error checking cheating: ${err}`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR_500);
    }
}

export async function similarityCheck(word: string, guess: string) {
    try {
        const similarityResponse = await fetch(`${path}/similarity`, {
            body: JSON.stringify({ inputWord: { value: word }, targetWord: { value: guess } }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
        });
        if (!similarityResponse.ok) {
            throw new AppError(`HTTP error! Status: ${similarityResponse.status}`, similarityResponse.status);
        }
        const data = await similarityResponse.json();
        return data.data;
    } catch (err: Error | unknown) {
        throw new AppError(`Error checking similarity: ${err}`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR_500);
    }
}

