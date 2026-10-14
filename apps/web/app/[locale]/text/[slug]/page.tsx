import { TextCard } from "@/components/cards/RecordCards";
import { recordPage } from "@/lib/record-page";

const route = recordPage("texts", TextCard, "text");

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
