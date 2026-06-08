import {
  Globe, Compass, GraduationCap, Heart, BookOpen, Users, HandHeart,
  Church, Cross, Sparkles, Radio, Calendar, Download, type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  globe: Globe,
  compass: Compass,
  "graduation-cap": GraduationCap,
  heart: Heart,
  book: BookOpen,
  users: Users,
  hand: HandHeart,
  church: Church,
  cross: Cross,
  sparkles: Sparkles,
  radio: Radio,
  calendar: Calendar,
  download: Download,
};

export function Icon({ name, className }: { name?: string | null; className?: string }) {
  const Cmp = (name && map[name]) || Sparkles;
  return <Cmp className={className} />;
}
