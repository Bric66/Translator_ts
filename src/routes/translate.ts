import express from "express";
const router = express.Router();
import { TranslationGateway } from "../gateways/translationGateway";
import { authorization } from "../middlewares/authorizationMiddleware";
import {
  InMemoryTranslationStorage,
  Translation,
} from "../storage/InMemoryTranslationStorage";
import { AuthentifiedRequest } from "../types/AuthentifiedRequest";

router.use(authorization);
const inMemoryTranslationStorage = new InMemoryTranslationStorage();
const translationGateway = new TranslationGateway(inMemoryTranslationStorage);

router.post("/", async (req: AuthentifiedRequest, res) => {
  try {
    const body = {
      text: req.body.text,
      language: req.body.language,
    };
    const idUser = req.user.userId;
    const isAlreadyTranslated = await translationGateway.search(
      idUser,
      body.text
    );
    if (isAlreadyTranslated) {
      return res.send({
        translatedText: isAlreadyTranslated.translation,
      });
    }

    const translatedText = await translationGateway.translate(
      body.text,
      body.language
    );

    const savedTranslation: Translation = {
      originalText: body.text,
      translation: translatedText,
      language: body.language,
    };

    const hasAlreadySavedTranslation = inMemoryTranslationStorage.getByUserId(
      req.user.userId
    );
    if (hasAlreadySavedTranslation) {
      hasAlreadySavedTranslation.push(savedTranslation);
      inMemoryTranslationStorage.save(
        req.user.userId,
        hasAlreadySavedTranslation
      );
    } else {
      inMemoryTranslationStorage.save(req.user.userId, [savedTranslation]);
    }
    return res.send({
      originalText: body.text,
      translation: translatedText,
      language: body.language,
    });
  } catch (error) {
    console.log(error.response.data.error.details[0].fieldViolations);
    return res.sendStatus(400);
  }
});

export default router;
