export interface Url {
    _id: string;
    longUrl: string;
    shortId: string;
    clicks: number;
    name: string;
    user: {
      _id: string;
      name: string;
    };
    createdAt: string;
    shortUrl: string;
    expiresAt?: string;
}