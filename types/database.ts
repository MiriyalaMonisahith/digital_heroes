export type UserRole = "subscriber" | "admin";
export type SubscriptionPlan = "monthly" | "yearly";
export type SubscriptionStatus = "active" | "inactive" | "cancelled" | "lapsed";
export type DonationType = "subscription_share" | "independent";
export type DrawStatus = "draft" | "simulated" | "published";
export type DrawType = "random" | "algorithmic";
export type MatchTier = "5" | "4" | "3";
export type WinnerStatus = "unverified" | "pending" | "approved" | "rejected" | "paid";

export type CharityEvent = {
  name: string;
  date: string;
  location: string;
};

export type Profile = {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
};

export type Charity = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image_url: string | null;
  website: string | null;
  events: CharityEvent[];
  is_featured: boolean;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan: SubscriptionPlan | null;
  status: SubscriptionStatus;
  charity_id: string | null;
  charity_percentage: number;
  started_at: string | null;
  renews_at: string | null;
  cancelled_at: string | null;
  is_mock_payment: boolean;
  updated_at: string;
};

export type Score = {
  id: string;
  user_id: string;
  score: number;
  played_on: string;
  created_at: string;
};

export type Donation = {
  id: string;
  user_id: string | null;
  charity_id: string;
  amount: number;
  type: DonationType;
  created_at: string;
};

export type Draw = {
  id: string;
  month: string;
  status: DrawStatus;
  draw_type: DrawType;
  winning_numbers: number[] | null;
  entrant_count: number;
  pool_total: number;
  pool_5: number;
  pool_4: number;
  pool_3: number;
  jackpot_rollover_in: number;
  jackpot_rollover_out: number;
  simulated_at: string | null;
  published_at: string | null;
  created_by: string | null;
  created_at: string;
};

export type DrawEntry = {
  id: string;
  draw_id: string;
  user_id: string;
  numbers: number[];
  created_at: string;
};

export type DrawResult = {
  id: string;
  draw_id: string;
  user_id: string;
  match_tier: MatchTier | null;
  prize_amount: number;
  created_at: string;
};

export type Winner = {
  id: string;
  draw_result_id: string;
  user_id: string;
  proof_url: string | null;
  status: WinnerStatus;
  submitted_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
};

// Minimal Supabase generic Database type — hand-maintained (no live project to
// run `supabase gen types` against yet). Row/Insert/Update all share the same
// shape for simplicity; Insert/Update omit server-generated fields via Partial.
type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: never[];
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<Profile>;
      charities: Table<Charity>;
      subscriptions: Table<Subscription>;
      scores: Table<Score>;
      donations: Table<Donation>;
      draws: Table<Draw>;
      draw_entries: Table<DrawEntry>;
      draw_results: Table<DrawResult>;
      winners: Table<Winner>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      subscription_plan: SubscriptionPlan;
      subscription_status: SubscriptionStatus;
      donation_type: DonationType;
      draw_status: DrawStatus;
      draw_type: DrawType;
      match_tier: MatchTier;
      winner_status: WinnerStatus;
    };
  };
}
