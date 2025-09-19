import express from "express";

import {} from "../utils/getLocale.js";
import { getTranslates } from "../controllers/i18nController.js";

const localRouters = express.Router();

localRouters.get("/:lng/:ns.json", getTranslates);

export default localRouters;
