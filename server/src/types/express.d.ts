import { JwtPayload } from "../middleware/authMiddleware";

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}
