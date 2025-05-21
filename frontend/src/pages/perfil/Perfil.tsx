import ImagePerfil from "@/assets/images/perfil.svg";
import AchievementLevelCard from "@/components/achievements/achievement-level-card/AchievementLevelCard";
import AchievementMedalCard from "@/components/achievements/achievement-medal-card/AchievementMedalCard";
import ActivityGroupedByTypeCard from "@/components/activities/activities-grouped-by-type/ActivityGroupedByTypeCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { AuthContext } from "@/contexts/AuthContext";
import { ChevronDown, Pencil } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router";

function Pefil() {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  return (
    <>
      <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-md">
        <div className="flex justify-end items-end w-full ">
          <Link to="/perfil/editar">
            <Button className="text-gray-500  p-2 bg-gray-50 border-1 rounded-md hover:bg-gray-200 hover:text-gray-700 font-semibold text-md h-13 flex items-center">
              {" "}
              <Pencil />
              Editar Perfil
            </Button>
          </Link>
        </div>
        <div className="flex flex-col items-center justify-center ">
          <img
            src={user?.avatar}
            alt={`Avatar de ${user?.name} `}
            className="w-60"
          />

          <h1 className="mt-4 text-3xl ">{user?.name}</h1>

          <div
            className=" flex flex-row items
        -center justify-center mt-10 gap-4"
          >
            <AchievementLevelCard />
            <AchievementMedalCard />
          </div>
        </div>
      </div>

      <div className="mt-14 h-full w-full items-start justify-start flex flex-col">
        <h1 className="mb-4">Minhas Atividades</h1>
        <Carousel>
          <CarouselContent>
            <CarouselItem className="basis-1/3">
              <ActivityGroupedByTypeCard />
            </CarouselItem>
            <CarouselItem className="basis-1/3">
              {" "}
              <ActivityGroupedByTypeCard />
            </CarouselItem>
            <CarouselItem className="basis-1/3">
              {" "}
              <ActivityGroupedByTypeCard />
            </CarouselItem>
            <CarouselItem className="basis-1/3">
              {" "}
              <ActivityGroupedByTypeCard />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      <div className="mt-14 w-full h-full">
        {" "}
        <h1>Histórico de Atividades</h1>
        <div className="grid grid-cols-4 gap-1 ">
          <ActivityGroupedByTypeCard /> <ActivityGroupedByTypeCard />
          <ActivityGroupedByTypeCard />
          <ActivityGroupedByTypeCard />
          <ActivityGroupedByTypeCard />
          <ActivityGroupedByTypeCard />
          <ActivityGroupedByTypeCard /> <ActivityGroupedByTypeCard />
          <ActivityGroupedByTypeCard />
          <ActivityGroupedByTypeCard />
          <ActivityGroupedByTypeCard />
          <ActivityGroupedByTypeCard />
        </div>
        <div className="flex justify-center">
          <Button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold text-md h-14 flex items-center mt-6">
            Ver mais
            <ChevronDown size={16} />
          </Button>
        </div>
      </div>
    </>
  );
}

export default Pefil;
