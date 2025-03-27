import {
  User,
  Heart,
  Briefcase,
  Sprout,
  HospitalIcon as HealthIcon,
  Sparkles,
  MessageSquare,
  WalletCardsIcon as Cards,
  LayoutGrid,
} from "lucide-react";

interface DynamicIconProps {
  focusedField: string | null;
}

export default function DynamicIcon({ focusedField }: DynamicIconProps) {
  const getIcon = () => {
    switch (focusedField) {
      case "readingType":
        return (
          <div className="flex flex-col items-center gap-2">
            <div className="grid grid-cols-3 gap-2">
              <Heart className="text-red-500" size={24} />
              <Briefcase className="text-amber-700" size={24} />
              <Sprout className="text-green-600" size={24} />
            </div>
            <div className="flex gap-2">
              <HealthIcon className="text-blue-500" size={24} />
              <Sparkles className="text-purple-500" size={24} />
            </div>
          </div>
        );
      case "question":
        return <MessageSquare className="text-amber-600" size={48} />;
      case "spreadType":
        return (
          <div className="flex flex-col items-center gap-2">
            <Cards className="text-indigo-600" size={48} />
            <LayoutGrid className="text-indigo-400" size={24} />
          </div>
        );
      default:
        return <User className="text-stone-600" size={48} />;
    }
  };

  return (
    <div className="w-32 h-32 rounded-full border-4 border-stone-600 flex items-center justify-center bg-stone-100 transition-all duration-300">
      {getIcon()}
    </div>
  );
}
