import { DynastyCard } from "@/components/cards/RecordCards";
import { recordPage } from "@/lib/record-page";

const route = recordPage("dynasties", DynastyCard, "dynasty");

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
