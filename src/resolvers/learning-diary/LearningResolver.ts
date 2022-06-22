import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Learning } from "../../entities/learning-diary/Learning";
import { isAuth } from "../../middlewares/typegraphql/isAuth";
import { MyContext } from "../../middlewares/typegraphql/MyContext";
import LearningService from "./LearningService";
import LearningInput from "./types/LearningInput";

@Resolver()
export class LearningResolver {
  constructor(private service = new LearningService()) {}

  @Query(() => [Learning])
  @UseMiddleware(isAuth)
  async learnings(@Ctx() { req }: MyContext) {
    return this.service.findLearningsByUser(req.user.id);
  }

  @Mutation(() => Learning)
  @UseMiddleware(isAuth)
  async addLearning(
    @Arg("input") input: LearningInput,
    @Ctx() { req }: MyContext
  ) {
    return this.service.addLearning(input, req.user.id);
  }

  @Mutation(() => Learning)
  @UseMiddleware(isAuth)
  async updateLearning(
    @Arg("input") input: LearningInput,
    @Ctx() { req }: MyContext
  ) {
    return this.service.updateLearning(input, req.user.id);
  }
}
