interface ActivityType {
  id: string;
  name: string;
  description: string;
  image: string;
}
interface Props {
  activityType: ActivityType;
  selected?: boolean;
  onClick?: () => void;
}

export default function ActivityTypesCard({
  activityType,
  selected,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={
        "cursor-pointer flex flex-col items-center mt-3 py-4 w-40 transition-all duration-300"
      }
    >
      <img
        src={activityType.image}
        alt={activityType.name}
        className={`rounded-full h-36 w-36 object-cover border-7 transition-all duration-300  ${
          selected ? "border-emerald-500 bg-emerald-50" : "border-gray-300"
        }`}
      />
      <span className="font-semibold mt-2 text-center">
        {activityType.name}
      </span>
    </div>
  );
}
