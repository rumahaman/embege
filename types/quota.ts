export interface VenueQuota {
    city: string;
    quota: number;
    registered: number;
    remaining: number;
    status: string;
  }
  
  export interface QuotaResponse {
    success: boolean;
    reservationStatus: string;
    quotas: VenueQuota[];
  }