import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Trofeu from "@/assets/images/trofeu.svg";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

function AchievementLevelCard() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Card>
        <CardContent className="w-[53vh] h-[20vh] bg-white  p-8">
          <div className="flex flex-row mx-auto w-full justify-between">
            <div className="flex flex-col text-black">
              <p className="font-semibold">Seu nível é</p>
              <p className="text-2xl font-bold">{user?.level}</p>
            </div>

            <div className="">
              <img src={Trofeu} alt="" />
            </div>
          </div>

          <div className="flex flex-col w-full h-full mt-8  ">
            <div className="flex flex-row justify-between mb-2">
              <p className="text-sm text-gray-500">
                Pontos para o próximo nível
              </p>
              <p className="font-bold">{user?.xp}/50 pts</p>
            </div>
            <Progress value={user?.xp} className="w-full" />
          </div>
        </CardContent>{" "}
      </Card>
    </div>
  );
}

export default AchievementLevelCard;
