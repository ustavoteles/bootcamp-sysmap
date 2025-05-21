import Achievement from "./Achievement";

export default interface User {
  token: string;
  id: string;
  name: string;
  email: string;
  cpf: string;
  avatar: string;
  xp: number;
  level: number;
  achievements: Achievement[];
}
