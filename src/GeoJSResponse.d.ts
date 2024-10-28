declare global {
  interface GeoJSResponse {
    latitude?: string;
    longitude?: string;
    accuracy?: number;
    city?: string;
    timezone?: string;
    country?: string;
    organization?: string;
    asn?: number;
    area_code?: string;
    organization_name?: string;
    country_code?: string;
    country_code3?: string;
    continent_code?: string;
    ip?: string;
    region?: string;
  }
}

export {};
