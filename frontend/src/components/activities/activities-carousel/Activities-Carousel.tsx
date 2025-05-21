import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import YogaPhoto from "@/assets/images/yoga-photo.svg";

function CarouselActivities() {
  return (
    <div className="relative w-full h-[10vh] bg-green-400 flex ">
      <Carousel className="w-full h-full flex items-center justify-around  bg-amber-400">
        <CarouselContent className="flex gap-1 h-full w-full  items-center  bg-purple-500">
          <CarouselItem className="w-full h-full bg-blue-600 flex flex-row items-center justify-start gap-2">
            <img src={YogaPhoto} alt="Yoga" className="w-full h-[7vh]" />
            <img src={YogaPhoto} alt="Yoga" className="w-full h-[7vh]" />{" "}
            <img src={YogaPhoto} alt="Yoga" className="w-full h-[7vh]" />{" "}
            <img src={YogaPhoto} alt="Yoga" className="w-full h-[7vh]" />
          </CarouselItem>
          <CarouselItem className="w-full h-full bg-blue-600 flex flex-row items-center justify-start gap-2">
            <img src={YogaPhoto} alt="Yoga" className="w-full h-[7vh]" />
            <img src={YogaPhoto} alt="Yoga" className="w-full h-[7vh]" />{" "}
            <img src={YogaPhoto} alt="Yoga" className="w-full h-[7vh]" />{" "}
            <img src={YogaPhoto} alt="Yoga" className="w-full h-[7vh]" />
          </CarouselItem>{" "}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-8 inset-y-10 flex items-center justify-center bg-white rounded-full w-8 h-8 shadow-md"></CarouselPrevious>
        <CarouselNext className="absolute -right-8 inset-y-10 flex items-center justify-center bg-white rounded-full w-8 h-8 shadow-md"></CarouselNext>{" "}
      </Carousel>
    </div>
  );
}
export default CarouselActivities;
