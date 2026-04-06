import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Globe, User, LogIn, LogOut, MapPin, PenLine, ChevronDown, Users, Briefcase, Building2, Shield, Flag, Newspaper } from "lucide-react";
import corteqsLogo from "@/assets/corteqs-logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDiaspora, diasporaOptions, countryList } from "@/contexts/DiasporaContext";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { diaspora, setDiaspora, t, currentOption, selectedCountry, setSelectedCountry } = useDiaspora();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2"style={{ minHeight: '5rem' }}>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src={corteqsLogo} alt="CorteQS" className="w-auto" style={{ height: '6.75rem' }} />
            </Link>

            {/* Diaspora Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-base px-2">
                  <span className="text-lg">{currentOption.flag}</span>
                  <span className="hidden sm:inline text-xs text-muted-foreground">{currentOption.label}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Diaspora Seçin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {diasporaOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.key}
                    className={`gap-2 cursor-pointer ${diaspora === opt.key ? "bg-accent/50 font-semibold" : ""}`}
                    onClick={() => setDiaspora(opt.key)}
                  >
                    <span className="text-lg">{opt.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.nativeLabel}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Country Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 px-2.5 h-8 text-xs border-border">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">{selectedCountry === "all" ? "Tüm Ülkeler" : selectedCountry}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Ülke Seçin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className={`cursor-pointer text-sm ${selectedCountry === "all" ? "bg-accent/50 font-semibold" : ""}`}
                  onClick={() => setSelectedCountry("all")}
                >
                  🌍 Tüm Ülkeler
                </DropdownMenuItem>
                {countryList.map((c) => (
                  <DropdownMenuItem
                    key={c}
                    className={`cursor-pointer text-sm ${selectedCountry === c ? "bg-accent/50 font-semibold" : ""}`}
                    onClick={() => setSelectedCountry(c)}
                  >
                    {c}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:flex items-center gap-7">
            <Link to="/consultants" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.nav.consultants}</Link>
            <Link to="/associations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.nav.organizations}</Link>
            <Link to="/businesses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.nav.businesses}</Link>
            <Link to="/bloggers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">V/Blogger</Link>
            <Link to="/whatsapp-groups" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.nav.groups}</Link>
            <Link to="/events" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.nav.events}</Link>
            <Link to="/city-news" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"><Newspaper className="h-3 w-3" />Haberler</Link>
            
            <Link to="/map" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"><MapPin className="h-3 w-3" />{t.nav.map}</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* User Profiles Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Users className="h-4 w-4" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Dashboardlar</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/profile?view=individual" className="flex items-center gap-2 cursor-pointer"><User className="h-3.5 w-3.5 text-primary" />Bireysel Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile?view=consultant" className="flex items-center gap-2 cursor-pointer"><Briefcase className="h-3.5 w-3.5 text-primary" />Danışman Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile?view=business" className="flex items-center gap-2 cursor-pointer"><Briefcase className="h-3.5 w-3.5 text-primary" />İşletme Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile?view=association" className="flex items-center gap-2 cursor-pointer"><Building2 className="h-3.5 w-3.5 text-primary" />Kuruluş Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile?view=blogger" className="flex items-center gap-2 cursor-pointer"><PenLine className="h-3.5 w-3.5 text-primary" />V/Blogger Dashboard</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/profile?view=ambassador" className="flex items-center gap-2 cursor-pointer"><Flag className="h-3.5 w-3.5 text-gold" />Şehir Elçisi Dashboard</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/admin" className="flex items-center gap-2 cursor-pointer"><Shield className="h-3.5 w-3.5 text-destructive" />Admin Dashboard</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <User className="h-4 w-4" />
                    {profile?.full_name || t.nav.profile}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" /> Çıkış
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <LogIn className="h-4 w-4" /> {t.nav.login}
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="default" size="sm">{t.nav.signup}</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border pt-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              {/* Mobile Diaspora Selector */}
              <div className="flex gap-2 mb-2">
                {diasporaOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setDiaspora(opt.key)}
                    className={`text-xl p-1.5 rounded-lg transition-all ${diaspora === opt.key ? "bg-primary/15 ring-2 ring-primary/30 scale-110" : "hover:bg-muted"}`}
                  >
                    {opt.flag}
                  </button>
                ))}
              </div>
              {/* Mobile Country Selector */}
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground mb-2"
              >
                <option value="all">🌍 Tüm Ülkeler</option>
                {countryList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <Link to="/consultants" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>{t.nav.consultants}</Link>
              <Link to="/associations" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>{t.nav.organizations}</Link>
              <Link to="/businesses" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>{t.nav.businesses}</Link>
              <Link to="/bloggers" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1" onClick={() => setIsOpen(false)}><PenLine className="h-3 w-3" />Vlogger / Blogger</Link>
              <Link to="/whatsapp-groups" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>{t.nav.groups}</Link>
              <Link to="/events" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>{t.nav.events}</Link>
              <Link to="/city-news" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1" onClick={() => setIsOpen(false)}><Newspaper className="h-3 w-3" />Haberler</Link>
              
              <Link to="/map" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1" onClick={() => setIsOpen(false)}><MapPin className="h-3 w-3" />{t.nav.map}</Link>
              <div className="border-t border-border pt-3 mt-1">
                {user ? (
                  <>
                    <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-foreground py-1.5" onClick={() => setIsOpen(false)}>
                      <User className="h-4 w-4 text-primary" />
                      {profile?.full_name || t.nav.profile}
                    </Link>
                    <button
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-1.5 w-full"
                      onClick={() => { handleSignOut(); setIsOpen(false); }}
                    >
                      <LogOut className="h-4 w-4" /> Çıkış Yap
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full">{t.nav.login}</Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">{t.nav.signup}</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
