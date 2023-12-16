import { AddAuthentication, IAuthorization } from '@wangminghua/koa-restful'
import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken'
import { Context } from 'koa'

import { AuthorizationSchemes } from '../utils/share'

/**
 * CookiesAuthorizationOptions
 */
type CookiesAuthorizationOptions = {
    /**
     * 鉴权头
     * @default 'x-accese-token'
     */
    authorityHeader?: string
    /**
     * secret
     */
    secret: string
    /**
     * 以秒或描述时间跨度的字符串vercel/ms表示。
     * @default '7d'
     * @example
     * 例如:60，“2天”，“10h”，“7d”。数值被解释为秒数。如果使用字符串，请确保提供时间单位(天、小时等)，否则默认使用毫秒单位("120"等于"120ms")。
     */
    expiresIn?: number | string
    /**
     * 签名选项
     */
    signOptions?: Omit<SignOptions, 'expiresIn'>
    /**
     * 验证jwt的选项
     */
    verifyOptions?: VerifyOptions
}

/**
 * Cookie 身份认证方法
 */
export class CookiesAuthorization implements IAuthorization {
    public static readonly scheme: AuthorizationSchemes = 'Cookies'
    options: CookiesAuthorizationOptions
    constructor(options: CookiesAuthorizationOptions) {
        this.options = options
    }
    async hook(ctx: Context): Promise<boolean> {
        const { authorityHeader = 'x-accese-token' } = this.options
        const token = ctx.cookies.get(authorityHeader)
        if (!token) return false
        try {
            this.verify(token)
            return true
        } catch (err) {
            return false
        }
    }
    verify(token: string) {
        const { secret, verifyOptions } = this.options
        jwt.verify(token, secret, { ...verifyOptions })
    }
    /**
     * jwt
     * @param payload
     * @param secret
     * @param expiresIn
     */
    sign(payload: JwtPayload): string {
        const { secret, expiresIn = '7d', signOptions } = this.options
        return jwt.sign(payload, secret, { expiresIn, ...signOptions })
    }
}
/**
 * 添加 Cookies 身份认证方案
 */
export function AddCookiesAuthentication(options: CookiesAuthorizationOptions | (() => CookiesAuthorizationOptions)) {
    const opts = typeof options === 'function' ? options() : options
    const cookies = new CookiesAuthorization(opts)
    AddAuthentication(CookiesAuthorization.scheme, cookies)
    return cookies
}