import { Activity } from "@/models/Activity";
import { CalendarDaysIcon, Lock } from "lucide-react";
import { UsersThree } from "phosphor-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ActivityType } from "@/models/ActivityType";

interface ActivityCardProps {
  activity?: Activity;
  activitytype?: ActivityType;
}

function ActivityCard({ activity, activitytype }: ActivityCardProps) {
  const [imageSrc, setImageSrc] = useState<string>("");

  useEffect(() => {
    if (activity) {
      if (activity.image instanceof File) {
        const imageUrl = URL.createObjectURL(activity.image);
        setImageSrc(imageUrl);
      } else if (typeof activity.image === "string") {
        setImageSrc(activity.image);
      } else {
        console.error("Imagem não encontrada ou não é válida.");
      }
    }
  }, [activity]);
  const formatDateTime = (dateTime: string) => {
    return format(new Date(dateTime), "dd/MM/yyyy | HH:mm", {
      locale: ptBR,
    });
  };
  if (!activity) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="relative flex-col items-center  w-full">
        <img src={imageSrc} alt={activity.title} className="w-160 rounded-sm" />
        <div className="absolute inset-0 flex">
          {activity.private && (
            <Lock
              size={40}
              className="text-white rounded-full justify-center bg-emerald-600 p-2.5 m-2"
            />
          )}
        </div>
        <div className="mt-3 py-4">
          <span className="font-semibold">{activity.title}</span>
          <div className="flex-row flex">
            <CalendarDaysIcon className="text-emerald-500 mr-2" />
            <span className="mr-2">
              {formatDateTime(activity.scheduledDate)} |
            </span>{" "}
            <UsersThree size={20} className="text-emerald-500 mr-2" />{" "}
            <span>{activity.participants ? activity.participants : 0}</span>{" "}
          </div>
        </div>
      </div>
    </>
  );
}

export default ActivityCard;
