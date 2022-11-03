import { TranslationStorage } from "../interface/TranslationStorage";

export const db = new Map();
export type Translation = {
  originalText: string;
  translation: string;
  language: string;
};

export class InMemoryTranslationStorage implements TranslationStorage {
  save(userId: string, savedTranslation: Translation[]) {
    db.set(userId, savedTranslation);
  }

  getByUserId(userId: string) {
    return db.get(userId);
  }
}
