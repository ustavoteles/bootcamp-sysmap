import { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ActivityTypesCard from "../activity-types/ActivityTypesCard";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { listar } from "@/services/Service";
import { AuthContext } from "@/contexts/AuthContext";

export default function ActivityUserPreferencesModal() {
  const [open, setOpen] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
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

    const preferences = localStorage.getItem("userPreferences");
    if (!preferences || preferences === "skipped") {
      setOpen(true);
      fetchActivities();
    }
  }, [token]);

  const handleSelect = (id: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(id) ? prev.filter((pref) => pref !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    if (selectedPreferences.length === 0 || !token || !user?.id) return;

    try {
      console.log("Enviando para o backend:", {
        preferences: selectedPreferences,
      });

      const response = await axios.post(
        "http://localhost:3000/user/preferences/define",
        selectedPreferences,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.setItem(
          "userPreferences",
          JSON.stringify(selectedPreferences)
        );
        setOpen(false);
      } else {
        console.error("Erro ao salvar preferências:", response);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-w-3xl min-h-3xl p-12 justify-center items-center">
        <DialogHeader>
          <DialogTitle>
            <p className="font-heading text-5xl flex flex-col font-bold text-center justify-center w-full">
              SELECIONE AS SUAS ATIVIDADES PREFERIDAS
            </p>
          </DialogTitle>

          <div className="flex flex-wrap justify-center">
            {activities.map((activity) => (
              <ActivityTypesCard
                key={activity.id}
                activityType={activity}
                selected={selectedPreferences.includes(activity.id)}
                onClick={() => handleSelect(activity.id)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-12 w-full gap-2">
            <Button
              className="flex-1 bg-emerald-500 text-white text-xl hover:bg-emerald-800 hover:border-2 hover:border-emerald-500 font-semibold h-12"
              onClick={handleConfirm}
            >
              Confirmar
            </Button>

            <DialogClose asChild>
              <Button
                className="flex-1 bg-white border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-800 hover:text-white font-semibold text-xl h-12"
                onClick={() => {
                  localStorage.setItem("userPreferences", "skipped");
                  setOpen(false);
                }}
              >
                Pular
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
