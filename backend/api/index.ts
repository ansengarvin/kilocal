import { Router } from "express";
const router = Router();

router.use("/users", require("./users"));
router.use("/days", require("./days"));

module.exports = router;
