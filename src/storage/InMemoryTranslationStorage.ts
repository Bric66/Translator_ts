export const db = new Map();
export type SavedTranslation = {
  originalText: string;
  translation: string;
  language: string;
};

export class InMemoryTranslationStorage {
  save(userId: string, savedTranslation: SavedTranslation[]) {
    db.set(userId, savedTranslation);
  }

  getByUserId(userId: string) {
    return db.get(userId);
  }
}
