import { Controller, FromQuery, HttpGet, Injection } from '@wangminghua/koa-restful'
import { Context } from 'koa'
import { AddCookieAuthentication, AddJwtBearerAuthentication, AddSwaggerUI, JwtBearerAuthorization, SimpleAuthorize } from '../src'
import { bootstrap } from '../src/utils/bootstrap'

const jwtBearer = AddJwtBearerAuthentication({ secret: 'lw5aCBsUARJuTYhP' })
const cookie = AddCookieAuthentication({ secret: 'lw5aCBsUARJuTYhP' })

AddSwaggerUI('src-example/**/*.ts')

@Controller()
class Test {
    @Injection()
    bearer!: JwtBearerAuthorization

    @HttpGet()
    test1(ctx: Context) {
        ctx.cookies.set(
            cookie.authorityHeader,
            this.bearer.sign({
                aaa: '123456',
            })
        )
        return this.bearer.sign({
            aaa: '123456',
        })
    }

    @HttpGet()
    test2(@FromQuery() token: string) {
        return this.bearer.verify(token)
    }

    @SimpleAuthorize(['Bearer', 'Cookie'])
    @HttpGet()
    test3() {
        return `${new Date().toLocaleString()}`
    }
}

bootstrap(3001)
