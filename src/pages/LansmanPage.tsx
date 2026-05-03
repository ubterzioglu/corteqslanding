import { useState } from "react";

import LansmanForm from "@/components/LansmanForm";
import LansmanList from "@/components/LansmanList";

const LansmanPage = () => {
  const [refreshToken, setRefreshToken] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto grid gap-6 px-4 py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">CorteQS Lansman</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Lansman kaydınızı oluşturun. Başvurular önce incelemeye alınır.
            </p>
          </div>

          <LansmanForm onSuccess={() => setRefreshToken((current) => current + 1)} />
        </div>

        <LansmanList refreshToken={refreshToken} />
      </div>
    </div>
  );
};

export default LansmanPage;
