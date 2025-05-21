import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AchievementIcon from "../achievement-icon/AchievementIcon";
import { type CarouselApi } from "@/components/ui/carousel";
import React from "react";

function AchievementMedalCard() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div>
      <Card className="relative">
        <Carousel setApi={setApi} className="w-[53vh] h-[20vh] bg-white p-8">
          <CardContent className="h-full flex justify-center items-center">
            <CarouselContent>
              <CarouselItem>
                <div className="flex justify-around gap-1">
                  <AchievementIcon />
                  <AchievementIcon />
                  <AchievementIcon />
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="flex justify-around gap-4">
                  <AchievementIcon />
                  <AchievementIcon />
                  <AchievementIcon />
                </div>
              </CarouselItem>
            </CarouselContent>
          </CardContent>
        </Carousel>

        {/* Indicadores (bolinhas) posicionadas absolutamente no fundo do card */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition duration-300 ${
                current === index + 1 ? "bg-gray-800 scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

export default AchievementMedalCard;
