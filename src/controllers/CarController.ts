import * as express from "express";
import {
  ApiOperationGet,
  ApiPath,
  SwaggerDefinitionConstant,
} from "swagger-express-ts";

@ApiPath({
  path: "/cars",
  name: "Car",
})
export class CarController {
  private router: express.Router;

  constructor() {
    this.router = express.Router();
    this.router.get("/cars", this.getCars);
  }

  @ApiOperationGet({
    description: "Get cars list",
    responses: {
      200: {
        type: SwaggerDefinitionConstant.Response.Type.ARRAY,
        model: "Car",
      },
    },
  })
  getCars(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ): void {
    const cars = [
      {
        id: 1,
        name: "BMW",
      },
      {
        id: 2,
        name: "MERCEDES",
      },
    ];
    response.json(cars);
  }

  getRouter(): express.Router {
    return this.router;
  }
}
