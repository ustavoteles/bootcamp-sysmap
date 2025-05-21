import { useContext, useEffect, useState } from "react";
import ActivityGroupedByTypeCard from "../activities/activities-grouped-by-type/ActivityGroupedByTypeCard";
import { Activity } from "@/models/Activity";
import { listar } from "@/services/Service";
import { AuthContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router";
interface TypeCardProps {
  typeId: string;
}

function TypeCard({ typeId }: TypeCardProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [typeName, setTypeName] = useState<string>("");
  const [showAllActivities, setShowAllActivities] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const token = user?.token;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await listar(
          `/activities/all?typeId=${typeId}&orderBy=createdAt&order=desc`,
          setActivities,
          {
            headers: { Authorization: token },
          }
        );
        if (response && response.length > 0) {
          setTypeName(response[0].type);
        }
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    };

    if (token && typeId) {
      fetchActivities();
    }
  }, [token, typeId]);

  const handleSeeMore = () => {
    setShowAllActivities(true);
    navigate(`/activities?typeId=${typeId}`);
  };

  return (
    <div className="container w-[calc(50%-0.5rem)]  ">
      <div className="w-full">
        <div className="flex flex-row justify-between mb-4">
          <h1 className="text-2xl font-bold font-heading ">{typeName}</h1>
          <span
            onClick={handleSeeMore}
            className="font-bold text-xl text-center"
          >
            Ver mais
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1 ">
          {" "}
          {activities
            .slice(0, showAllActivities ? activities.length : 6)
            .map((activity) => (
              <ActivityGroupedByTypeCard
                key={activity.id}
                activity={activity}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default TypeCard;
