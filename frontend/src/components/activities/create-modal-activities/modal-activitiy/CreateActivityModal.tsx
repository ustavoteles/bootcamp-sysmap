import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import MapCard from "@/components/activities/create-modal-activities/map-card/MapCard";
import CarouselActivityModal from "../carousel-modal-activity/CarouselActivityModal";
import { useContext, useEffect, useState } from "react";
import type { Activity } from "@/models/Activity";
import { useForm } from "react-hook-form";
import { cadastrar } from "@/services/Service";
import { AuthContext } from "@/contexts/AuthContext";

type FormData = {
  title: string;
  description: string;
  scheduledDate: string;
  typeId: string;
  image: FileList;
  latitude: number;
  longitude: number;
  private: boolean;
};

export default function CreateActivityModal() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      private: false,
    },
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );
  const [newActivity, setNewActivity] = useState<Activity | null>(null);
  const imageFile = watch("image");
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const {
    title,
    description,
    scheduledDate,
    image,
    latitude,
    longitude,
    private: isPrivate,
  } = watch();

  const typeId = selectedActivityId;

  const isFormValid =
    !!title &&
    !!description &&
    !!scheduledDate &&
    !!typeId &&
    !!image?.[0] &&
    latitude !== undefined &&
    longitude !== undefined;

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const url = URL.createObjectURL(file);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  useEffect(() => {
    if (selectedActivityId) {
      setValue("typeId", selectedActivityId);
    }
  }, [selectedActivityId, setValue]);

  const onSubmit = async (data: any) => {
    try {
      console.log("Dados recebidos do formulário:", data);

      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("typeId", data.typeId);
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      } else {
        console.error("Imagem não fornecida.");
        return;
      }

      const isoDate = new Date(data.scheduledDate).toISOString();
      formData.append("scheduledDate", isoDate);
      formData.append("private", data.private ? "true" : "false");

      const address = {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
      };
      formData.append("address", JSON.stringify(address));

      await cadastrar(`/activities/new`, formData, setNewActivity, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      })
        .then((response) => {
          console.log("Resposta da API:", response);
          alert("Atividade criada com sucesso!");
        })
        .catch((error) => {
          if (error.response) {
            console.error(" Erro do servidor:", error.response.data);
          } else {
            console.error("Erro inesperado:", error.message);
          }
        });
    } catch (error: any) {
      if (error.response) {
        console.error(" Erro do servidor:", error.response.data);
      } else {
        console.error("Erro inesperado:", error.message);
      }
    }
  };
  return (
    <div className="flex">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold text-md h-14 flex items-center">
            <span className="border-4 text-white text-2xl rounded-full h-full w-full flex items-center justify-center p-2">
              +
            </span>
            Criar atividade
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl gap-y-10">
          <DialogTitle className="font-heading text-2xl">
            Nova atividade
          </DialogTitle>

          <form
            className="grid justify-items-end gap-10"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex gap-x-12">
              <div className="space-y-4 flex-1">
                {/* Imagem */}
                <div className="space-y-1.5">
                  <Label>
                    Imagem <span className="text-red-500"> *</span>
                  </Label>

                  <Label className="relative w-full border-1 h-50 rounded-sm flex items-center justify-center cursor-pointer overflow-hidden">
                    <Input
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      type="file"
                      {...register("image", {
                        required: "A imagem é obrigatória",
                      })}
                    />
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className=" object-cover h-full w-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center text-gray-400">
                        <ImageIcon size={30} />
                      </div>
                    )}
                  </Label>
                  {errors.image && (
                    <p className="text-red-500 text-sm">
                      {errors.image.message}
                    </p>
                  )}
                </div>

                {/* Titulo */}
                <div className="space-y-1.5">
                  <Label>
                    Título <span className="text-red-500"> *</span>
                  </Label>
                  <Input
                    placeholder="Ex.: Aula de Yoga"
                    {...register("title", {
                      required: "O título é obrigatório",
                    })}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Descricao */}
                <div className="space-y-1.5">
                  <Label>
                    Descrição <span className="text-red-500"> *</span>
                  </Label>
                  <Textarea
                    className="h-32 "
                    placeholder="Como será a atividade? Quais as regras? O que é necessário para participar?"
                    {...register("description", {
                      required: "A descrição é obrigatória",
                    })}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Data */}
                <div className="space-y-1.5">
                  <Label>
                    Data <span className="text-red-500"> *</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    {...register("scheduledDate", {
                      required: "A data é obrigatória",
                    })}
                  />
                  {errors.scheduledDate && (
                    <p className="text-red-500 text-sm">
                      {errors.scheduledDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Tipo da atividade */}
              <div className="space-y-4 flex flex-col justify-between flex-1">
                <div className="space-y-1.5">
                  <Label>
                    Tipo da atividade<span className="text-red-500"> *</span>
                  </Label>

                  <div className=" max-w-80 flex gap-x-2">
                    <CarouselActivityModal
                      selectedActivityId={selectedActivityId}
                      setSelectedActivityId={setSelectedActivityId}
                    />
                  </div>
                  <input
                    type="hidden"
                    {...register("typeId", {
                      required: "Selecione um tipo de atividade.",
                    })}
                  />
                  {errors.typeId && (
                    <p className="text-red-500 text-sm">
                      {errors.typeId.message}
                    </p>
                  )}
                </div>

                {/* Ponto de encontro */}
                <div className="space-y-1 5">
                  <Label>
                    Ponto de encontro <span className="text-red-500"> *</span>
                  </Label>
                  <MapCard setValue={setValue} />{" "}
                  <input
                    type="hidden"
                    {...register("latitude", {
                      required: "Latitude é obrigatória",
                    })}
                  />
                  <input
                    type="hidden"
                    {...register("longitude", {
                      required: "Longitude é obrigatória",
                    })}
                  />
                  {/* Exibindo mensagens de erro */}
                  {errors.latitude && (
                    <p className="text-red-500 text-sm">
                      {errors.latitude.message}
                    </p>
                  )}
                  {errors.longitude && (
                    <p className="text-red-500 text-sm">
                      {errors.longitude.message}
                    </p>
                  )}
                  {/* Exibindo as coordenadas para visualização */}
                  <div className="text-sm text-gray-500">
                    Latitude: {watch("latitude")}, Longitude:{" "}
                    {watch("longitude")}
                  </div>
                </div>

                {/* Aprovacao */}
                <div className="space-y-1 5">
                  <Label>
                    Requer aprovação para participar{" "}
                    <span className="text-red-500"> *</span>
                  </Label>

                  <div className="flex flex-row justify-start gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 w-15 font-bold "
                      onClick={() => setValue("private", true)}
                    >
                      Sim
                    </Button>
                    <Button
                      type="button"
                      className="h-10 w-15 font-bold border-gray-500"
                      onClick={() => setValue("private", false)}
                    >
                      Não
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className={`h-12 w-56 font-bold bg-emerald-500 ${
                !isFormValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!isFormValid}
            >
              Criar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
