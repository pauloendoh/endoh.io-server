import {
  Arg,
  Ctx,
  Field,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { isAuth } from "../../../middlewares/typegraphql/isAuth";
import { MyContext } from "../../../middlewares/typegraphql/MyContext";
import SkillHistoryService from "../../../services/SkillHistoryService";
import SkillProgressDto from "../../../types/domain/skillbase/skill-progress/SkillProgressDto";

@ObjectType()
class Month {
  @Field({ nullable: true })
  month: string;
}

@Resolver()
export class SkillProgressResolver {
  @Query(() => [String])
  @UseMiddleware(isAuth)
  async skillProgressMonths(@Ctx() { req }: MyContext) {
    const service = new SkillHistoryService();
    const months = await service.findHistoryMonthsFromUser(req.user.id);

    const monthsArray: Month[] = months.map((month) => ({ month: month }));

    return months;
  }

  @Query(() => [SkillProgressDto])
  @UseMiddleware(isAuth)
  async skillProgresses(
    @Ctx() { req }: MyContext,
    @Arg("fromYearMonth") fromYearMonth: string
  ) {
    if (fromYearMonth?.length !== 10) return [];

    const service = new SkillHistoryService();
    const progresses = await service.findProgressFrom(
      req.user.id,
      fromYearMonth
    );
    return progresses;
  }
}
