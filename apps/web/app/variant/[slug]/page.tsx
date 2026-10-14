import { VariantCard } from "@/components/cards/RecordCards";
import { recordPage } from "@/lib/record-page";

const route = recordPage("variants", VariantCard);

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
