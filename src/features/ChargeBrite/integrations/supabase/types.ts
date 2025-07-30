export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_compliance_records: {
        Row: {
          audit_bureau: Database["public"]["Enums"]["audit_bureau_type"]
          audit_findings: Json | null
          audit_period_end: string
          audit_period_start: string
          auditor_notes: string | null
          business_unit: string | null
          certification_date: string | null
          circulation_claimed: number | null
          circulation_verified: number | null
          compliance_status: string | null
          corrective_actions: Json | null
          created_at: string | null
          id: string
          next_audit_due: string | null
          product_name: string | null
          subscription_id: string | null
          updated_at: string | null
          variance_percentage: number | null
        }
        Insert: {
          audit_bureau: Database["public"]["Enums"]["audit_bureau_type"]
          audit_findings?: Json | null
          audit_period_end: string
          audit_period_start: string
          auditor_notes?: string | null
          business_unit?: string | null
          certification_date?: string | null
          circulation_claimed?: number | null
          circulation_verified?: number | null
          compliance_status?: string | null
          corrective_actions?: Json | null
          created_at?: string | null
          id?: string
          next_audit_due?: string | null
          product_name?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          variance_percentage?: number | null
        }
        Update: {
          audit_bureau?: Database["public"]["Enums"]["audit_bureau_type"]
          audit_findings?: Json | null
          audit_period_end?: string
          audit_period_start?: string
          auditor_notes?: string | null
          business_unit?: string | null
          certification_date?: string | null
          circulation_claimed?: number | null
          circulation_verified?: number | null
          compliance_status?: string | null
          corrective_actions?: Json | null
          created_at?: string | null
          id?: string
          next_audit_due?: string | null
          product_name?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          variance_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_compliance_records_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "media_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_compliance_records_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "saas_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_compliance_records_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          changed_fields: string[] | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          notes: string | null
          old_values: Json | null
          operation: Database["public"]["Enums"]["change_operation"]
          record_id: string
          session_id: string | null
          table_name: string
          timestamp: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          changed_fields?: string[] | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          notes?: string | null
          old_values?: Json | null
          operation: Database["public"]["Enums"]["change_operation"]
          record_id: string
          session_id?: string | null
          table_name: string
          timestamp?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          changed_fields?: string[] | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          notes?: string | null
          old_values?: Json | null
          operation?: Database["public"]["Enums"]["change_operation"]
          record_id?: string
          session_id?: string | null
          table_name?: string
          timestamp?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      circulation_aggregates: {
        Row: {
          audit_bureau: Database["public"]["Enums"]["audit_bureau_type"]
          audit_period_end: string
          audit_period_start: string
          calculated_at: string | null
          controlled_circulation: number | null
          created_at: string | null
          digital_circulation: number | null
          geographic_breakdown: Json | null
          id: string
          industry_breakdown: Json | null
          paid_circulation: number | null
          publication_id: string | null
          qualified_circulation: number | null
          total_circulation: number | null
          updated_at: string | null
          verification_method: string | null
        }
        Insert: {
          audit_bureau: Database["public"]["Enums"]["audit_bureau_type"]
          audit_period_end: string
          audit_period_start: string
          calculated_at?: string | null
          controlled_circulation?: number | null
          created_at?: string | null
          digital_circulation?: number | null
          geographic_breakdown?: Json | null
          id?: string
          industry_breakdown?: Json | null
          paid_circulation?: number | null
          publication_id?: string | null
          qualified_circulation?: number | null
          total_circulation?: number | null
          updated_at?: string | null
          verification_method?: string | null
        }
        Update: {
          audit_bureau?: Database["public"]["Enums"]["audit_bureau_type"]
          audit_period_end?: string
          audit_period_start?: string
          calculated_at?: string | null
          controlled_circulation?: number | null
          created_at?: string | null
          digital_circulation?: number | null
          geographic_breakdown?: Json | null
          id?: string
          industry_breakdown?: Json | null
          paid_circulation?: number | null
          publication_id?: string | null
          qualified_circulation?: number | null
          total_circulation?: number | null
          updated_at?: string | null
          verification_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "circulation_aggregates_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "circulation_summary"
            referencedColumns: ["publication_id"]
          },
          {
            foreignKeyName: "circulation_aggregates_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      circulation_verifications: {
        Row: {
          audit_bureau: Database["public"]["Enums"]["audit_bureau_type"] | null
          created_at: string | null
          id: string
          subscription_id: string | null
          verification_date: string
          verification_details: Json | null
          verification_method: string
          verification_result: boolean
          verified_by: string | null
        }
        Insert: {
          audit_bureau?: Database["public"]["Enums"]["audit_bureau_type"] | null
          created_at?: string | null
          id?: string
          subscription_id?: string | null
          verification_date: string
          verification_details?: Json | null
          verification_method: string
          verification_result: boolean
          verified_by?: string | null
        }
        Update: {
          audit_bureau?: Database["public"]["Enums"]["audit_bureau_type"] | null
          created_at?: string | null
          id?: string
          subscription_id?: string | null
          verification_date?: string
          verification_details?: Json | null
          verification_method?: string
          verification_result?: boolean
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "circulation_verifications_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "media_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circulation_verifications_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "saas_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circulation_verifications_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      data_quality_checks: {
        Row: {
          check_name: string | null
          check_type: string
          created_at: string | null
          current_value: number | null
          description: string | null
          id: string
          last_run_at: string | null
          sql_check: string | null
          status: string | null
          table_name: string
          threshold_value: number | null
        }
        Insert: {
          check_name?: string | null
          check_type: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          last_run_at?: string | null
          sql_check?: string | null
          status?: string | null
          table_name: string
          threshold_value?: number | null
        }
        Update: {
          check_name?: string | null
          check_type?: string
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          id?: string
          last_run_at?: string | null
          sql_check?: string | null
          status?: string | null
          table_name?: string
          threshold_value?: number | null
        }
        Relationships: []
      }
      generated_reports: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          business_unit: string | null
          created_at: string | null
          download_count: number | null
          expires_at: string | null
          file_path: string | null
          file_size_bytes: number | null
          generated_by: string | null
          id: string
          parameters_used: Json | null
          product_name: string | null
          publication_date: string | null
          report_name: string
          report_period_end: string | null
          report_period_start: string | null
          status: Database["public"]["Enums"]["report_status"] | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          business_unit?: string | null
          created_at?: string | null
          download_count?: number | null
          expires_at?: string | null
          file_path?: string | null
          file_size_bytes?: number | null
          generated_by?: string | null
          id?: string
          parameters_used?: Json | null
          product_name?: string | null
          publication_date?: string | null
          report_name: string
          report_period_end?: string | null
          report_period_start?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          business_unit?: string | null
          created_at?: string | null
          download_count?: number | null
          expires_at?: string | null
          file_path?: string | null
          file_size_bytes?: number | null
          generated_by?: string | null
          id?: string
          parameters_used?: Json | null
          product_name?: string | null
          publication_date?: string | null
          report_name?: string
          report_period_end?: string | null
          report_period_start?: string | null
          status?: Database["public"]["Enums"]["report_status"] | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates_by_company"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          resource: string
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          resource: string
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          resource?: string
        }
        Relationships: []
      }
      postal_compliance: {
        Row: {
          address_validation_status: string | null
          compliance_notes: string | null
          compliance_verified: boolean | null
          created_at: string | null
          delivery_route: string | null
          expiry_date: string | null
          id: string
          periodical_permit: string | null
          postal_service: string
          postal_zone: string | null
          qualification_type: string | null
          subscription_id: string | null
          updated_at: string | null
          verification_date: string | null
        }
        Insert: {
          address_validation_status?: string | null
          compliance_notes?: string | null
          compliance_verified?: boolean | null
          created_at?: string | null
          delivery_route?: string | null
          expiry_date?: string | null
          id?: string
          periodical_permit?: string | null
          postal_service: string
          postal_zone?: string | null
          qualification_type?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          verification_date?: string | null
        }
        Update: {
          address_validation_status?: string | null
          compliance_notes?: string | null
          compliance_verified?: boolean | null
          created_at?: string | null
          delivery_route?: string | null
          expiry_date?: string | null
          id?: string
          periodical_permit?: string | null
          postal_service?: string
          postal_zone?: string | null
          qualification_type?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          verification_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "postal_compliance_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "media_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postal_compliance_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "saas_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postal_compliance_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      postal_compliance_tracking: {
        Row: {
          address_verification_date: string | null
          compliance_notes: string | null
          compliance_period_end: string
          compliance_period_start: string
          created_at: string | null
          delivery_method: string | null
          id: string
          permit_number: string | null
          postal_zone: string | null
          publication_id: string | null
          qualification_status: string | null
          subscription_id: string | null
          updated_at: string | null
          usps_form_submitted: boolean | null
        }
        Insert: {
          address_verification_date?: string | null
          compliance_notes?: string | null
          compliance_period_end: string
          compliance_period_start: string
          created_at?: string | null
          delivery_method?: string | null
          id?: string
          permit_number?: string | null
          postal_zone?: string | null
          publication_id?: string | null
          qualification_status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          usps_form_submitted?: boolean | null
        }
        Update: {
          address_verification_date?: string | null
          compliance_notes?: string | null
          compliance_period_end?: string
          compliance_period_start?: string
          created_at?: string | null
          delivery_method?: string | null
          id?: string
          permit_number?: string | null
          postal_zone?: string | null
          publication_id?: string | null
          qualification_status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
          usps_form_submitted?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "postal_compliance_tracking_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "circulation_summary"
            referencedColumns: ["publication_id"]
          },
          {
            foreignKeyName: "postal_compliance_tracking_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postal_compliance_tracking_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "media_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postal_compliance_tracking_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "saas_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postal_compliance_tracking_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      publications: {
        Row: {
          active: boolean | null
          audit_bureau: Database["public"]["Enums"]["audit_bureau_type"] | null
          business_unit: string | null
          category: string | null
          circulation_target: number | null
          company_type: string | null
          created_at: string | null
          format: string | null
          frequency: string | null
          id: string
          isbn: string | null
          issn: string | null
          metadata: Json | null
          name: string
          postal_classification: string | null
          product_name: string | null
          publication_code: string | null
          publisher_name: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          audit_bureau?: Database["public"]["Enums"]["audit_bureau_type"] | null
          business_unit?: string | null
          category?: string | null
          circulation_target?: number | null
          company_type?: string | null
          created_at?: string | null
          format?: string | null
          frequency?: string | null
          id?: string
          isbn?: string | null
          issn?: string | null
          metadata?: Json | null
          name: string
          postal_classification?: string | null
          product_name?: string | null
          publication_code?: string | null
          publisher_name?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          audit_bureau?: Database["public"]["Enums"]["audit_bureau_type"] | null
          business_unit?: string | null
          category?: string | null
          circulation_target?: number | null
          company_type?: string | null
          created_at?: string | null
          format?: string | null
          frequency?: string | null
          id?: string
          isbn?: string | null
          issn?: string | null
          metadata?: Json | null
          name?: string
          postal_classification?: string | null
          product_name?: string | null
          publication_code?: string | null
          publisher_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      report_schedules: {
        Row: {
          auto_submit: boolean | null
          created_at: string | null
          created_by: string | null
          day_of_month: number | null
          email_recipients: string[] | null
          enabled: boolean | null
          frequency: string
          id: string
          last_run_date: string | null
          month_of_quarter: number | null
          next_run_date: string | null
          publication_id: string | null
          schedule_name: string
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          auto_submit?: boolean | null
          created_at?: string | null
          created_by?: string | null
          day_of_month?: number | null
          email_recipients?: string[] | null
          enabled?: boolean | null
          frequency: string
          id?: string
          last_run_date?: string | null
          month_of_quarter?: number | null
          next_run_date?: string | null
          publication_id?: string | null
          schedule_name: string
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_submit?: boolean | null
          created_at?: string | null
          created_by?: string | null
          day_of_month?: number | null
          email_recipients?: string[] | null
          enabled?: boolean | null
          frequency?: string
          id?: string
          last_run_date?: string | null
          month_of_quarter?: number | null
          next_run_date?: string | null
          publication_id?: string | null
          schedule_name?: string
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_schedules_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "circulation_summary"
            referencedColumns: ["publication_id"]
          },
          {
            foreignKeyName: "report_schedules_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_schedules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "report_schedules_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates_by_company"
            referencedColumns: ["id"]
          },
        ]
      }
      report_templates: {
        Row: {
          applicable_company_types: string[] | null
          audit_bureau: Database["public"]["Enums"]["audit_bureau_type"] | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_system_template: boolean | null
          name: string
          output_format: string | null
          parameters: Json | null
          sql_query: string | null
          template_config: Json
          template_type: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          applicable_company_types?: string[] | null
          audit_bureau?: Database["public"]["Enums"]["audit_bureau_type"] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          name: string
          output_format?: string | null
          parameters?: Json | null
          sql_query?: string | null
          template_config: Json
          template_type?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          applicable_company_types?: string[] | null
          audit_bureau?: Database["public"]["Enums"]["audit_bureau_type"] | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_system_template?: boolean | null
          name?: string
          output_format?: string | null
          parameters?: Json | null
          sql_query?: string | null
          template_config?: Json
          template_type?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: string
          permission_id: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          id?: string
          permission_id?: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          id?: string
          permission_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          billing_address: Json | null
          company_name: string | null
          created_at: string | null
          data_source: string | null
          date_of_birth: string | null
          email: string
          external_id: string | null
          first_name: string | null
          gdpr_consent: boolean | null
          gender: string | null
          id: string
          industry: string | null
          last_name: string | null
          mailing_address: Json | null
          marketing_consent: boolean | null
          occupation: string | null
          phone: string | null
          preferences: Json | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          billing_address?: Json | null
          company_name?: string | null
          created_at?: string | null
          data_source?: string | null
          date_of_birth?: string | null
          email: string
          external_id?: string | null
          first_name?: string | null
          gdpr_consent?: boolean | null
          gender?: string | null
          id?: string
          industry?: string | null
          last_name?: string | null
          mailing_address?: Json | null
          marketing_consent?: boolean | null
          occupation?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          billing_address?: Json | null
          company_name?: string | null
          created_at?: string | null
          data_source?: string | null
          date_of_birth?: string | null
          email?: string
          external_id?: string | null
          first_name?: string | null
          gdpr_consent?: boolean | null
          gender?: string | null
          id?: string
          industry?: string | null
          last_name?: string | null
          mailing_address?: Json | null
          marketing_consent?: boolean | null
          occupation?: string | null
          phone?: string | null
          preferences?: Json | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          features: Json
          id: string
          is_active: boolean | null
          max_seats: number | null
          monthly_price: number | null
          plan_name: string
          plan_tier: string
          publication_id: string | null
          updated_at: string | null
          usage_limits: Json
          yearly_price: number | null
        }
        Insert: {
          created_at?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_seats?: number | null
          monthly_price?: number | null
          plan_name: string
          plan_tier: string
          publication_id?: string | null
          updated_at?: string | null
          usage_limits?: Json
          yearly_price?: number | null
        }
        Update: {
          created_at?: string | null
          features?: Json
          id?: string
          is_active?: boolean | null
          max_seats?: number | null
          monthly_price?: number | null
          plan_name?: string
          plan_tier?: string
          publication_id?: string | null
          updated_at?: string | null
          usage_limits?: Json
          yearly_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_plans_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "circulation_summary"
            referencedColumns: ["publication_id"]
          },
          {
            foreignKeyName: "subscription_plans_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "publications"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          address_verified: boolean | null
          auto_renewal: boolean | null
          base_price: number | null
          billing_cycle: string | null
          cancellation_date: string | null
          circulation_count: number | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          current_price: number | null
          digital_access: boolean | null
          discount_applied: number | null
          end_date: string | null
          external_id: string | null
          feature_access: Json | null
          id: string
          mrr: number | null
          overage_billing: boolean | null
          payment_method: string | null
          plan_name: string | null
          postal_qualification: boolean | null
          print_delivery: boolean | null
          product_id: string | null
          publication_id: string | null
          renewal_date: string | null
          seat_count: number | null
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          subscriber_id: string
          subscription_tier: string | null
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          trial_end_date: string | null
          updated_at: string | null
          updated_by: string | null
          usage_limits: Json | null
          usage_metrics: Json | null
        }
        Insert: {
          address_verified?: boolean | null
          auto_renewal?: boolean | null
          base_price?: number | null
          billing_cycle?: string | null
          cancellation_date?: string | null
          circulation_count?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          current_price?: number | null
          digital_access?: boolean | null
          discount_applied?: number | null
          end_date?: string | null
          external_id?: string | null
          feature_access?: Json | null
          id?: string
          mrr?: number | null
          overage_billing?: boolean | null
          payment_method?: string | null
          plan_name?: string | null
          postal_qualification?: boolean | null
          print_delivery?: boolean | null
          product_id?: string | null
          publication_id?: string | null
          renewal_date?: string | null
          seat_count?: number | null
          start_date: string
          status?: Database["public"]["Enums"]["subscription_status"]
          subscriber_id: string
          subscription_tier?: string | null
          subscription_type: Database["public"]["Enums"]["subscription_type"]
          trial_end_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
          usage_limits?: Json | null
          usage_metrics?: Json | null
        }
        Update: {
          address_verified?: boolean | null
          auto_renewal?: boolean | null
          base_price?: number | null
          billing_cycle?: string | null
          cancellation_date?: string | null
          circulation_count?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          current_price?: number | null
          digital_access?: boolean | null
          discount_applied?: number | null
          end_date?: string | null
          external_id?: string | null
          feature_access?: Json | null
          id?: string
          mrr?: number | null
          overage_billing?: boolean | null
          payment_method?: string | null
          plan_name?: string | null
          postal_qualification?: boolean | null
          print_delivery?: boolean | null
          product_id?: string | null
          publication_id?: string | null
          renewal_date?: string | null
          seat_count?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          subscriber_id?: string
          subscription_tier?: string | null
          subscription_type?: Database["public"]["Enums"]["subscription_type"]
          trial_end_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
          usage_limits?: Json | null
          usage_metrics?: Json | null
        }
        Relationships: []
      }
      system_events: {
        Row: {
          description: string
          event_category: string | null
          event_type: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          severity: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          description: string
          event_category?: string | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          severity?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          description?: string
          event_category?: string | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          severity?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          first_name: string | null
          id: string
          is_active: boolean | null
          job_title: string | null
          last_login_at: string | null
          last_name: string | null
          phone: string | null
          preferences: Json | null
          timezone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          preferences?: Json | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          last_login_at?: string | null
          last_name?: string | null
          phone?: string | null
          preferences?: Json | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          scope: string | null
          scope_id: string | null
          user_id: string | null
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          scope?: string | null
          scope_id?: string | null
          user_id?: string | null
        }
        Update: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          scope?: string | null
          scope_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      circulation_summary: {
        Row: {
          active_subscriptions: number | null
          audit_bureau: Database["public"]["Enums"]["audit_bureau_type"] | null
          digital_circulation: number | null
          print_circulation: number | null
          publication_id: string | null
          publication_name: string | null
          qualified_circulation: number | null
          total_revenue: number | null
          total_subscriptions: number | null
        }
        Relationships: []
      }
      media_subscriptions: {
        Row: {
          address_verified: boolean | null
          audit_bureau: Database["public"]["Enums"]["audit_bureau_type"] | null
          auto_renewal: boolean | null
          base_price: number | null
          billing_cycle: string | null
          cancellation_date: string | null
          circulation_count: number | null
          circulation_target: number | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          current_price: number | null
          digital_access: boolean | null
          discount_applied: number | null
          end_date: string | null
          external_id: string | null
          feature_access: Json | null
          id: string | null
          mrr: number | null
          overage_billing: boolean | null
          payment_method: string | null
          plan_name: string | null
          postal_qualification: boolean | null
          print_delivery: boolean | null
          product_id: string | null
          publication_id: string | null
          publication_name: string | null
          renewal_date: string | null
          seat_count: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          subscriber_id: string | null
          subscription_tier: string | null
          subscription_type:
            | Database["public"]["Enums"]["subscription_type"]
            | null
          trial_end_date: string | null
          updated_at: string | null
          updated_by: string | null
          usage_limits: Json | null
          usage_metrics: Json | null
        }
        Relationships: []
      }
      report_templates_by_company: {
        Row: {
          applicable_company_types: string[] | null
          audit_bureau: Database["public"]["Enums"]["audit_bureau_type"] | null
          company_type: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string | null
          is_active: boolean | null
          is_applicable: boolean | null
          is_system_template: boolean | null
          name: string | null
          output_format: string | null
          parameters: Json | null
          sql_query: string | null
          template_config: Json | null
          template_type: string | null
          updated_at: string | null
          version: string | null
        }
        Relationships: []
      }
      saas_subscriptions: {
        Row: {
          auto_renewal: boolean | null
          company_type: string | null
          created_at: string | null
          current_price: number | null
          end_date: string | null
          feature_access: Json | null
          id: string | null
          mrr: number | null
          product_id: string | null
          product_name: string | null
          seat_count: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          subscriber_id: string | null
          subscription_tier: string | null
          updated_at: string | null
          usage_limits: Json | null
          usage_metrics: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      audit_bureau_type: "abc" | "bpa" | "vac" | "cac" | "jicwebs"
      change_operation: "INSERT" | "UPDATE" | "DELETE"
      report_status: "draft" | "pending" | "approved" | "published" | "archived"
      subscription_status:
        | "active"
        | "inactive"
        | "cancelled"
        | "suspended"
        | "trial"
        | "expired"
      subscription_type:
        | "saas"
        | "magazine"
        | "newspaper"
        | "digital"
        | "hybrid"
      user_role: "admin" | "auditor" | "manager" | "analyst" | "viewer"
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
    Enums: {
      audit_bureau_type: ["abc", "bpa", "vac", "cac", "jicwebs"],
      change_operation: ["INSERT", "UPDATE", "DELETE"],
      report_status: ["draft", "pending", "approved", "published", "archived"],
      subscription_status: [
        "active",
        "inactive",
        "cancelled",
        "suspended",
        "trial",
        "expired",
      ],
      subscription_type: ["saas", "magazine", "newspaper", "digital", "hybrid"],
      user_role: ["admin", "auditor", "manager", "analyst", "viewer"],
    },
  },
} as const
