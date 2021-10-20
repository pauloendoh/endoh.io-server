import { Response } from "express";
import { Resource } from "express-automatic-routes";
import authMiddleware from "../../../../middlewares/authMiddleware";
import { getUserSuggestionRepo } from "../../../../repositories/feed/UserSuggestionRepository";
import { MyErrorsResponse } from "../../../../utils/ErrorMessage";
import { MyAuthRequest } from "../../../../utils/MyAuthRequest";
import { myConsoleError } from "../../../../utils/myConsoleError";

export default function myUserSuggestionsRoute() {
  return <Resource>{
    get: {
      middleware: authMiddleware,
      handler: async (req: MyAuthRequest, res: Response) => {
        try {
          const userSuggestions =
            await getUserSuggestionRepo().findUserSuggestions(req.user);

          return res.json(userSuggestions);
        } catch (err) {
          myConsoleError(err.message);
          return res.status(400).json(new MyErrorsResponse(err.message));
        }
      },
    },
  };
}
