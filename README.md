```sh
npx parcel index.html
```

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
