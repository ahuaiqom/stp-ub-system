/**
 * JWT payload shape per contract section 5.3.
 *
 *   roles: { [kstIdentifier]: string[] }
 *
 * In this single-KST monolith we expose ourselves as `kst_jatikerto`.
 */
export interface JwtAccessPayload {
  username: string;
  name: string;
  roles: Record<string, string[]>;
  sub: string;       // user UUID (UUIDv6/v4 surrogate of internal id)
  iss?: string;
  iat?: number;
  exp?: number;
  aud?: string;
}

export interface JwtRefreshPayload {
  sub: string;
  jti: string;       // unique id for revocation tracking
  iat?: number;
  exp?: number;
}

/** Express request augmentation. */
declare global {
  namespace Express {
    interface Request {
      auth?: JwtAccessPayload;
    }
  }
}
