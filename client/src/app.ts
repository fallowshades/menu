import menu from './data'
// get parent element
const sectionCenter = document.querySelector('.section-center') as HTMLElement
const btnContainer = document.querySelector('.btn-container') as HTMLElement
// display all items when page loads

const loader = async <T extends ApiResponse>(type = ''): Promise<T> => {
  const API_URL = 'http://localhost:3000/api/menu'
  const API_KEY = 'fallow'
  try {
    console.log(`Fetching menu from ${API_URL}?type=${type}`)
    console.log(`Fetching menu from ${API_URL}?type=${type}`)
    const response = await fetch(`${API_URL}${type ? `?type=${type}` : ''}`, {
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
    const menu = await response.json()
    return menu as T // Return the parsed menu
  } catch (error) {
    console.error('Error fetching menu:', error) // Handle any errors
    throw error
    //return { items: [] } // Return an empty array to fulfill the return type requirement
  }
}

window.addEventListener('DOMContentLoaded', async function () {
  diplayMenuItems(menu)
  displayMenuButtons()
  const menuNew = await loader<MenuItemsResponse>() //'pizza'

  console.log(menuNew)
  const transformedMenuNew = (menuNew as MenuItemsResponse).items.map(
    (item): Partial<MenuItem> => ({
      id: item.id,
      title: item.name, // Renaming 'name' to 'title'
      category: item.type, // Renaming 'type' to 'category'
      price: item.price,
      img: item.imgUrl, // Renaming 'imgUrl' to 'img'
      desc:
        item.description +
        (item.toppings ? ' Toppings: ' + item.toppings.join(', ') : ''), // Combining description and optional toppings
    })
  ) as MenuItem[]
  diplayMenuItems(transformedMenuNew)
  displayMenuButtons(transformedMenuNew)
})

interface MenuItemRemote {
  id: number
  type: string
  name: string
  imgUrl: string
  description: string
  price: number
  toppings?: string[] // Optional property
}
type ApiResponse = Record<string, any>
type MenuItemsResponse = Record<'items', MenuItemRemote[] | []> //all mongodb responses
// interface MenuItemsResponse {
//   items: MenuItemRemote[] | []
// }
//
export interface MenuItem {
  id: number
  title: string
  category: string
  price: number
  img: string
  desc: string
}

function diplayMenuItems(menuItems: MenuItem[]) {
  let displayMenu: string[] | string = menuItems.map(function (item) {
    // console.log(item);

    return `<article class="menu-item">
          <img src=${item.img} alt=${item.title} class="photo" />
          <div class="item-info">
            <header>
              <h4>${item.title}</h4>
              <h4 class="price">$${item.price}</h4>
              
            </header>
            <p class="item-text">
              ${item.desc}
            </p>
          </div>
            <footer>
          <a href="index.html/${item.id}">
          will it kill you?
          </a>
          </footer>
        </article>`
  })
  displayMenu = displayMenu.join('') //is a string here
  // console.log(displayMenu);

  sectionCenter.innerHTML = displayMenu
}
async function displayMenuButtons(menuNew?: MenuItem[]) {
  console.log(menu, menuNew)
  //const categories = ['pizza', 'salad', 'drink', 'all']
  const categories = (menuNew || menu).reduce<string[]>(
    function (values, item: MenuItem) {
      if (!values.includes(item.category)) {
        //lib: es2016
        values.push(item.category)
      }
      return values
    },
    ['all']
  )
  const categoryBtns = categories
    .map(function (category) {
      return `<button type="button" class="filter-btn" data-id=${category}>
          ${category}
        </button>`
    })
    .join('')
  //see className coupling
  btnContainer.innerHTML = categoryBtns
  const filterBtns = btnContainer.querySelectorAll('.filter-btn')
  console.log(filterBtns)

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', async function (e) {
      // console.log(e.currentTarget.dataset);
      const category = (
        e.currentTarget as HTMLElement
      ).dataset.id?.toLocaleLowerCase()

      const menuCategory: MenuItem[] = await loader(category).then(
        (response) => {
          const typedResponse = response as MenuItemsResponse
          return typedResponse.items.map((item: MenuItemRemote) => ({
            id: item.id,
            title: item.name, // Map 'name' to 'title'
            category: item.type, // Map 'type' to 'category'
            price: item.price,
            img: item.imgUrl, // Map 'imgUrl' to 'img'
            desc:
              item.description +
              (item.toppings ? ' Toppings: ' + item.toppings.join(', ') : ''), // Combine 'description' and optional toppings
          }))
        }
      )
      // const menuCategory = menu.filter(function (menuItem) {
      //   // console.log(menuItem.category);
      //   if (menuItem.category === category) {
      //     return menuItem
      //   }

      if (category === 'all') {
        const all = menu // menuNew || ----
        diplayMenuItems(all)
      } else {
        diplayMenuItems(menuCategory)
      }
    })
  })
}
