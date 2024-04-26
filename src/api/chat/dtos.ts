import { IJwtUser } from "~/types/user";

export interface IChatMessageDto {
  userId: number;
  content: string;
  conversationId: number;
  createdAt?: Date;
  user?: IJwtUser;
}
