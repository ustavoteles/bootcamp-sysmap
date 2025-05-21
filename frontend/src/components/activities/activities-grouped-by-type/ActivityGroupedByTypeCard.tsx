import { Activity } from "@/models/Activity";
import { CalendarDaysIcon } from "lucide-react";
import { UsersThree } from "phosphor-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ActivityType } from "@/models/ActivityType";

interface ActivityCardProps {
  activity?: Activity;
  activitytype?: ActivityType;
}

function ActivityGroupedByTypeCard({
  activity,
  activitytype,
}: ActivityCardProps) {
  console.log(activity);
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
    return format(new Date(dateTime), "dd/MM/yyyy  HH:mm", {
      locale: ptBR,
    });
  };
  if (!activity) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {" "}
      <div className="flex items-center w-full">
        <img
          src={imageSrc}
          alt={activity.title}
          className="w-30 h-25 rounded-sm"
        />

        <div className="ml-4 flex flex-col justify-center">
          <span className="font-semibold text-2xl">{activity.title}</span>

          <div className="flex flex-row items-center gap-2 mt-1 w-100">
            <CalendarDaysIcon className="text-emerald-500" />
            <span className="mr-2 text-sm text-center">
              {formatDateTime(activity.scheduledDate)} |
            </span>{" "}
            <UsersThree size={20} className="text-emerald-500" />
            <span>
              {activity.participants ? activity.participants : 0}
            </span>{" "}
          </div>
        </div>
      </div>
    </>
  );
}

export default ActivityGroupedByTypeCard;
