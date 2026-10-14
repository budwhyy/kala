import { KingdomCard } from "@/components/cards/KingdomCard";
import { recordPage } from "@/lib/record-page";

const route = recordPage("kingdoms", KingdomCard, "kingdom");

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
