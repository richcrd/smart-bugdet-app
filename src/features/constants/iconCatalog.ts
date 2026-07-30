import {
  Baby,
  Banknote,
  BookOpen,
  Bus,
  Car,
  Coffee,
  Dumbbell,
  Gamepad2,
  Gift,
  Globe,
  GraduationCap,
  HeartPulse,
  House,
  Lightbulb,
  Music,
  PawPrint,
  PiggyBank,
  Pill,
  Plane,
  Receipt,
  Shirt,
  ShoppingCart,
  Smartphone,
  Tv,
  UtensilsCrossed,
  Wifi,
  type LucideIcon,
} from "lucide-react-native";

export type IconEntry = {
  key: string;
  icon: LucideIcon
  label: string;
}

export const ICON_CATALOG: IconEntry[] = [
  { key: "shopping-cart", icon: ShoppingCart, label: "Compra" },
  { key: "food", icon: UtensilsCrossed, label: "Comida" },
  { key: "car", icon: Car, label: "Auto" },
  { key: "home", icon: House, label: "Hogar" },
  { key: "bus", icon: Bus, label: "Transporte" },
  { key: "salary", icon: Banknote, label: "Salario" },
  { key: "health", icon: HeartPulse, label: "Salud" },
  { key: "education", icon: BookOpen, label: "Educación" },
  { key: "entertainment", icon: Gamepad2, label: "Juegos" },
  { key: "clothing", icon: Shirt, label: "Ropa" },
  { key: "gifts", icon: Gift, label: "Regalos" },
  { key: "bills", icon: Receipt, label: "Facturas" },
  { key: "savings", icon: PiggyBank, label: "Ahorro" },
  { key: "travel", icon: Plane, label: "Viaje" },
  { key: "phone", icon: Smartphone, label: "Teléfono" },
  { key: "pets", icon: PawPrint, label: "Mascotas" },
  { key: "fitness", icon: Dumbbell, label: "Gimnasio" },
  { key: "coffee", icon: Coffee, label: "Café" },
  { key: "internet", icon: Wifi, label: "Internet" },
  { key: "tv", icon: Tv, label: "TV" },
  { key: "music", icon: Music, label: "Música" },
  { key: "baby", icon: Baby, label: "Bebé" },
  { key: "energy", icon: Lightbulb, label: "Energía" },
  { key: "medicine", icon: Pill, label: "Medicina" },
  { key: "graduation", icon: GraduationCap, label: "Estudio" },
  { key: "travel-globe", icon: Globe, label: "Global" },
];

export function getIconByKey(key: string | null | undefined): LucideIcon
{
  const entry = ICON_CATALOG.find((i) => i.key === key);
  return entry?.icon ?? ShoppingCart;
}
