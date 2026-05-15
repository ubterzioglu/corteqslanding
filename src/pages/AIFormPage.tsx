import corteqsLogo from "../../0logomail.png";
import ChatBot from "@/components/chat/ChatBot";

export default function AIFormPage() {
  return (
    <div className="min-h-screen">
      <main id="main">
        <ChatBot
          classicFormMode="route"
          classicFormHref="/form"
          classicFormLayout="stacked"
          topLogoSrc={corteqsLogo}
        />
      </main>
    </div>
  );
}
