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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      broadcast_channels: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_published: boolean | null
          logo_url: string | null
          name: string
          updated_at: string
          watch_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string
          watch_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_published?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string
          watch_url?: string | null
        }
        Relationships: []
      }
      broadcast_stats: {
        Row: {
          created_at: string
          display_order: number | null
          icon: string | null
          id: string
          is_published: boolean | null
          label: string
          suffix: string | null
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_published?: boolean | null
          label: string
          suffix?: string | null
          updated_at?: string
          value?: number
        }
        Update: {
          created_at?: string
          display_order?: number | null
          icon?: string | null
          id?: string
          is_published?: boolean | null
          label?: string
          suffix?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      broadcast_subscribers: {
        Row: {
          country: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          preferences: string[] | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          preferences?: string[] | null
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          preferences?: string[] | null
        }
        Relationships: []
      }
      broadcasts: {
        Row: {
          category: string | null
          chat_enabled: boolean | null
          chat_url: string | null
          created_at: string
          description: string | null
          display_order: number | null
          duration_seconds: number | null
          id: string
          is_featured: boolean | null
          is_live: boolean | null
          is_published: boolean | null
          kind: string
          registration_url: string | null
          reminder_url: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          slug: string | null
          speaker: string | null
          stream_type: string | null
          stream_url: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          viewer_count: number | null
        }
        Insert: {
          category?: string | null
          chat_enabled?: boolean | null
          chat_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration_seconds?: number | null
          id?: string
          is_featured?: boolean | null
          is_live?: boolean | null
          is_published?: boolean | null
          kind?: string
          registration_url?: string | null
          reminder_url?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          slug?: string | null
          speaker?: string | null
          stream_type?: string | null
          stream_url?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          viewer_count?: number | null
        }
        Update: {
          category?: string | null
          chat_enabled?: boolean | null
          chat_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration_seconds?: number | null
          id?: string
          is_featured?: boolean | null
          is_live?: boolean | null
          is_published?: boolean | null
          kind?: string
          registration_url?: string | null
          reminder_url?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          slug?: string | null
          speaker?: string | null
          stream_type?: string | null
          stream_url?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          viewer_count?: number | null
        }
        Relationships: []
      }
      hero_banners: {
        Row: {
          background_image_url: string | null
          created_at: string
          display_order: number
          eyebrow: string | null
          heading: string
          id: string
          is_active: boolean
          overlay_opacity: number | null
          primary_cta_label: string | null
          primary_cta_url: string | null
          secondary_cta_label: string | null
          secondary_cta_url: string | null
          subheading: string | null
          updated_at: string
        }
        Insert: {
          background_image_url?: string | null
          created_at?: string
          display_order?: number
          eyebrow?: string | null
          heading: string
          id?: string
          is_active?: boolean
          overlay_opacity?: number | null
          primary_cta_label?: string | null
          primary_cta_url?: string | null
          secondary_cta_label?: string | null
          secondary_cta_url?: string | null
          subheading?: string | null
          updated_at?: string
        }
        Update: {
          background_image_url?: string | null
          created_at?: string
          display_order?: number
          eyebrow?: string | null
          heading?: string
          id?: string
          is_active?: boolean
          overlay_opacity?: number | null
          primary_cta_label?: string | null
          primary_cta_url?: string | null
          secondary_cta_label?: string | null
          secondary_cta_url?: string | null
          subheading?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          folder: string | null
          id: string
          mime_type: string | null
          public_url: string
          size_bytes: number | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          folder?: string | null
          id?: string
          mime_type?: string | null
          public_url: string
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          folder?: string | null
          id?: string
          mime_type?: string | null
          public_url?: string
          size_bytes?: number | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      mission_cards: {
        Row: {
          created_at: string
          description: string
          display_order: number
          icon: string
          id: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          icon?: string
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          is_external: boolean
          label: string
          parent_id: string | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_external?: boolean
          label: string
          parent_id?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_external?: boolean
          label?: string
          parent_id?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      programs: {
        Row: {
          created_at: string
          cta_label: string | null
          description: string | null
          display_order: number
          event_date: string | null
          event_type: string | null
          id: string
          image_url: string | null
          is_active: boolean
          location: string | null
          registration_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          description?: string | null
          display_order?: number
          event_date?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          registration_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          description?: string | null
          display_order?: number
          event_date?: string | null
          event_type?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string | null
          registration_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      resource_cards: {
        Row: {
          created_at: string
          cta_label: string | null
          cta_url: string | null
          description: string | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      statistics: {
        Row: {
          created_at: string
          display_order: number
          icon: string | null
          id: string
          is_active: boolean
          label: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          label: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          label?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_categories: {
        Row: {
          created_at: string
          display_order: number
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      video_cta: {
        Row: {
          background_color: string | null
          button_text: string | null
          button_url: string | null
          created_at: string
          description: string | null
          display_order: number
          end_date: string | null
          icon: string | null
          id: string
          is_visible: boolean
          open_new_tab: boolean
          start_date: string | null
          text_color: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          end_date?: string | null
          icon?: string | null
          id?: string
          is_visible?: boolean
          open_new_tab?: boolean
          start_date?: string | null
          text_color?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          button_text?: string | null
          button_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          end_date?: string | null
          icon?: string | null
          id?: string
          is_visible?: boolean
          open_new_tab?: boolean
          start_date?: string | null
          text_color?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          display_order: number
          duration: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          publish_date: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          speaker: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
          view_count: number
          vimeo_url: string | null
          youtube_url: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          duration?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          publish_date?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          speaker?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          view_count?: number
          vimeo_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          duration?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          publish_date?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          speaker?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          view_count?: number
          vimeo_url?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "video_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
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
      app_role: ["admin", "editor", "viewer"],
    },
  },
} as const
