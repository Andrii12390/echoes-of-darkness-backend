import { User } from "@prisma/client";

export type TCard = {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  type: string;
  lane: string;
  strength: number;
};

export type TSafeUser = Pick<User, 'id' | 'email' | 'username' | 'avatarUrl'>;
