import ActivityCard from "@/components/activities/activity-card/ActivityCard";
import ActivityTypesCard from "@/components/activities/activity-types/ActivityTypesCard";

import TypeCard from "@/components/type/TypeCard";
import ActivityUserPreferencesModal from "@/components/activities/activity-preferences-modal/ActivityPreferencesModal";
import { Activity } from "@/models/Activity";
import { useContext, useEffect, useState } from "react";
import { listar } from "@/services/Service";
import { AuthContext } from "@/contexts/AuthContext";

function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityTypes, setActivityTypes] = useState<any[]>([]);
  const storedPreferences = localStorage.getItem("userPreferences");
  const userPreferences = storedPreferences
    ? JSON.parse(storedPreferences)
    : [];
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const filteredActivities = activities?.filter((activity) =>
    userPreferences.includes(activity.type)
  );

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        await listar(`/activities/all`, setActivities, {
          headers: { Authorization: token },
        });
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchActivitiesTypes = async () => {
      try {
        await listar(`/activities/types`, setActivityTypes, {
          headers: { Authorization: token },
        });
      } catch (error) {
        console.error("Erro ao buscar atividades:", error);
      }
    };

    fetchActivitiesTypes();
  }, []);

  console.log("Atividades recebidas:", setActivityTypes);
  return (
    <div className="w-full h-full">
      <ActivityUserPreferencesModal />

      <div className="flex flex-row justify-between mb-4">
        <h1 className="text-2xl font-bold font-heading ">
          RECOMENDADO PARA VOCÊ
        </h1>
      </div>
      <div className="grid grid-cols-4 gap-4 w-full">
        {activities && activities.length > 0 ? (
          activities

            .sort(() => Math.random() - 0.5)
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
        {" "}
        <h1 className="text-2xl font-bold ">TIPOS DE ATIVIDADE</h1>
        <div className="justify-start flex-wrap flex items-start w-full gap-4 mt-4">
          {activityTypes.map((type, index) => (
            <ActivityTypesCard key={index} activityType={type} />
          ))}
        </div>
        <div className="flex flex-wrap gap-4 w-full mt-4">
          {activityTypes.map((type) => (
            <TypeCard key={type.id} typeId={type.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
export default Home;
