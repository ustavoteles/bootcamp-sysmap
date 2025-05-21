import ActivityGroupedByTypeCard from "@/components/activities/activities-grouped-by-type/ActivityGroupedByTypeCard";
import ActivityCard from "@/components/activities/activity-card/ActivityCard";
import ActivityTypesCard from "@/components/activities/activity-types/ActivityTypesCard";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/contexts/AuthContext";
import { Activity } from "@/models/Activity";
import { ActivityType } from "@/models/ActivityType";
import { listar } from "@/services/Service";
import { ChevronDown } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const [searchParams] = useSearchParams();
  const typeId = searchParams.get("typeId");
  const [showAllActivities, setShowAllActivities] = useState(false);
  const navigate = useNavigate();

  const handleTypeClick = (typeId: string) => {
    navigate(`?typeId=${typeId}`);
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        await listar("/activities/all", setActivities, {
          headers: { Authorization: token },
        });
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    };

    const fetchActivityTypes = async () => {
      try {
        await listar("/activities/types", setActivityTypes, {
          headers: { Authorization: token },
        });
      } catch (error) {
        console.error("Erro ao buscar tipos de atividade:", error);
      }
    };

    fetchActivities();
    fetchActivityTypes();
  }, [token]);

  const activityType = activityTypes.find((type) => type.id === typeId);

  return (
    <div className="w-full h-full">
      <div className="flex flex-row justify-between mb-4">
        <h1 className="text-2xl font-bold font-heading ">{`POPULAR EM ${activityType?.name}`}</h1>
      </div>
      <div className="grid grid-cols-4 gap-4 w-full">
        {" "}
        {activities && activities.length > 0 ? (
          activities
            .filter((activity) => activity.type === activityType?.name)
            .slice(0, 8)
            .map((activity, index) => (
              <ActivityCard key={index} activity={activity} />
            ))
        ) : (
          <div className="flex justify-center items-center w-screen text-2xl text-gray-500">
            Sem atividades disponíveis
          </div>
        )}
      </div>

      <div className="mt-14">
        <div className="grid grid-cols-4 gap-3 my-auto">
          {activities.length > 0 ? (
            activities
              .filter((activity) => activity.type === activityType?.name)
              .slice(0, showAllActivities ? activities.length : 6)
              .map((activity) => (
                <ActivityGroupedByTypeCard
                  key={activity.id}
                  activity={activity}
                />
              ))
          ) : (
            <div className="col-span-4 flex justify-center items-center text-2xl text-gray-500">
              Sem atividades disponíveis
            </div>
          )}
        </div>

        {activities.length > 16 && (
          <div className="flex justify-center">
            <Button
              className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold text-md h-14 flex items-center mt-6"
              onClick={() => setShowAllActivities(!showAllActivities)}
            >
              {showAllActivities ? (
                <>
                  Ver menos <ChevronDown size={16} />
                </>
              ) : (
                <>
                  Ver mais <ChevronDown size={16} />
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="mt-14">
        <h1 className="text-2xl font-bold font-heading ">
          OUTROS TIPOS DE ATIVIDADE
        </h1>
        <div className="justify-start flex-wrap flex items-start w-full gap-4 mt-4">
          {activityTypes.length > 0 ? (
            activityTypes
              .filter((type) => type.id !== typeId)
              .map((type, index) => (
                <ActivityTypesCard
                  key={index}
                  activityType={type}
                  onClick={() => handleTypeClick(type.id)}
                />
              ))
          ) : (
            <div className="flex justify-center items-center w-screen text-2xl text-gray-500">
              Sem tipos de atividades disponíveis
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Activities;
