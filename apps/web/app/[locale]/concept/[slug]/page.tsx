import { ConceptCard } from "@/components/cards/Phase2Cards";
import { recordPage } from "@/lib/record-page";

const route = recordPage("concepts", ConceptCard);

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
