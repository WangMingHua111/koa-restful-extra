import { AddController, CacheService, CreateAST2OpenAPI, HttpGet, Injection } from '@wangminghua/koa-restful'

class SwaggerController {
    static swaggerDir: string = 'src/**/*.ts'

    @Injection()
    cache?: CacheService

    @HttpGet('')
    index() {
        return `<!DOCTYPE html>
<html>
<head>
  <title>Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.10.3/swagger-ui.min.css">
</head>
<body>
  <div id="swagger-ui"></div>

  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.10.3/swagger-ui-bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.10.3/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {

      const ui = SwaggerUIBundle({
        url: '/swagger/json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      })
    }
  </script>
</body>
</html>`
    }
    @HttpGet()
    async json(): Promise<any> {
        const read = () => {
            const openapi = CreateAST2OpenAPI(SwaggerController.swaggerDir)
            const parseStr = openapi.parse()
            return JSON.parse(parseStr)
        }
        if (this.cache) {
            return await this.cache.get(`sys:${SwaggerController.name}:json`, async () => {
                return read()
            })
        } else {
            return read()
        }
    }
}

/**
 * 添加SwaggerUI
 * @param swaggerDir 控制器扫描目录，默认值
 */
export function AddSwaggerUI(swaggerDir: string = 'src/**/*.ts') {
    SwaggerController.swaggerDir = swaggerDir
    AddController(SwaggerController, '/swagger', { prefix: '' })
}
