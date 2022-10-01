import {
  Delete,
  JsonController,
  Param,
  Req,
  UseBefore,
} from "routing-controllers";
import { MyAuthMiddleware } from "../../middlewares/MyAuthMiddleware";
import { MyAuthRequest } from "../../utils/MyAuthRequest";
import { DocService } from "./DocService";

@JsonController()
export class DocController {
  constructor(private docService = new DocService()) {}

  @Delete("/docs/:docId")
  deleteDoc(
    @UseBefore(MyAuthMiddleware)
    @Req()
    req: MyAuthRequest,
    @Param("docId") docId: number
  ) {
    return this.docService.deleteDoc(docId, req.user.id);
  }
}
