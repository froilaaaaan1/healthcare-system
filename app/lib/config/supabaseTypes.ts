export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          alternate_email: string
          alternate_mobile_number: number
          appointment_id: number
          city: string
          date_of_appointment: string
          date_of_birth: string
          department: string
          first_name: string
          home_address_line_1: string
          home_address_line_2: string
          house_number: string
          last_name: string
          middle_name: string
          mobile_number: number
          province: string
          service: string
          sex: string
          zip_code: number
        }
        Insert: {
          alternate_email: string
          alternate_mobile_number: number
          appointment_id?: number
          city: string
          date_of_appointment: string
          date_of_birth: string
          department: string
          first_name: string
          home_address_line_1: string
          home_address_line_2: string
          house_number: string
          last_name: string
          middle_name: string
          mobile_number: number
          province: string
          service: string
          sex: string
          zip_code: number
        }
        Update: {
          alternate_email?: string
          alternate_mobile_number?: number
          appointment_id?: number
          city?: string
          date_of_appointment?: string
          date_of_birth?: string
          department?: string
          first_name?: string
          home_address_line_1?: string
          home_address_line_2?: string
          house_number?: string
          last_name?: string
          middle_name?: string
          mobile_number?: number
          province?: string
          service?: string
          sex?: string
          zip_code?: number
        }
        Relationships: []
      }
      doctors_info: {
        Row: {
          department: string | null
          id: string
        }
        Insert: {
          department?: string | null
          id: string
        }
        Update: {
          department?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctors_info_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          age: number | null
          barangay: string | null
          city: string | null
          first_name: string | null
          gender: string | null
          last_name: string | null
          middle_name: string | null
          role: string | null
          user_id: string
          verified_user: boolean
        }
        Insert: {
          address?: string | null
          age?: number | null
          barangay?: string | null
          city?: string | null
          first_name?: string | null
          gender?: string | null
          last_name?: string | null
          middle_name?: string | null
          role?: string | null
          user_id: string
          verified_user?: boolean
        }
        Update: {
          address?: string | null
          age?: number | null
          barangay?: string | null
          city?: string | null
          first_name?: string | null
          gender?: string | null
          last_name?: string | null
          middle_name?: string | null
          role?: string | null
          user_id?: string
          verified_user?: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
