import express from "express";
const router = express.Router();
import { TranslationGateway } from "../function/translateGateway";
import { authorization } from "../middlewares/authorizationMiddleware";
import {
  SavedTranslation,
  TranslationStorage,
} from "../storage/TranslationStorage";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";

router.use(authorization);

const translationGateway = new TranslationGateway();
const translationStorage = new TranslationStorage();

router.post("/", async (req: AuthentifiedRequest, res) => {
  try {
    const body = {
      text: req.body.text,
      language: req.body.language,
    };
    const idUser = req.user.userId;
    const isAlreadyTranslated = translationGateway.search(idUser, body.text);
    if (isAlreadyTranslated) {
      return res.send({
        translatedText: isAlreadyTranslated.translation,
      });
    }
    const translation = await translationGateway.translate(
      body.text,
      body.language
    );

    const translatedText = translation.data.translations[0].translatedText;

    const savedTranslation: SavedTranslation = {
      originalText: body.text,
      translation: translatedText,
      language: body.language,
    };

    const hasAlreadySavedTranslation = translationStorage.getByUserId(
      req.user.userId
    );
    if (hasAlreadySavedTranslation) {
      hasAlreadySavedTranslation.push(savedTranslation);
      translationStorage.save(req.user.userId, hasAlreadySavedTranslation);
    } else {
      translationStorage.save(req.user.userId, [savedTranslation]);
    }
    return res.send({
      translatedText: translatedText,
    });
  } catch (error) {
    console.log(error.response.data.error.details[0].fieldViolations);
    return res.sendStatus(400);
  }
});

export default router;
