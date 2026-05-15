import ChatBot from "@/components/chat/ChatBot";

export default function AIFormPage() {
  return (
    <div className="min-h-screen">
      <main id="main">
        <ChatBot classicFormMode="route" classicFormHref="/form" />
      </main>
    </div>
  );
}
