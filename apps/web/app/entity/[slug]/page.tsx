import { EntityCard } from "@/components/cards/EntityCard";
import { recordPage } from "@/lib/record-page";

const route = recordPage("entities", EntityCard, "entity");

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
