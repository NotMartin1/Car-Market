import ChatPage from "@/pages/ChatPage";

export const metadata = { title: "Chat | AutoMarket" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ChatPage conversationId={id} />;
}
