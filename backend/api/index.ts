import { Router } from "express";
import days from "./days";
import users from "./users";

const router = Router();

router.use("/days", days);
router.use("/users", users);

export default router;
