const apiKey = process.env.API_KEY;

import axios from "axios";
import { TranslationStorage } from "../interface/TranslationStorage";

export class TranslationGateway {
  translationStorage: TranslationStorage;
  constructor(translationStorage: TranslationStorage) {
    this.translationStorage = translationStorage;
  }

  async translate(text: string, targetlanguage: string): Promise<string> {
    const encodedParams = new URLSearchParams();
    encodedParams.append("q", text);
    encodedParams.append("target", targetlanguage);

    const options = {
      method: "POST",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": `${apiKey}`,
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
      data: encodedParams,
    };

    const response = await axios.request(options);
    return response.data.data.translations[0].translatedText;
  }

  search(userId: string, originalText: string) {
    const translations = this.translationStorage.getByUserId(userId);

    if (translations) {
      const found = translations.find(
        (element) => element.originalText === originalText
      );
      if (found) {
        return found;
      }
    }
  }
}
