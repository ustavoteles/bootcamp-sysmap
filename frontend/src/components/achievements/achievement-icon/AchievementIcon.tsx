import Medal from "@/assets/images/medal.svg";

function AchievementIcon() {
  return (
    <div className="justify-content items-center  flex flex-col ">
      <div className="bg-gray-500 w-16 h-16 flex flex-col  items-center justify-center rounded-full   text-white">
        <div className="flex items-center justify-center text-center gap-2">
          <img src={Medal} alt="Medalha" className="w-8 h-8" />
        </div>
      </div>
      <p className="text-sm text-center">Participou de 5 atividades</p>
    </div>
  );
}
export default AchievementIcon;
