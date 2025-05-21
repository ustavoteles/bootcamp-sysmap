import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "phosphor-react";

export default function DeleteUserModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" bg-white text-red-700 hover:bg-red-700 hover:text-white text-md font-semibold h-14 w-full ">
          <Trash size={24} weight="bold" />
          <span>Desativar minha conta</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-screen p-12">
        <DialogHeader>
          <DialogTitle>
            <h2 className="w-full text-3xl font-extrabold font-heading ">
              TEM CERTEZA QUE DESEJA DESATIVAR SUA CONTA?
            </h2>
          </DialogTitle>
        </DialogHeader>

        <p className="text-md text-muted-foreground mb-4">
          Ao desativar sua conta, todos os seus dados e histórico de atividades
          serão permanentemente removidos.{" "}
          <span className="font-semibold text-black">
            Esta ação é irreversível e não poderá ser desfeita.{" "}
          </span>
        </p>

        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="h-12 w-1/4 font-bold border-gray-500"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button variant="destructive" className="h-12 w-1/4 font-bold">
            Desativar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
