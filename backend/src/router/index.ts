import Router from "koa-router"
import convertController from "../controller/convertController"
import healthcheckController from "../controller/healthcheckController"
import rateController from "../controller/rateController"
import ratesController from "../controller/ratesController"
import symbolsController from "../controller/symbolsController"

export const router = new Router()

router.all("(.*)", async (ctx, next) => {
  ctx.status = 404
  ctx.body = "Not found"
  await next()
})

router.post("/convert", convertController)
router.get("/healthcheck", healthcheckController)
router.get("/rate", rateController)
router.get("/rates", ratesController)
router.get("/symbols", symbolsController)
