import { AddController, CreateAST2OpenAPI, HttpGet } from '@wangminghua/koa-restful'

class SwaggerController {
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
        const openapi = CreateAST2OpenAPI('./**/*.ts')
        const parseStr = openapi.parse()
        return JSON.parse(parseStr)
    }
}

/**
 * 添加内存缓存服务
 * @returns
 */
export function AddSwaggerUI() {
    AddController(SwaggerController, '/swagger')
}
