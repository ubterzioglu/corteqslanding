export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type AdvisorProfileLinkTable = {
  Row: {
    added_by: "UBT" | "Burak" | "Diğer";
    contacted_email: boolean;
    contacted_instagram: boolean;
    contacted_phone: boolean;
    contacted_whatsapp: boolean;
    created_at: string;
    description: string | null;
    email: string | null;
    id: string;
    instagram: string | null;
    link: string | null;
    name: string;
    phone: string | null;
    platform:
      | "Instagram"
      | "LinkedIn"
      | "Twitter (X)"
      | "YouTube"
      | "TikTok"
      | "Facebook"
      | "Reddit"
      | "Discord"
      | "Diğer";
    whatsapp: string | null;
  };
  Insert: {
    added_by?: "UBT" | "Burak" | "Diğer";
    contacted_email?: boolean;
    contacted_instagram?: boolean;
    contacted_phone?: boolean;
    contacted_whatsapp?: boolean;
    created_at?: string;
    description?: string | null;
    email?: string | null;
    id?: string;
    instagram?: string | null;
    link?: string | null;
    name?: string;
    phone?: string | null;
    platform?:
      | "Instagram"
      | "LinkedIn"
      | "Twitter (X)"
      | "YouTube"
      | "TikTok"
      | "Facebook"
      | "Reddit"
      | "Discord"
      | "Diğer";
    whatsapp?: string | null;
  };
  Update: {
    added_by?: "UBT" | "Burak" | "Diğer";
    contacted_email?: boolean;
    contacted_instagram?: boolean;
    contacted_phone?: boolean;
    contacted_whatsapp?: boolean;
    created_at?: string;
    description?: string | null;
    email?: string | null;
    id?: string;
    instagram?: string | null;
    link?: string | null;
    name?: string;
    phone?: string | null;
    platform?:
      | "Instagram"
      | "LinkedIn"
      | "Twitter (X)"
      | "YouTube"
      | "TikTok"
      | "Facebook"
      | "Reddit"
      | "Discord"
      | "Diğer";
    whatsapp?: string | null;
  };
  Relationships: [];
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      advisor_social_media_links: {
        Row: {
          added_by: "UBT" | "Burak" | "Diğer";
          contacted_email: boolean;
          contacted_instagram: boolean;
          contacted_phone: boolean;
          contacted_whatsapp: boolean;
          created_at: string;
          description: string | null;
          email: string | null;
          id: string;
          instagram: string | null;
          link: string | null;
          name: string;
          phone: string | null;
          platform:
            | "Instagram"
            | "LinkedIn"
            | "Twitter (X)"
            | "YouTube"
            | "TikTok"
            | "Facebook"
            | "Reddit"
            | "Discord"
            | "Diğer";
          whatsapp: string | null;
        };
        Insert: {
          added_by?: "UBT" | "Burak" | "Diğer";
          contacted_email?: boolean;
          contacted_instagram?: boolean;
          contacted_phone?: boolean;
          contacted_whatsapp?: boolean;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          id?: string;
          instagram?: string | null;
          link?: string | null;
          name?: string;
          phone?: string | null;
          platform?:
            | "Instagram"
            | "LinkedIn"
            | "Twitter (X)"
            | "YouTube"
            | "TikTok"
            | "Facebook"
            | "Reddit"
            | "Discord"
            | "Diğer";
          whatsapp?: string | null;
        };
        Update: {
          added_by?: "UBT" | "Burak" | "Diğer";
          contacted_email?: boolean;
          contacted_instagram?: boolean;
          contacted_phone?: boolean;
          contacted_whatsapp?: boolean;
          created_at?: string;
          description?: string | null;
          email?: string | null;
          id?: string;
          instagram?: string | null;
          link?: string | null;
          name?: string;
          phone?: string | null;
          platform?:
            | "Instagram"
            | "LinkedIn"
            | "Twitter (X)"
            | "YouTube"
            | "TikTok"
            | "Facebook"
            | "Reddit"
            | "Discord"
            | "Diğer";
          whatsapp?: string | null;
        };
        Relationships: [];
      };
      consultant_social_media_links: AdvisorProfileLinkTable;
      contributor_social_media_links: AdvisorProfileLinkTable;
      expenses: {
        Row: {
          amount: number;
          category: Database["public"]["Enums"]["expense_category"];
          created_at: string;
          created_by: string | null;
          currency: Database["public"]["Enums"]["currency_code"];
          description: string;
          expense_date: string;
          id: string;
          invoice_url: string | null;
          is_virtual_card: boolean;
          note: string | null;
          payment_method: Database["public"]["Enums"]["payment_method"] | null;
          person: Database["public"]["Enums"]["person_type"];
          status: Database["public"]["Enums"]["expense_status"];
          updated_at: string;
        };
        Insert: {
          amount: number;
          category: Database["public"]["Enums"]["expense_category"];
          created_at?: string;
          created_by?: string | null;
          currency?: Database["public"]["Enums"]["currency_code"];
          description: string;
          expense_date: string;
          id?: string;
          invoice_url?: string | null;
          is_virtual_card?: boolean;
          note?: string | null;
          payment_method?: Database["public"]["Enums"]["payment_method"] | null;
          person: Database["public"]["Enums"]["person_type"];
          status?: Database["public"]["Enums"]["expense_status"];
          updated_at?: string;
        };
        Update: {
          amount?: number;
          category?: Database["public"]["Enums"]["expense_category"];
          created_at?: string;
          created_by?: string | null;
          currency?: Database["public"]["Enums"]["currency_code"];
          description?: string;
          expense_date?: string;
          id?: string;
          invoice_url?: string | null;
          is_virtual_card?: boolean;
          note?: string | null;
          payment_method?: Database["public"]["Enums"]["payment_method"] | null;
          person?: Database["public"]["Enums"]["person_type"];
          status?: Database["public"]["Enums"]["expense_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      incomes: {
        Row: {
          amount: number;
          category: Database["public"]["Enums"]["income_category"];
          created_at: string;
          created_by: string | null;
          currency: Database["public"]["Enums"]["currency_code"];
          description: string;
          id: string;
          income_date: string;
          link: string | null;
          note: string | null;
          source: string;
          status: Database["public"]["Enums"]["income_status"];
          updated_at: string;
        };
        Insert: {
          amount: number;
          category: Database["public"]["Enums"]["income_category"];
          created_at?: string;
          created_by?: string | null;
          currency?: Database["public"]["Enums"]["currency_code"];
          description: string;
          id?: string;
          income_date: string;
          link?: string | null;
          note?: string | null;
          source: string;
          status?: Database["public"]["Enums"]["income_status"];
          updated_at?: string;
        };
        Update: {
          amount?: number;
          category?: Database["public"]["Enums"]["income_category"];
          created_at?: string;
          created_by?: string | null;
          currency?: Database["public"]["Enums"]["currency_code"];
          description?: string;
          id?: string;
          income_date?: string;
          link?: string | null;
          note?: string | null;
          source?: string;
          status?: Database["public"]["Enums"]["income_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      influencer_social_media_links: AdvisorProfileLinkTable;
      marquee_items: {
        Row: {
          created_at: string;
          detail_content: string | null;
          id: string;
          image_alt: string | null;
          image_url: string | null;
          is_active: boolean;
          link_enabled: boolean;
          metric_value: string | null;
          published_at: string;
          slug: string | null;
          sort_order: number;
          summary: string;
          title: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          detail_content?: string | null;
          id?: string;
          image_alt?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          link_enabled?: boolean;
          metric_value?: string | null;
          published_at?: string;
          slug?: string | null;
          sort_order?: number;
          summary: string;
          title: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          detail_content?: string | null;
          id?: string;
          image_alt?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          link_enabled?: boolean;
          metric_value?: string | null;
          published_at?: string;
          slug?: string | null;
          sort_order?: number;
          summary?: string;
          title?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      referral_sources: {
        Row: {
          code: string;
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
        };
        Relationships: [];
      };
      social_media_links: {
        Row: {
          added_by: "UBT" | "Burak" | "Diğer";
          created_at: string;
          description: string | null;
          id: string;
          link: string | null;
          platform:
            | "Instagram"
            | "LinkedIn"
            | "Twitter (X)"
            | "YouTube"
            | "TikTok"
            | "Facebook"
            | "Reddit"
            | "Discord"
            | "Diğer";
        };
        Insert: {
          added_by?: "UBT" | "Burak" | "Diğer";
          created_at?: string;
          description?: string | null;
          id?: string;
          link?: string | null;
          platform?:
            | "Instagram"
            | "LinkedIn"
            | "Twitter (X)"
            | "YouTube"
            | "TikTok"
            | "Facebook"
            | "Reddit"
            | "Discord"
            | "Diğer";
        };
        Update: {
          added_by?: "UBT" | "Burak" | "Diğer";
          created_at?: string;
          description?: string | null;
          id?: string;
          link?: string | null;
          platform?:
            | "Instagram"
            | "LinkedIn"
            | "Twitter (X)"
            | "YouTube"
            | "TikTok"
            | "Facebook"
            | "Reddit"
            | "Discord"
            | "Diğer";
        };
        Relationships: [];
      };
      referral_groups: {
        Row: {
          code: string;
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
        };
        Relationships: [];
      };
      referral_types: {
        Row: {
          code: string;
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
        };
        Relationships: [];
      };
      referral_codes: {
        Row: {
          code: string;
          created_at: string;
          created_by: string | null;
          group_code: string;
          group_id: string;
          id: string;
          is_active: boolean;
          is_used: boolean;
          month_num: number;
          note: string | null;
          random_part: string;
          source_code: string;
          source_id: string;
          type_code: string;
          type_id: string;
          used_at: string | null;
          usage_count: number;
          valid_from: string;
          valid_until: string;
          year_short: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          created_by?: string | null;
          group_code: string;
          group_id: string;
          id?: string;
          is_active?: boolean;
          is_used?: boolean;
          month_num: number;
          note?: string | null;
          random_part: string;
          source_code: string;
          source_id: string;
          type_code: string;
          type_id: string;
          used_at?: string | null;
          usage_count?: number;
          valid_from: string;
          valid_until: string;
          year_short: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          created_by?: string | null;
          group_code?: string;
          group_id?: string;
          id?: string;
          is_active?: boolean;
          is_used?: boolean;
          month_num?: number;
          note?: string | null;
          random_part?: string;
          source_code?: string;
          source_id?: string;
          type_code?: string;
          type_id?: string;
          used_at?: string | null;
          usage_count?: number;
          valid_from?: string;
          valid_until?: string;
          year_short?: string;
        };
        Relationships: [
          {
            foreignKeyName: "referral_codes_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "admin_users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "referral_codes_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "referral_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "referral_codes_source_id_fkey";
            columns: ["source_id"];
            isOneToOne: false;
            referencedRelation: "referral_sources";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "referral_codes_type_id_fkey";
            columns: ["type_id"];
            isOneToOne: false;
            referencedRelation: "referral_types";
            referencedColumns: ["id"];
          },
        ];
      };
      referral_code_usages: {
        Row: {
          email: string | null;
          full_name: string | null;
          id: string;
          referral_code_id: string;
          submission_id: string;
          used_at: string;
        };
        Insert: {
          email?: string | null;
          full_name?: string | null;
          id?: string;
          referral_code_id: string;
          submission_id: string;
          used_at?: string;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          id?: string;
          referral_code_id?: string;
          submission_id?: string;
          used_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "referral_code_usages_referral_code_id_fkey";
            columns: ["referral_code_id"];
            isOneToOne: false;
            referencedRelation: "referral_codes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "referral_code_usages_submission_id_fkey";
            columns: ["submission_id"];
            isOneToOne: false;
            referencedRelation: "submissions";
            referencedColumns: ["id"];
          },
        ];
      };
      submissions: {
        Row: {
          business: string | null;
          category: string | null;
          city: string;
          company_name: string | null;
          contact_email_reached: boolean;
          contact_instagram_reached: boolean;
          contact_phone_reached: boolean;
          contact_whatsapp_reached: boolean;
          consent: boolean;
          contest_interest: boolean | null;
          country: string;
          created_at: string;
          description: string | null;
          document_name: string | null;
          document_url: string | null;
          documents: Json;
          donation_amount: number | null;
          donation_currency: string | null;
          email: string;
          facebook: string | null;
          field: string;
          form_type: string;
          fullname: string;
          id: string;
          instagram: string | null;
          linkedin: string | null;
          notes: string | null;
          offers_needs: string | null;
          phone: string;
          referral_code: string | null;
          referral_code_id: string | null;
          referral_detail: string | null;
          referral_source: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          source_type: "form" | "chatbot";
          status: string;
          tiktok: string | null;
          twitter: string | null;
          whatsapp_interest: boolean | null;
          website: string | null;
        };
        Insert: {
          business?: string | null;
          category?: string | null;
          city: string;
          company_name?: string | null;
          contact_email_reached?: boolean;
          contact_instagram_reached?: boolean;
          contact_phone_reached?: boolean;
          contact_whatsapp_reached?: boolean;
          consent?: boolean;
          contest_interest?: boolean | null;
          country: string;
          created_at?: string;
          description?: string | null;
          document_name?: string | null;
          document_url?: string | null;
          documents?: Json;
          donation_amount?: number | null;
          donation_currency?: string | null;
          email: string;
          facebook?: string | null;
          field: string;
          form_type?: string;
          fullname: string;
          id?: string;
          instagram?: string | null;
          linkedin?: string | null;
          notes?: string | null;
          offers_needs?: string | null;
          phone: string;
          referral_code?: string | null;
          referral_code_id?: string | null;
          referral_detail?: string | null;
          referral_source?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          source_type?: "form" | "chatbot";
          status?: string;
          tiktok?: string | null;
          twitter?: string | null;
          whatsapp_interest?: boolean | null;
          website?: string | null;
        };
        Update: {
          business?: string | null;
          category?: string | null;
          city?: string;
          company_name?: string | null;
          contact_email_reached?: boolean;
          contact_instagram_reached?: boolean;
          contact_phone_reached?: boolean;
          contact_whatsapp_reached?: boolean;
          consent?: boolean;
          contest_interest?: boolean | null;
          country?: string;
          created_at?: string;
          description?: string | null;
          document_name?: string | null;
          document_url?: string | null;
          documents?: Json;
          donation_amount?: number | null;
          donation_currency?: string | null;
          email?: string;
          facebook?: string | null;
          field?: string;
          form_type?: string;
          fullname?: string;
          id?: string;
          instagram?: string | null;
          linkedin?: string | null;
          notes?: string | null;
          offers_needs?: string | null;
          phone?: string;
          referral_code?: string | null;
          referral_code_id?: string | null;
          referral_detail?: string | null;
          referral_source?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          source_type?: "form" | "chatbot";
          status?: string;
          tiktok?: string | null;
          twitter?: string | null;
          whatsapp_interest?: boolean | null;
          website?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "submissions_reviewed_by_fkey";
            columns: ["reviewed_by"];
            isOneToOne: false;
            referencedRelation: "admin_users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "submissions_referral_code_id_fkey";
            columns: ["referral_code_id"];
            isOneToOne: false;
            referencedRelation: "referral_codes";
            referencedColumns: ["id"];
          },
        ];
      };
      wa_users: {
        Row: {
          category: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          current_step: string | null;
          discovery_source: string | null;
          email: string | null;
          funnel_interest: string | null;
          id: string;
          name: string | null;
          note: string | null;
          occupation_interest: string | null;
          organization: string | null;
          phone: string | null;
          privacy_consent: boolean | null;
          referral_code: string | null;
          registration_completed_at: string | null;
          registration_status: string | null;
          source_type: "wa";
          surname: string | null;
          updated_at: string | null;
          wa_id: string | null;
          whatsapp_group_interest: boolean | null;
        };
        Insert: {
          category?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          current_step?: string | null;
          discovery_source?: string | null;
          email?: string | null;
          funnel_interest?: string | null;
          id?: string;
          name?: string | null;
          note?: string | null;
          occupation_interest?: string | null;
          organization?: string | null;
          phone?: string | null;
          privacy_consent?: boolean | null;
          referral_code?: string | null;
          registration_completed_at?: string | null;
          registration_status?: string | null;
          source_type?: "wa";
          surname?: string | null;
          updated_at?: string | null;
          wa_id?: string | null;
          whatsapp_group_interest?: boolean | null;
        };
        Update: {
          category?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          current_step?: string | null;
          discovery_source?: string | null;
          email?: string | null;
          funnel_interest?: string | null;
          id?: string;
          name?: string | null;
          note?: string | null;
          occupation_interest?: string | null;
          organization?: string | null;
          phone?: string | null;
          privacy_consent?: boolean | null;
          referral_code?: string | null;
          registration_completed_at?: string | null;
          registration_status?: string | null;
          source_type?: "wa";
          surname?: string | null;
          updated_at?: string | null;
          wa_id?: string | null;
          whatsapp_group_interest?: boolean | null;
        };
        Relationships: [];
      };
      matches: {
        Row: {
          created_at: string;
          id: string;
          match_reason: string | null;
          match_score: number | null;
          match_type: string;
          matched_submission_id: string;
          notified_source: boolean;
          notified_target: boolean;
          source_submission_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          match_reason?: string | null;
          match_score?: number | null;
          match_type?: string;
          matched_submission_id: string;
          notified_source?: boolean;
          notified_target?: boolean;
          source_submission_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          match_reason?: string | null;
          match_score?: number | null;
          match_type?: string;
          matched_submission_id?: string;
          notified_source?: boolean;
          notified_target?: boolean;
          source_submission_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matches_matched_submission_id_fkey";
            columns: ["matched_submission_id"];
            isOneToOne: false;
            referencedRelation: "submissions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_source_submission_id_fkey";
            columns: ["source_submission_id"];
            isOneToOne: false;
            referencedRelation: "submissions";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      v_muhasebe_by_category: {
        Row: {
          category: Database["public"]["Enums"]["expense_category"] | null;
          record_count: number | null;
          total_try: number | null;
        };
        Relationships: [];
      };
      v_muhasebe_by_person: {
        Row: {
          paid_try: number | null;
          pending_try: number | null;
          person: Database["public"]["Enums"]["person_type"] | null;
          record_count: number | null;
          total_try: number | null;
        };
        Relationships: [];
      };
      v_muhasebe_cashflow_monthly: {
        Row: {
          baris_try: number | null;
          burak_try: number | null;
          expense_paid_try: number | null;
          expense_pending_try: number | null;
          expense_try: number | null;
          income_collected_try: number | null;
          income_pending_try: number | null;
          income_try: number | null;
          month_num: number | null;
          net_try: number | null;
          ortak_try: number | null;
          year_num: number | null;
        };
        Relationships: [];
      };
      v_muhasebe_kpi: {
        Row: {
          net_position_try: number | null;
          pending_expense_try: number | null;
          pending_income_try: number | null;
          total_expense_try: number | null;
          total_income_try: number | null;
          total_records: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      validate_and_bind_referral_code: {
        Args: { input_code: string; reference_time?: string };
        Returns: {
          group_code: string | null;
          message: string | null;
          normalized_code: string | null;
          referral_code_id: string | null;
          source_code: string | null;
          status: string | null;
          type_code: string | null;
          valid_from: string | null;
          valid_until: string | null;
        }[];
      };
    };
    Enums: {
      currency_code: "TRY" | "USD" | "EUR" | "GBP" | "QAR";
      expense_category:
        | "yazilim_araclar"
        | "hosting_sunucu"
        | "alan_adi_ssl"
        | "pazarlama_reklam"
        | "hukuki_danismanlik"
        | "muhasebe_finans"
        | "seyahat_ulasim"
        | "ofis_kirtasiye"
        | "maas_ucret"
        | "esop_hisse"
        | "banka_komisyon"
        | "diger_gider";
      expense_status: "odendi" | "bekliyor" | "iptal";
      income_category:
        | "pilot_gelir"
        | "danismanlik_geliri"
        | "hibe_grant"
        | "yatirim_taahhudu"
        | "demo_geliri"
        | "diger_gelir";
      income_status: "tahsil_edildi" | "bekliyor" | "iptal";
      payment_method:
        | "sanal_kart_burak"
        | "sanal_kart_baris"
        | "kisisel_kart_burak"
        | "kisisel_kart_baris"
        | "havale_eft"
        | "nakit"
        | "diger";
      person_type: "burak" | "baris" | "ortak";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer Row;
    }
    ? Row
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer Row;
      }
      ? Row
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer Insert;
    }
    ? Insert
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer Insert;
      }
      ? Insert
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer Update;
    }
    ? Update
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer Update;
      }
      ? Update
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
