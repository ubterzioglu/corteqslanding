import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "CorteQS nedir ve nasıl çalışır?",
    a: (
      <>
        CorteQS, yurt dışındaki Türk diasporasını <strong>şehir bazlı olarak</strong> danışmanlar,
        işletmeler, etkinlikler ve topluluklarla buluşturan bir platformdur.
        İhtiyacınızı seçerek doğru kişilere ve fırsatlara hızlıca ulaşabilirsiniz.
        164 ülkede 8.8 milyon Türk diasporasını hedefler.
      </>
    ),
  },
  {
    q: "Yurtdışına taşınmak için CorteQS nasıl yardımcı olur?",
    a: (
      <>
        CorteQS üzerinden <strong>vize, oturum, ev bulma, iş bulma</strong> ve günlük yaşam gibi
        konularda şehir bazlı danışmanlara ulaşabilir, etkinliklere katılarak hızlıca network
        oluşturabilirsiniz.
      </>
    ),
  },
  {
    q: "CorteQS'te nasıl danışman bulabilirim?",
    a: (
      <>
        İhtiyacınızı — örneğin vize, emlak, iş kurma — seçin, bulunduğunuz ya da taşınmak
        istediğiniz şehri belirtin. Size uygun danışmanlar listelenir ve{" "}
        <strong>doğrudan iletişime</strong> geçebilirsiniz.
      </>
    ),
  },
  {
    q: "İşletmemi CorteQS'e nasıl eklerim?",
    a: (
      <>
        Platforma kayıt olarak işletmenizi listeleyebilir, kampanyalar oluşturabilir ve
        bulunduğunuz şehirdeki Türk topluluğuna doğrudan ulaşabilirsiniz. İşletmenizi{" "}
        <strong>potansiyel müşterilere, ortaklara ve danışmanlara</strong> sunarak uluslararası
        iş bağlantıları ve büyüme fırsatları sağlar.
      </>
    ),
  },
  {
    q: "CorteQS şehir elçisi (Ambassador) nedir, nasıl olunur?",
    a: (
      <>
        <strong>Şehir elçileri</strong>, bulundukları şehirde topluluğu büyüten, etkinlikler organize
        eden ve kullanıcıları platforma kazandıran kişilerdir. Başvuru yaparak kendi şehrinizde aktif
        rol alabilirsiniz.
      </>
    ),
  },
  {
    q: "CorteQS üzerinden etkinliklere nasıl katılabilirim?",
    a: (
      <>
        Bulunduğunuz şehirdeki etkinlikleri keşfedebilir, doğrudan katılım sağlayabilir veya kendi
        etkinliğinizi oluşturabilirsiniz. Etkinlikler, diaspora üyeleri arasında{" "}
        <strong>güçlü bağlar kurmanızı</strong> ve profesyonel networkunuzu genişletmenizi sağlar.
      </>
    ),
  },
  {
    q: "CorteQS ücretsiz mi?",
    a: (
      <>
        Platformun temel özellikleri <strong>ücretsizdir</strong>. Premium özellikler ve işletmeler
        için ek görünürlük sağlayan seçenekler bulunmaktadır. Erken erişim aşamasında kayıt tamamen
        ücretsizdir.
      </>
    ),
  },
  {
    q: "CorteQS hangi ülkelerde ve şehirlerde aktif?",
    a: (
      <>
        CorteQS, Türk diasporasının yoğun olduğu şehirlerde aktif olarak başlamaktadır.{" "}
        <strong>Berlin, Dubai, Londra, Amsterdam, Sydney ve New York</strong> ilk odak şehirler
        arasındadır. Diğer şehirler için kayıtlar devam etmekte olup yeni lokasyonlar hızla
        açılmaktadır.
      </>
    ),
  },
  {
    q: "CorteQS ile iş veya müşteri bulabilir miyim?",
    a: (
      <>
        Evet. Danışmanlar ve işletmeler platform üzerinden yeni müşterilere ulaşabilir, bireysel
        kullanıcılar ise <strong>iş ve iş birliği fırsatlarını</strong> keşfedebilir. Global Türk
        diaspora networku üzerinden uluslararası iş bağlantıları kurabilirsiniz.
      </>
    ),
  },
  {
    q: "CorteQS'e nasıl katılabilirim?",
    a: (
      <>
        Landing page üzerinden kayıt bırakabilir veya <strong>WhatsApp üzerinden hızlı onboarding
        sürecine</strong> girerek platforma erken erişim sağlayabilirsiniz. Danışman, işletme, dernek,
        vakıf, blogger, şehir elçisi veya bireysel kullanıcı kategorilerinden birini seçerek
        kaydolabilirsiniz.
      </>
    ),
  },
];

const FAQSection = () => {
  return (
    <section className="py-14 lg:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
          Sıkça Sorulan Sorular — CorteQS Nasıl Çalışır?
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base md:text-lg">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent>
                <p className="faq-answer text-base text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
