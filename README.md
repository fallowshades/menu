#

## start up

- in client folder

```sh
npx parcel index.html
```

- in root folder

```sh
npm run dev
```

##

- problemmatic

```sh
rm -rf .parcel-cache
rm -rf node_modules
rm package-lock.json
```

```sh
 git rm -r --cached .parcel-cache/
```

#### tsc

.gitignore

- .parcel-cache

app.ts

- app.ts:20 Error fetching menu: SyntaxError: Unexpected token '<', - "<!DOCTYPE "... is not valid JSON

```ts
const loader = async () => {
  try {
    const settings = undefined
    const response = await fetch('http://localhost:1234/menu', settings)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const menu: Response = await response.json() // Parse the response as JSON

    return menu
  } catch (error) {
    console.error('Error fetching menu:', error) // Handle any errors
  }
}
```

- display fragments --> single components is a combination of template strings

```ts
function diplayMenuItems(menuItems: MenuItem[]) {
  let displayMenu: string[] | string = menuItems.map(function (item) {
    ...
  })}
```

- category is arrayified
- map and put into doom
- can add listeners afterwards by searching for the dom (after placment, can do before placment)
- the categories is accecible in a attribut that determin if all items are to be rendered or a filtered version

```ts
function displayMenuButtons() {
  const categories = menu.reduce<string[]>(
    function (values, item: MenuItem) {
      if (!values.includes(item.category)) {
        //lib: es2016
        values.push(item.category)
      }

    })}



...

     filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      // console.log(e.currentTarget.dataset);
      const category = (e.currentTarget as HTMLElement).dataset.id
      const menuCategory = menu.filter(function (menuItem) {
        // console.log(menuItem.category);
        if (menuItem.category === category) {
          return menuItem
        }
      })
      if (category === 'all') {
        diplayMenuItems(menu)
      } else {
        diplayMenuItems(menuCategory)
      }
    })
  })

```

proxyrc.json

- something does not work

```json
{
  "/menu": {
    "target": "https://6ldruff9ul.execute-api.eu-north-1.amazonaws.com",
    "pathRewrite": {
      "^/menu": "/menu"
    },
    "changeOrigin": true,
    "secure": false
  }
}
```

index.html

```html
<script
  type="module"
  src="./src/app.ts"
></script>
```

tsConfig.json

- build environment from src directory

```json
{
  "compilerOptions": {
    "target": "ES6" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,

    "module": "ES6" /* Specify what module code is generated. */,
    "noEmitOnError": true /* Disable emitting files if any type checking errors are reported. */,

    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */,
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,
    /* Type Checking */
    "strict": true /* Enable all strict type-checking options. */,
    "skipLibCheck": true /* Skip type checking all .d.ts files. */,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "outDir": "./dist",
    "sourceMap": true,
    "resolveJsonModule": true,
    "noImplicitAny": true,

    "lib": ["es2016", "dom"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

#### get cors error

app.ts

- connection refused

```ts
const loader = async (): Promise<MenuItems[]> => {
  const type = 'pizza'
  const API_URL = 'http://localhost:3000/api/menu'
  const API_KEY = 'fallow'
  try {
    console.log(`Fetching menu from ${API_URL}?type=${type}`)
    console.log(`Fetching menu from ${API_URL}?type=${type}`)
    const response = await fetch(`${API_URL}?type=${type}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-zocom': API_KEY,
      },
    })
    // Check if the response is okay
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Parse the response as JSON
    const menu: MenuItems[] = await response.json()
    return menu // Return the parsed menu
  } catch (error) {
    console.error('Error fetching menu:', error) // Handle any errors
    return [] // Return an empty array to fulfill the return type requirement
  }
}
```

- create package.json

```sh
npm init -y
npm install
npm run dev
```

package.json

- not "type": "module",

````json
{
  "name": "erik-filmon",
  "version": "1.0.0",
  "description": "```sh\r npx parcel index.html\r ```",
  "main": "index.js",
  "scripts": {
    "server": "nodemon server",
    "client": "cd ../client && npm run dev",
    "dev": "concurrently --kill-others-on-fail \" npm run server\" \" npm run client\"",
    "build": "tsc",
    "compile:watch": "tsc --watch",
    "serve": "live-server",
    "proxy": "node server.js"
  },
  "devDependencies": {
    "live-server": "^1.2.2",
    "typescript": "^5.6.3",
    "nodemon": "^3.1.4",
    "concurrently": "^6.2.1",
    "express": "^4.17.1",
    "cors": "^2.8.5",
    "http-proxy-middleware": "^2.0.1",
    "dotenv": "^10.0.0"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
````

####

app.ts

- the array response is a mongoose query

```ts
const loader = async (): Promise<MenuItemsResponse> => {
try{
  ...
      const menu: MenuItemsResponse = await response.json()
    return menu // Return the parsed menu
  } catch (error) {

    return { items: [] } // Return an empty array to fulfill the return type requirement
  }
}
```

- use the same types

```ts
window.addEventListener('DOMContentLoaded', async function () {
  diplayMenuItems(menu)
  displayMenuButtons()
  const menuNew = await loader()

  console.log(menuNew)
  const transformedMenuNew = (menuNew as MenuItemsResponse).items.map(
    (item) => ({
      id: item.id,
      title: item.name, // Renaming 'name' to 'title'
      category: item.type, // Renaming 'type' to 'category'
      price: item.price,
      img: item.imgUrl, // Renaming 'imgUrl' to 'img'
      desc:
        item.description +
        (item.toppings ? ' Toppings: ' + item.toppings.join(', ') : ''), // Combining description and optional toppings
    })
  )
  diplayMenuItems(transformedMenuNew)
  displayMenuButtons()
})

interface MenuItemRemote {
  ...
  }
interface MenuItemsResponse {
  items: MenuItemRemote[] | []
}
```
