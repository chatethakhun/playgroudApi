import { Router } from "express";
import { subassembliesBom } from "../controllers/subassemblyController.js";

const subassembliesRouter = Router();
subassembliesRouter.get("/:id/bom", subassembliesBom);
export default subassembliesRouter;
