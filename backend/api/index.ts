import { Router } from "express";
const router = Router();

router.use("/users", require("./users"));
router.use("/recipes", require("./recipes"));
router.use("/days", require("./days"));

module.exports = router;
