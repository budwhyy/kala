import { PlaceCard } from "@/components/cards/PlaceCard";
import { recordPage } from "@/lib/record-page";

const route = recordPage("places", PlaceCard, "place");

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
