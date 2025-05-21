import { CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AuthContext } from "@/contexts/AuthContext";
import { listar } from "@/services/Service";
import { useContext, useEffect, useState } from "react";

interface ActivityType {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface Props {
  selectedActivityId: string | null;
  setSelectedActivityId: (id: string) => void;
}

function CarouselActivityModal({
  selectedActivityId,
  setSelectedActivityId,
}: Props) {
  const [activities, setActivities] = useState<ActivityType[]>([]);

  const { user } = useContext(AuthContext);
  const token = user?.token;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        await listar(`/activities/types`, setActivities, {
          headers: { Authorization: token },
        });
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    };

    fetchActivities();
  }, [token]);

  return (
    <>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full max-w-sm"
      >
        <CarouselContent>
          {activities.map((activity) => (
            <CarouselItem
              key={activity.id}
              className="md:basis-1/2 lg:basis-1/4"
            >
              <div className="p-1">
                <CardContent
                  onClick={() => {
                    setSelectedActivityId(activity.id);
                  }}
                  className={`cursor-pointer flex aspect-square items-center justify-center p-1 w-17 h-17 border rounded-full transition-all ${
                    selectedActivityId === activity.id
                      ? "border-emerald-500 ring-2 ring-emerald-300"
                      : ""
                  }`}
                >
                  {activity.image ? (
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{activity.name}</span>
                  )}
                </CardContent>
                <span className="block text-center mt-2 font-medium text-sm">
                  {activity.name}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
export default CarouselActivityModal;
