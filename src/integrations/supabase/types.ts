export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cases: {
        Row: {
          address_token: string | null
          agent_version: string | null
          case_number: string
          created_at: string
          decision: string | null
          email_token: string | null
          id: string
          name_token: string | null
          phone_token: string | null
          priority: string | null
          status: string
          trm_evidence: Json | null
          trm_risk_level: string | null
          trm_risk_score: number | null
          updated_at: string
          wallet_address: string
        }
        Insert: {
          address_token?: string | null
          agent_version?: string | null
          case_number: string
          created_at?: string
          decision?: string | null
          email_token?: string | null
          id?: string
          name_token?: string | null
          phone_token?: string | null
          priority?: string | null
          status?: string
          trm_evidence?: Json | null
          trm_risk_level?: string | null
          trm_risk_score?: number | null
          updated_at?: string
          wallet_address: string
        }
        Update: {
          address_token?: string | null
          agent_version?: string | null
          case_number?: string
          created_at?: string
          decision?: string | null
          email_token?: string | null
          id?: string
          name_token?: string | null
          phone_token?: string | null
          priority?: string | null
          status?: string
          trm_evidence?: Json | null
          trm_risk_level?: string | null
          trm_risk_score?: number | null
          updated_at?: string
          wallet_address?: string
        }
        Relationships: []
      }
      compliance_metrics: {
        Row: {
          analyst_access_count: number
          ccpa_compliant: boolean | null
          created_at: string
          data_residency: string | null
          detokenization_requests: number
          gdpr_compliant: boolean | null
          id: string
          metric_date: string
          tokenization_percentage: number | null
          tokenized_fields: number
          total_pii_fields: number
        }
        Insert: {
          analyst_access_count?: number
          ccpa_compliant?: boolean | null
          created_at?: string
          data_residency?: string | null
          detokenization_requests?: number
          gdpr_compliant?: boolean | null
          id?: string
          metric_date?: string
          tokenization_percentage?: number | null
          tokenized_fields?: number
          total_pii_fields?: number
        }
        Update: {
          analyst_access_count?: number
          ccpa_compliant?: boolean | null
          created_at?: string
          data_residency?: string | null
          detokenization_requests?: number
          gdpr_compliant?: boolean | null
          id?: string
          metric_date?: string
          tokenization_percentage?: number | null
          tokenized_fields?: number
          total_pii_fields?: number
        }
        Relationships: []
      }
      demo_comparison: {
        Row: {
          created_at: string
          id: string
          raw_address: string | null
          raw_email: string | null
          raw_name: string | null
          raw_phone: string | null
          scenario_name: string
          tokenized_address: string | null
          tokenized_email: string | null
          tokenized_name: string | null
          tokenized_phone: string | null
          trm_risk_score: number | null
          wallet_address: string
        }
        Insert: {
          created_at?: string
          id?: string
          raw_address?: string | null
          raw_email?: string | null
          raw_name?: string | null
          raw_phone?: string | null
          scenario_name: string
          tokenized_address?: string | null
          tokenized_email?: string | null
          tokenized_name?: string | null
          tokenized_phone?: string | null
          trm_risk_score?: number | null
          wallet_address: string
        }
        Update: {
          created_at?: string
          id?: string
          raw_address?: string | null
          raw_email?: string | null
          raw_name?: string | null
          raw_phone?: string | null
          scenario_name?: string
          tokenized_address?: string | null
          tokenized_email?: string | null
          tokenized_name?: string | null
          tokenized_phone?: string | null
          trm_risk_score?: number | null
          wallet_address?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
