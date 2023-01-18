import { Translation } from "../storage/InMemoryTranslationStorage";

export interface TranslationStorage {
  save(userId: string, savedTranslation: Translation[]): void;
  getByUserId(userId: string): Translation[];
}
