import JWTService from './JWTService';
import * as pgPromise from 'pg-promise';
import RedisClient from '../redis/RedisClient';
declare class SessionService {
    db: pgPromise.IDatabase<any>;
    jwtService: JWTService;
    jwtExpiresIn: number;
    redisClient: RedisClient;
    constructor(dbConn: pgPromise.IDatabase<any>, redisClient: RedisClient);
    get jwtCookieOptions(): {
        maxAge: number;
        secure: boolean;
        httpOnly: boolean;
        path: string;
    };
    get refreshCookieOptions(): {
        maxAge: number;
        secure: boolean;
        httpOnly: boolean;
        path: string;
    };
    getUserById(userId: string): Promise<any>;
    createSession(userId: string, ua: string | null, ip: string | null): Promise<{
        sessionId: any;
        jwt: string;
        user: any;
    }>;
    generateRefreshToken(sessionId: string): Promise<{
        sessionId: any;
        jwt: string;
        user: any;
    } | null>;
    getUserFromSession(token: string): Promise<any> | null;
    logout(sessionId: string): Promise<null>;
    getActiveSessionsFor(userId: string): Promise<any[]>;
}
export default SessionService;
