import { AddDependency, Controller, FromQuery, HttpGet, Injection } from '@wangminghua/koa-restful'
import { AddJwtBearerAuthentication, JwtBearerAuthorization } from '../src'
import { bootstrap } from '../src/utils/bootstrap'

const jwtBearer = AddJwtBearerAuthentication({
    secret: 'lw5aCBsUARJuTYhP',
})

AddDependency(jwtBearer, { alias: [JwtBearerAuthorization] })

@Controller()
class Test {
    @Injection()
    bearer!: JwtBearerAuthorization

    @HttpGet()
    test1() {
        return this.bearer.sign({
            aaa: '123456',
        })
    }

    @HttpGet()
    test2(@FromQuery() token: string) {
        return this.bearer.verify(token)
    }
}

bootstrap(3001)
