# A Heroku ready image resizing service.

Welcome to easy image resizing using the `image-resizer` service, a Heroku ready app using Node.js as a scalable backend to your platform.

For more detailed instructions take a look at the [parent repo](https://github.com/jimmynicol/image-resizer). Any question please file them on [Github](https://github.com/jimmynicol/image-resizer/issues).

## Image Urls

### Preset Images
`/:variant/:type/name.ext`

Example:

`/w300/backdrop/563f60e4d5fa255ae3a48782.jpeg`

### Custom Manipulation
`/custom/:definition/:type/name.ext`

Example:

`/custom/w92-h138-cfill/backdrop/563f60e4d5fa255ae3a48782.jpeg`