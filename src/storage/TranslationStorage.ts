export const db = new Map();
export type SavedTranslation = {
  originalText: string;
  translation: string;
  language: string;
};

export class TranslationStorage {
  save(
    userId: string,
    savedTranslation: SavedTranslation | SavedTranslation[]
  ) {
    db.set(userId, savedTranslation);
  }

  getByUserId(userId: string) {
    return db.get(userId);
  }
}
