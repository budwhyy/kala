import { EventCard } from "@/components/cards/Phase2Cards";
import { recordPage } from "@/lib/record-page";

const route = recordPage("events", EventCard);

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
